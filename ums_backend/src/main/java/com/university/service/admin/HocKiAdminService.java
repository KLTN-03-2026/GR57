package com.university.service.admin;

import com.university.dto.request.admin.HocKiAdminRequestDTO;
import com.university.dto.response.admin.HocKiAdminResponseDTO;
import com.university.entity.HocKi;
import com.university.exception.SimpleMessageException;
import com.university.mapper.admin.HocKiAdminMapper;
import com.university.repository.admin.HocKiAdminRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class HocKiAdminService {

    private final HocKiAdminRepository hocKiAdminRepository;
    private final HocKiAdminMapper hocKiMapper;

    @Transactional
    public HocKiAdminResponseDTO createHocKi(HocKiAdminRequestDTO request) {
        if (hocKiAdminRepository.existsByMaHocKi(request.getMaHocKi())) {
            throw new SimpleMessageException("Mã học kì đã tồn tại");
        }

        HocKi entity = hocKiMapper.toEntity(request);
        HocKi saved = hocKiAdminRepository.save(entity);
        return hocKiMapper.toResponseDTO(saved);
    }

    @Transactional
    public HocKiAdminResponseDTO updateHocKi(UUID id, HocKiAdminRequestDTO request) {
        HocKi existing = hocKiAdminRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Học kì không tồn tại"));

        hocKiMapper.updateEntity(existing, request);
        HocKi updated = hocKiAdminRepository.save(existing);
        return hocKiMapper.toResponseDTO(updated);
    }

    public HocKiAdminResponseDTO getHocKiById(UUID id) {
        HocKi hocKi = hocKiAdminRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Học kì không tồn tại"));
        return hocKiMapper.toResponseDTO(hocKi);
    }

    public List<HocKiAdminResponseDTO.HocKiView> getAllHocKi() {
        return hocKiAdminRepository.findAllProjectedBy();
    }

    @Transactional
    public void deleteHocKi(UUID id) {
        HocKi hk = hocKiAdminRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Học kì không tồn tại"));
        hocKiAdminRepository.delete(hk);
    }

    @Transactional
    public void deleteAllByList(List<UUID> ids) {
        if (ids == null || ids.isEmpty()) {
            return;
        }
        try {
            hocKiAdminRepository.deleteAllByIdIn(ids);
        } catch (Exception e) {
            throw new SimpleMessageException("Lỗi khi xóa danh sách: " + e.getMessage());
        }
    }
}
