package com.university.service.admin;

import com.university.dto.request.admin.PhongAdminRequestDTO;
import com.university.dto.response.admin.PhongAdminResponseDTO;
import com.university.entity.Phong;
import com.university.exception.SimpleMessageException;
import com.university.mapper.admin.PhongAdminMapper;
import com.university.repository.admin.PhongAdminRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PhongAdminService {

    private final PhongAdminRepository phongAdminRepository;
    private final PhongAdminMapper phongAdminMapper;

    @Transactional
    public PhongAdminResponseDTO create(PhongAdminRequestDTO request) {
        if (request == null) {
            return null;
        }
        Phong phong = phongAdminMapper.toEntity(request);

        return phongAdminMapper.toResponseDTO(phongAdminRepository.save(phong));
    }

    @Transactional
    public String createList(List<PhongAdminRequestDTO> request) {
        if (request == null) {
            return null;
        }
        List<Phong> phongs = request.stream().map(req -> {
            Phong phong = phongAdminMapper.toEntity(req);
            return phong;
        }).toList();
        phongAdminRepository.saveAll(phongs);

        return "Thêm danh sách thành công";
    }

    public PhongAdminResponseDTO getPhongById(UUID id) {
        Phong phong = phongAdminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Phòng không tồn tại"));
        return phongAdminMapper.toResponseDTO(phong);
    }

    public List<PhongAdminResponseDTO> getAllPhong() {
        List<PhongAdminResponseDTO> phongAdminResponseDTOs = phongAdminRepository.findAll().stream().map(p -> {
            return phongAdminMapper.toResponseDTO(p);
        }).toList();

        return phongAdminResponseDTOs;

    }

    @Transactional
    public PhongAdminResponseDTO update(UUID id, PhongAdminRequestDTO request) {
        Phong phong = phongAdminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Phòng không tồn tại"));

        phong = phongAdminMapper.updateEntity(phong, request);
        phongAdminRepository.save(phong);
        return phongAdminMapper.toResponseDTO(phong);
    }

    @Transactional
    public void delete(UUID id) {
        Phong phong = phongAdminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Phòng không tồn tại"));

        phongAdminRepository.delete(phong);
    }

    @Transactional
    public void deleteAllByList(List<UUID> ids) {
        if (ids == null || ids.isEmpty()) {
            return;
        }
        try {
            // Kiem tra user dang co trong cac db khac khong
            // for (UUID uuid : ids) {
            // if (usersAdminRepository.) {

            phongAdminRepository.deleteAllByIdIn(ids);

        } catch (Exception e) {
            throw new SimpleMessageException("Lỗi khi xóa danh sách: " + e.getMessage());
        }
    }
}
