package com.university.mapper.admin;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import com.university.dto.request.admin.UsersAdminRequestDTO;
import com.university.dto.response.admin.UsersAdminResponseDTO;
import com.university.entity.Users;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class UsersAdminMapper {

    private final PasswordEncoder passwordEncoder;

    public Users toEntity(UsersAdminRequestDTO dto) {
        dto.setPassWord(passwordEncoder.encode(dto.getPassWord()));
        Users user = new Users();
        user.setUserName(dto.getUserName());
        user.setPassWord(dto.getPassWord());
        user.setEmail(dto.getEmail());
        user.setCccd(dto.getCccd());
        user.setHoTen(dto.getHoTen());
        user.setDiaChi(dto.getDiaChi());
        user.setGioiTinh(dto.getGioiTinh());
        user.setNgaySinh(dto.getNgaySinh().atStartOfDay());
        user.setSoDienThoai(dto.getSoDienThoai());
        user.setTrangThai(dto.getTrangThai());
        user.setGhiChu(dto.getGhiChu());
        user.setCreateAt(LocalDateTime.now());
        user.setUpdateAt(LocalDateTime.now());
        return user;
    }

    public UsersAdminResponseDTO updateEntity(Users users, UsersAdminRequestDTO dto) {
        users.setUserName(dto.getUserName());
        users.setPassWord(dto.getPassWord());
        users.setEmail(dto.getEmail());
        users.setCccd(dto.getCccd());
        users.setHoTen(dto.getHoTen());
        users.setDiaChi(dto.getDiaChi());
        users.setGioiTinh(dto.getGioiTinh());
        users.setNgaySinh(dto.getNgaySinh().atStartOfDay());
        users.setSoDienThoai(dto.getSoDienThoai());
        users.setTrangThai(dto.getTrangThai());
        users.setGhiChu(dto.getGhiChu());
        users.setUpdateAt(LocalDateTime.now());

        return toResponseDTO(users);
    }

    public UsersAdminResponseDTO toResponseDTO(Users users) {
        UsersAdminResponseDTO dto = new UsersAdminResponseDTO();
        dto.setId(users.getId());
        dto.setUserName(users.getUserName());
        dto.setPassWord(users.getPassWord());
        dto.setEmail(users.getEmail());
        dto.setCccd(users.getCccd());
        dto.setHoTen(users.getHoTen());
        dto.setDiaChi(users.getDiaChi());
        dto.setGioiTinh(users.getGioiTinh());
        dto.setNgaySinh(users.getNgaySinh());
        dto.setSoDienThoai(users.getSoDienThoai());
        dto.setTrangThai(users.isTrangThai());
        dto.setGhiChu(users.getGhiChu());
        dto.setCreateAt(users.getCreateAt());
        dto.setUpdateAt(users.getUpdateAt());
        return dto;
    }
}
