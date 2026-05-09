package com.university.service.admin;

import com.university.dto.request.admin.HocPhiAdminRequestDTO;
import com.university.dto.response.admin.HocPhiAdminResponseDTO;
import com.university.entity.HocKi;
import com.university.entity.HocPhi;
import com.university.entity.HocVien;
import com.university.enums.HocPhiEnum;
import com.university.exception.SimpleMessageException;
import com.university.mapper.admin.HocPhiAdminMapper;
import com.university.repository.admin.HocKiAdminRepository;
import com.university.repository.admin.HocPhiAdminRepository;
import com.university.repository.admin.HocVienAdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class HocPhiAdminService {

    private final HocPhiAdminRepository hocPhiAdminRepository;
    private final HocVienAdminRepository hocVienAdminRepository;
    private final HocKiAdminRepository hocKiAdminRepository;
    private final HocPhiAdminMapper hocPhiMapper;

    @Transactional
    public HocPhiAdminResponseDTO create(HocPhiAdminRequestDTO request) {
        if (request == null)
            throw new SimpleMessageException("Dữ liệu không hợp lệ");

        HocVien hocVien = hocVienAdminRepository.findById(request.getHocVienId())
                .orElseThrow(() -> new SimpleMessageException("Học viên không tồn tại"));

        HocKi hocKi = hocKiAdminRepository.findById(request.getHocKiId())
                .orElseThrow(() -> new SimpleMessageException("Học kì không tồn tại"));

        HocPhi entity = hocPhiMapper.toEntity(request);
        entity.setHocVien(hocVien);
        entity.setHocKi(hocKi);
        entity.setCreatedAt(request.getCreatedAt() != null ? request.getCreatedAt() : LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());

        HocPhi saved = hocPhiAdminRepository.save(entity);
        return hocPhiMapper.toResponseDTO(saved, hocVien, hocKi);
    }

    @Transactional
    public HocPhiAdminResponseDTO update(UUID id, HocPhiAdminRequestDTO request) {
        HocPhi existing = hocPhiAdminRepository.findById(id)
                .orElseThrow(() -> new SimpleMessageException("Học phí không tồn tại"));

        HocVien hocVien = hocVienAdminRepository.findById(request.getHocVienId())
                .orElseThrow(() -> new SimpleMessageException("Học viên không tồn tại"));

        HocKi hocKi = hocKiAdminRepository.findById(request.getHocKiId())
                .orElseThrow(() -> new SimpleMessageException("Học kì không tồn tại"));

        hocPhiMapper.updateEntity(existing, request);
        existing.setHocVien(hocVien);
        existing.setHocKi(hocKi);
        existing.setUpdatedAt(LocalDateTime.now());

        HocPhi updated = hocPhiAdminRepository.save(existing);
        return hocPhiMapper.toResponseDTO(updated, hocVien, hocKi);
    }

    public HocPhiAdminResponseDTO getById(UUID id) {
        HocPhi entity = hocPhiAdminRepository.findById(id)
                .orElseThrow(() -> new SimpleMessageException("Học phí không tồn tại"));
        HocVien hocVien = hocVienAdminRepository.findById(entity.getHocVien().getId())
                .orElseThrow(() -> new SimpleMessageException("Học viên không tồn tại"));

        HocKi hocKi = hocKiAdminRepository.findById(entity.getHocKi().getId())
                .orElseThrow(() -> new SimpleMessageException("Học kì không tồn tại"));

        return hocPhiMapper.toResponseDTO(entity, hocVien, hocKi);
    }

    @Transactional
    public HocPhiAdminResponseDTO createByHocVien(UUID hocVienId, UUID hocKiId) {
        HocVien hocVien = hocVienAdminRepository.findById(hocVienId)
                .orElseThrow(() -> new SimpleMessageException("Học viên không tồn tại"));

        HocKi hocKi = hocKiAdminRepository.findById(hocKiId)
                .orElseThrow(() -> new SimpleMessageException("Học kì không tồn tại"));

        Long tongTinChi = hocPhiAdminRepository.getTongTinChiByHocVienAndHocKi(hocVienId, hocKiId)
                .orElseThrow(() -> new SimpleMessageException("Học viên chưa đăng ký tín chỉ trong học kì này"));

        HocPhi hocPhi = new HocPhi();
        hocPhi.setSoTinChi(tongTinChi.intValue());
        hocPhi.setSoTien(tongTinChi * 800_000.0);
        hocPhi.setTrangThai(HocPhiEnum.CHUA_THANH_TOAN);
        hocPhi.setHocVien(hocVien);
        hocPhi.setHocKi(hocKi);

        HocPhi saved = hocPhiAdminRepository.save(hocPhi);
        return hocPhiMapper.toResponseDTO(saved, hocVien, hocKi);
    }

    public HocPhiAdminResponseDTO getAllHocPhiByHocVienId(UUID id) {
        Long tongTinChi = hocPhiAdminRepository.getTongTinChiByHocVien(id)
                .orElseThrow(() -> new SimpleMessageException("Học viên chưa đăng ký tín chỉ nào"));
        HocPhiAdminResponseDTO dto = new HocPhiAdminResponseDTO();
        dto.setSoTinChi(tongTinChi.intValue());
        dto.setSoTien(tongTinChi * 800_000.0);
        dto.setHocVienId(id);
        return dto;
    }

    public List<HocPhiAdminResponseDTO.HocPhiView> getAllView() {
        return hocPhiAdminRepository.findAllProjectedBy();
    }

    @Transactional
    public void delete(UUID id) {
        if (!hocPhiAdminRepository.existsById(id)) {
            throw new SimpleMessageException("Học phí không tồn tại");
        }
        hocPhiAdminRepository.deleteById(id);
    }

    @Transactional
    public void deleteAllByList(List<UUID> ids) {
        if (ids == null || ids.isEmpty())
            return;
        try {
            hocPhiAdminRepository.deleteAllByIdIn(ids);
        } catch (Exception e) {
            throw new SimpleMessageException("Lỗi khi xóa danh sách: " + e.getMessage());
        }
    }
}
