package com.university.service.admin;

import com.university.dto.request.admin.DangKyTinChiAdminRequestDTO;
import com.university.dto.response.admin.DangKyTinChiAdminResponseDTO;
import com.university.entity.DangKyTinChi;
import com.university.entity.HocVien;
import com.university.entity.LopHocPhan;
import com.university.enums.TrangThaiLHP;
import com.university.exception.SimpleMessageException;
import com.university.mapper.admin.DangKyTinChiAdminMapper;
import com.university.repository.admin.DangKyTinChiAdminRepository;
import com.university.repository.admin.HocVienAdminRepository;
import com.university.repository.admin.LopHocPhanAdminRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DangKyTinChiAdminService {

    private static final int MAX_TIN_CHI = 25;

    private final DangKyTinChiAdminRepository dangKyTinChiAdminRepository;
    private final HocVienAdminRepository hocVienAdminRepository;
    private final LopHocPhanAdminRepository lopHocPhanAdminRepository;
    private final DangKyTinChiAdminMapper dangKyTinChiAdminMapper;

    @Transactional
    public DangKyTinChiAdminResponseDTO create(DangKyTinChiAdminRequestDTO request) {
        HocVien hocVien = hocVienAdminRepository.findById(request.getHocVienId())
                .orElseThrow(() -> new EntityNotFoundException("Học viên không tồn tại"));

        LopHocPhan lopHocPhan = lopHocPhanAdminRepository.findById(request.getLopHocPhanId())
                .orElseThrow(() -> new EntityNotFoundException("Lớp học phần không tồn tại"));

        validateRegistration(hocVien.getId(), lopHocPhan, null);

        DangKyTinChi dangKyTinChi = dangKyTinChiAdminMapper.toEntity(request);
        dangKyTinChi.setHocVien(hocVien);
        dangKyTinChi.setLopHocPhan(lopHocPhan);

        try {
            DangKyTinChi saved = dangKyTinChiAdminRepository.saveAndFlush(dangKyTinChi);
            return dangKyTinChiAdminRepository.findDTOById(saved.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy đăng ký tín chỉ sau khi tạo"));
        } catch (DataIntegrityViolationException e) {
            throw new SimpleMessageException("Học viên đã đăng ký lớp học phần này");
        }
    }

    public DangKyTinChiAdminResponseDTO getById(UUID id) {
        return dangKyTinChiAdminRepository.findDTOById(id)
                .orElseThrow(() -> new EntityNotFoundException("Đăng ký tín chỉ không tồn tại"));
    }

    public List<DangKyTinChiAdminResponseDTO> getAll() {
        return dangKyTinChiAdminRepository.findAllDTO();
    }

    public List<DangKyTinChiAdminResponseDTO> getAllByHocVien(UUID hocVienId) {
        if (!hocVienAdminRepository.existsById(hocVienId)) {
            throw new EntityNotFoundException("Học viên không tồn tại");
        }
        return dangKyTinChiAdminRepository.findAllByHocVienIdDTO(hocVienId);
    }

    public List<DangKyTinChiAdminResponseDTO> getAllByLopHocPhan(UUID lopHocPhanId) {
        if (!lopHocPhanAdminRepository.existsById(lopHocPhanId)) {
            throw new EntityNotFoundException("Lớp học phần không tồn tại");
        }
        return dangKyTinChiAdminRepository.findAllByLopHocPhanIdDTO(lopHocPhanId);
    }

    @Transactional
    public DangKyTinChiAdminResponseDTO update(UUID id, DangKyTinChiAdminRequestDTO request) {
        DangKyTinChi existing = dangKyTinChiAdminRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Đăng ký tín chỉ không tồn tại"));

        HocVien hocVien = hocVienAdminRepository.findById(request.getHocVienId())
                .orElseThrow(() -> new EntityNotFoundException("Học viên không tồn tại"));

        LopHocPhan lopHocPhan = lopHocPhanAdminRepository.findById(request.getLopHocPhanId())
                .orElseThrow(() -> new EntityNotFoundException("Lớp học phần không tồn tại"));

        validateRegistration(hocVien.getId(), lopHocPhan, id);

        existing.setHocVien(hocVien);
        existing.setLopHocPhan(lopHocPhan);
        dangKyTinChiAdminMapper.updateEntity(existing, request);

        try {
            DangKyTinChi updated = dangKyTinChiAdminRepository.saveAndFlush(existing);
            return dangKyTinChiAdminRepository.findDTOById(updated.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy đăng ký tín chỉ sau khi cập nhật"));
        } catch (DataIntegrityViolationException e) {
            throw new SimpleMessageException("Học viên đã đăng ký lớp học phần này");
        }
    }

    @Transactional
    public void delete(UUID id) {
        DangKyTinChi dangKyTinChi = dangKyTinChiAdminRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Đăng ký tín chỉ không tồn tại"));
        dangKyTinChiAdminRepository.delete(dangKyTinChi);
    }

    @Transactional
    public void deleteAllByList(List<UUID> ids) {
        if (ids == null || ids.isEmpty()) {
            return;
        }
        try {
            dangKyTinChiAdminRepository.deleteAllByIdIn(ids);
        } catch (Exception e) {
            throw new SimpleMessageException("Lỗi khi xóa danh sách: " + e.getMessage());
        }
    }

    private void validateRegistration(UUID hocVienId, LopHocPhan lopHocPhan, UUID excludeId) {
        UUID lopHocPhanId = lopHocPhan.getId();
        UUID monHocId = lopHocPhan.getMonHoc().getId();

        boolean duplicated = excludeId == null
                ? dangKyTinChiAdminRepository.existsByHocVien_IdAndLopHocPhan_Id(hocVienId, lopHocPhanId)
                : dangKyTinChiAdminRepository.existsByHocVien_IdAndLopHocPhan_IdAndIdNot(
                        hocVienId, lopHocPhanId, excludeId);
        if (duplicated) {
            throw new SimpleMessageException("Học viên đã đăng ký lớp học phần này");
        }

        if (lopHocPhan.getTrangThai() != TrangThaiLHP.MO_DANG_KY) {
            throw new SimpleMessageException("Lớp học phần không mở đăng ký");
        }

        if (lopHocPhan.getHanDangKy() != null && LocalDateTime.now().isAfter(lopHocPhan.getHanDangKy())) {
            throw new SimpleMessageException("Đã hết hạn đăng ký");
        }

        boolean trungLich = excludeId == null
                ? dangKyTinChiAdminRepository.existsTrungLichFull(hocVienId, lopHocPhanId)
                : dangKyTinChiAdminRepository.existsTrungLichFullExcludingId(hocVienId, lopHocPhanId, excludeId);
        if (trungLich) {
            throw new SimpleMessageException("Trùng lịch học");
        }

        boolean daHocMon = excludeId == null
                ? dangKyTinChiAdminRepository.daHocMon(hocVienId, monHocId)
                : dangKyTinChiAdminRepository.daHocMonExcludingId(hocVienId, monHocId, excludeId);
        if (daHocMon) {
            throw new SimpleMessageException("Học viên đã học môn này");
        }

        if (!dangKyTinChiAdminRepository.daHocMonTienQuyet(hocVienId, monHocId)) {
            throw new SimpleMessageException("Học viên chưa học môn tiên quyết");
        }

        Integer tongTinChiDangKy = excludeId == null
                ? dangKyTinChiAdminRepository.sumTinChiByHocVien(hocVienId)
                : dangKyTinChiAdminRepository.sumTinChiByHocVienExcludingId(hocVienId, excludeId);
        int tongTinChi = tongTinChiDangKy == null ? 0 : tongTinChiDangKy;
        int tinChiMoi = lopHocPhan.getMonHoc().getSoTinChi() == null ? 0 : lopHocPhan.getMonHoc().getSoTinChi();
        if (tongTinChi + tinChiMoi > MAX_TIN_CHI) {
            throw new SimpleMessageException("Vượt quá số tín chỉ tối đa");
        }

        int soLuongDangKy = dangKyTinChiAdminRepository.countByLopHocPhan_Id(lopHocPhanId);
        boolean sameRegistrationClass = excludeId != null
                && dangKyTinChiAdminRepository.findById(excludeId)
                        .map(d -> d.getLopHocPhan().getId().equals(lopHocPhanId))
                        .orElse(false);
        if (!sameRegistrationClass && lopHocPhan.getSoLuongToiDa() != null && soLuongDangKy >= lopHocPhan.getSoLuongToiDa()) {
            throw new SimpleMessageException("Lớp học phần đã đầy");
        }
    }
}
