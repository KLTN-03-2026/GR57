package com.university.service.admin;

import com.university.dto.request.admin.GiangDayAdminRequestDTO;
import com.university.dto.response.admin.GiangDayAdminResponseDTO;
import com.university.entity.GiangDay;
import com.university.entity.NhanVien;
import com.university.entity.LopHocPhan;
import com.university.exception.SimpleMessageException;
import com.university.mapper.admin.GiangDayAdminMapper;
import com.university.repository.admin.GiangDayAdminRepository;
import com.university.repository.admin.NhanVienAdminRepository;
import com.university.repository.admin.LopHocPhanAdminRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GiangDayAdminService {

    private final GiangDayAdminRepository giangDayAdminRepository;
    private final NhanVienAdminRepository nhanVienRepository;
    private final LopHocPhanAdminRepository lopHocPhanRepository;
    private final GiangDayAdminMapper giangDayMapper;

    @Transactional
    public GiangDayAdminResponseDTO createGiangDay(GiangDayAdminRequestDTO request) {
        NhanVien nhanVien = nhanVienRepository.findById(request.getNhanVienId())
                .orElseThrow(() -> new EntityNotFoundException("Nhân viên không tồn tại"));

        LopHocPhan lopHocPhan = lopHocPhanRepository.findById(request.getLopHocPhanId())
                .orElseThrow(() -> new EntityNotFoundException("Lớp học phần không tồn tại"));

        GiangDay giangDay = giangDayMapper.toEntity(request);
        giangDay.setNhanVien(nhanVien);
        giangDay.setLopHocPhan(lopHocPhan);

        GiangDay saved = giangDayAdminRepository.save(giangDay);
        return giangDayMapper.toResponseDTO(saved);
    }

    @Transactional
    public GiangDayAdminResponseDTO updateGiangDay(UUID id, GiangDayAdminRequestDTO request) {
        GiangDay existing = giangDayAdminRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Giảng dạy không tồn tại"));

        if (request.getNhanVienId() != null && (existing.getNhanVien() == null || !request.getNhanVienId().equals(existing.getNhanVien().getId()))) {
            NhanVien nhanVien = nhanVienRepository.findById(request.getNhanVienId())
                    .orElseThrow(() -> new EntityNotFoundException("Nhân viên không tồn tại"));
            existing.setNhanVien(nhanVien);
        }

        if (request.getLopHocPhanId() != null && (existing.getLopHocPhan() == null || !request.getLopHocPhanId().equals(existing.getLopHocPhan().getId()))) {
            LopHocPhan lopHocPhan = lopHocPhanRepository.findById(request.getLopHocPhanId())
                    .orElseThrow(() -> new EntityNotFoundException("Lớp học phần không tồn tại"));
            existing.setLopHocPhan(lopHocPhan);
        }

        giangDayMapper.updateEntity(existing, request);
        GiangDay updated = giangDayAdminRepository.save(existing);
        return giangDayMapper.toResponseDTO(updated);
    }

    public GiangDayAdminResponseDTO getGiangDayById(UUID id) {
        GiangDay giangDay = giangDayAdminRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Giảng dạy không tồn tại"));
        return giangDayMapper.toResponseDTO(giangDay);
    }

    public List<GiangDayAdminResponseDTO.GiangDayView> getAllGiangDay() {
        return giangDayAdminRepository.findAllProjectedBy();
    }

    @Transactional
    public void deleteGiangDay(UUID id) {
        GiangDay gd = giangDayAdminRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Giảng dạy không tồn tại"));
        giangDayAdminRepository.delete(gd);
    }

    @Transactional
    public void deleteAllByList(List<UUID> ids) {
        if (ids == null || ids.isEmpty()) {
            return;
        }
        try {
            giangDayAdminRepository.deleteAllByIdIn(ids);
        } catch (Exception e) {
            throw new SimpleMessageException("Lỗi khi xóa danh sách: " + e.getMessage());
        }
    }
}
