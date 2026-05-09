package com.university.service.admin;

import com.university.dto.request.admin.HocVienAdminRequestDTO;
import com.university.dto.request.admin.warrap.HocVienCreateRequestDTO;
import com.university.dto.response.admin.HocVienAdminResponseDTO;
import com.university.entity.HocVien;
import com.university.entity.Nganh;
import com.university.entity.Users;
import com.university.exception.SimpleMessageException;
import com.university.mapper.admin.HocVienAdminMapper;
import com.university.mapper.admin.UsersAdminMapper;
import com.university.repository.admin.HocVienAdminRepository;
import com.university.repository.admin.NganhAdminRepository;
import com.university.repository.admin.UsersAdminRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class HocVienAdminService {

    private final HocVienAdminRepository hocVienAdminRepository;
    private final UsersAdminRepository usersRepository;
    private final NganhAdminRepository nganhAdminRepository;
    private final HocVienAdminMapper hocVienAdminMapper;
    private final UsersAdminMapper usersAdminMapper;

    @Transactional
    public HocVienAdminResponseDTO create(HocVienCreateRequestDTO request) {
        // 1. Save user details
        Users user = usersRepository.save(usersAdminMapper.toEntity(request.getUserDetails()));

        // 2. Map and save học viên
        HocVien hocVien = hocVienAdminMapper.toEntity(request.getHocVienDetails());
        hocVien.setUsers(user);

        // Optional: validate ngành if needed in create flow
        // Nganh nganh = nganhAdminRepository.findByMaNganh(...)
        // hocVien.setNganh(nganh);

        hocVien = hocVienAdminRepository.save(hocVien);
        return hocVienAdminMapper.toResponseDTO(hocVien);
    }

    @Transactional
    public HocVienAdminResponseDTO createWithExistingUser(UUID userId, HocVienAdminRequestDTO request) {
        // Validate user exists
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Người dùng không tồn tại"));

        // Validate ngành
        Nganh nganh = nganhAdminRepository.findByMaNganh(request.getMaNganh())
                .orElseThrow(() -> new SimpleMessageException("Không tìm thấy ngành đào tạo"));

        // Map học viên
        HocVien hocVien = hocVienAdminMapper.toEntity(request);
        hocVien.setUsers(user);
        hocVien.setNganh(nganh);

        hocVien = hocVienAdminRepository.save(hocVien);
        return hocVienAdminMapper.toResponseDTO(hocVien);
    }

    public HocVienAdminResponseDTO getHocVienById(UUID id) {
        HocVien hocVien = hocVienAdminRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Học viên không tồn tại"));
        return hocVienAdminMapper.toResponseDTO(hocVien);
    }

    public List<HocVienAdminResponseDTO> getAllHocVien() {
        List<HocVienAdminResponseDTO> hs = hocVienAdminRepository.findAll().stream().map(res -> {
            HocVienAdminResponseDTO hocVienAdminResponseDTO = hocVienAdminMapper.toResponseDTO(res);
            return hocVienAdminResponseDTO;
        }).toList();
        return hs;
    }

    @Transactional
    public HocVienAdminResponseDTO updateHocVien(UUID id, HocVienAdminRequestDTO request) {
        HocVien existing = hocVienAdminRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Học viên không tồn tại"));

        Nganh nganh = nganhAdminRepository.findByMaNganh(request.getMaNganh())
                .orElseThrow(() -> new SimpleMessageException("Ngành đào tạo không hợp lệ"));

        hocVienAdminMapper.updateEntity(existing, request);
        existing.setNganh(nganh);

        HocVien updated = hocVienAdminRepository.save(existing);
        return hocVienAdminMapper.toResponseDTO(updated);
    }

    @Transactional
    public void deleteHocVien(UUID id) {
        if (!hocVienAdminRepository.existsById(id)) {
            throw new EntityNotFoundException("Học viên không tồn tại");
        }
        hocVienAdminRepository.deleteById(id);
    }

    @Transactional
    public void deleteAllByList(List<UUID> ids) {
        if (ids == null || ids.isEmpty())
            return;
        // Optional: add foreign key validation if needed
        hocVienAdminRepository.deleteAllByIdIn(ids);
    }
}
