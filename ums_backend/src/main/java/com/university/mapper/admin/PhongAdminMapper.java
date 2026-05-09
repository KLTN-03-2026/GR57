package com.university.mapper.admin;

import org.springframework.stereotype.Component;

import com.university.dto.request.admin.PhongAdminRequestDTO;
import com.university.dto.response.admin.PhongAdminResponseDTO;
import com.university.entity.Phong;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class PhongAdminMapper {

    public Phong toEntity(PhongAdminRequestDTO dto) {
        Phong phong = new Phong();
        phong.setMaPhong(dto.getMaPhong());
        phong.setTenPhong(dto.getTenPhong());
        phong.setSucChua(dto.getSucChua());
        phong.setTinhTrang(dto.getTinhTrang());
        phong.setToaNha(dto.getToaNha());
        phong.setTang(dto.getTang());
        return phong;
    }

    public Phong updateEntity(Phong phong, PhongAdminRequestDTO dto) {
        phong.setMaPhong(dto.getMaPhong());
        phong.setTenPhong(dto.getTenPhong());
        phong.setSucChua(dto.getSucChua());
        phong.setTinhTrang(dto.getTinhTrang());
        phong.setToaNha(dto.getToaNha());
        phong.setTang(dto.getTang());
        return phong;
    }

    public PhongAdminResponseDTO toResponseDTO(Phong entity) {
        PhongAdminResponseDTO t = new PhongAdminResponseDTO();
        t.setId(entity.getId());
        t.setMaPhong(entity.getMaPhong());
        t.setTenPhong(entity.getTenPhong());
        t.setSucChua(entity.getSucChua());
        t.setTinhTrang(entity.getTinhTrang());
        t.setToaNha(entity.getToaNha());
        t.setTang(entity.getTang());
        return t;
    }
}
