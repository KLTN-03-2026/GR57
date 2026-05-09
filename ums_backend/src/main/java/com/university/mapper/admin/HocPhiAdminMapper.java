package com.university.mapper.admin;

import com.university.dto.request.admin.HocPhiAdminRequestDTO;
import com.university.dto.response.admin.HocPhiAdminResponseDTO;
import com.university.entity.HocKi;
import com.university.entity.HocPhi;
import com.university.entity.HocVien;

import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class HocPhiAdminMapper {

    public HocPhi toEntity(HocPhiAdminRequestDTO dto) {
        if (dto == null)
            return null;
        HocPhi entity = new HocPhi();
        if (dto.getSoTien() != null)
            entity.setSoTien(dto.getSoTien());
        entity.setTrangThai(dto.getTrangThai());
        entity.setSoTinChi(dto.getSoTinChi());
        if (dto.getCreatedAt() != null)
            entity.setCreatedAt(dto.getCreatedAt());
        entity.setUpdatedAt(dto.getUpdatedAt() != null ? dto.getUpdatedAt() : LocalDateTime.now());
        return entity;
    }

    public void updateEntity(HocPhi entity, HocPhiAdminRequestDTO dto) {
        if (entity == null || dto == null)
            return;
        if (dto.getSoTien() != null)
            entity.setSoTien(dto.getSoTien());
        entity.setTrangThai(dto.getTrangThai());
        entity.setSoTinChi(dto.getSoTinChi());
        entity.setUpdatedAt(LocalDateTime.now());
    }

    public HocPhiAdminResponseDTO toResponseDTO(HocPhi entity, HocVien hocVien, HocKi hocKi) {
        if (entity == null)
            return null;

        HocPhiAdminResponseDTO dto = new HocPhiAdminResponseDTO();
        dto.setId(entity.getId());
        dto.setSoTien(entity.getSoTien());
        dto.setTrangThai(entity.getTrangThai());
        dto.setSoTinChi(entity.getSoTinChi());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());

        if (hocVien != null)
            dto.setHocVienId(hocVien.getId());
        if (hocKi != null)
            dto.setHocKiId(hocKi.getId());

        return dto;
    }
}