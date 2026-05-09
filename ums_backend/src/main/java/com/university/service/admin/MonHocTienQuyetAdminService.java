package com.university.service.admin;

import com.university.dto.request.admin.MonHocTienQuyetAdminRequestDTO;
import com.university.dto.response.admin.MonHocTienQuyetAdminResponseDTO;
import com.university.entity.MonHoc;
import com.university.entity.MonHocTienQuyet;
import com.university.exception.SimpleMessageException;
import com.university.mapper.admin.MonHocTienQuyetAdminMapper;
import com.university.repository.admin.MonHocAdminRepository;
import com.university.repository.admin.MonHocTienQuyetAdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MonHocTienQuyetAdminService {

    private final MonHocTienQuyetAdminRepository monHocTienQuyetAdminRepository;
    private final MonHocAdminRepository monHocAdminRepository;
    private final MonHocTienQuyetAdminMapper monHocTienQuyetMapper;

    @Transactional
    public MonHocTienQuyetAdminResponseDTO create(MonHocTienQuyetAdminRequestDTO request) {
        if (request == null) throw new SimpleMessageException("Dữ liệu không hợp lệ");

        MonHoc monHoc = monHocAdminRepository.findById(request.getMonHocId())
                .orElseThrow(() -> new SimpleMessageException("Môn học chính không tồn tại"));

        MonHoc monTienQuyet = monHocAdminRepository.findById(request.getMonTienQuyetId())
                .orElseThrow(() -> new SimpleMessageException("Môn tiên quyết không tồn tại"));

        MonHocTienQuyet entity = monHocTienQuyetMapper.toEntity(request);
        entity.setMonHoc(monHoc);
        entity.setMonTienQuyet(monTienQuyet);

        MonHocTienQuyet saved = monHocTienQuyetAdminRepository.save(entity);
        return monHocTienQuyetMapper.toResponseDTO(saved);
    }

    @Transactional
    public MonHocTienQuyetAdminResponseDTO update(UUID id, MonHocTienQuyetAdminRequestDTO request) {
        MonHocTienQuyet existing = monHocTienQuyetAdminRepository.findById(id)
                .orElseThrow(() -> new SimpleMessageException("Môn học tiên quyết không tồn tại"));

        MonHoc monHoc = monHocAdminRepository.findById(request.getMonHocId())
                .orElseThrow(() -> new SimpleMessageException("Môn học chính không tồn tại"));

        MonHoc monTienQuyet = monHocAdminRepository.findById(request.getMonTienQuyetId())
                .orElseThrow(() -> new SimpleMessageException("Môn tiên quyết không tồn tại"));

        monHocTienQuyetMapper.updateEntity(existing, request);
        existing.setMonHoc(monHoc);
        existing.setMonTienQuyet(monTienQuyet);

        MonHocTienQuyet updated = monHocTienQuyetAdminRepository.save(existing);
        return monHocTienQuyetMapper.toResponseDTO(updated);
    }

    public MonHocTienQuyetAdminResponseDTO getById(UUID id) {
        MonHocTienQuyet entity = monHocTienQuyetAdminRepository.findById(id)
                .orElseThrow(() -> new SimpleMessageException("Môn học tiên quyết không tồn tại"));
        return monHocTienQuyetMapper.toResponseDTO(entity);
    }

    public List<MonHocTienQuyetAdminResponseDTO> getAll() {
        return monHocTienQuyetAdminRepository.findAll()
                .stream()
                .map(monHocTienQuyetMapper::toResponseDTO)
                .toList();
    }

    @Transactional
    public void delete(UUID id) {
        if (!monHocTienQuyetAdminRepository.existsById(id)) {
            throw new SimpleMessageException("Môn học tiên quyết không tồn tại");
        }
        monHocTienQuyetAdminRepository.deleteById(id);
    }

    @Transactional
    public void deleteAllByList(List<UUID> ids) {
        if (ids == null || ids.isEmpty()) return;
        try {
            monHocTienQuyetAdminRepository.deleteAllByIdIn(ids);
        } catch (Exception e) {
            throw new SimpleMessageException("Lỗi khi xóa danh sách: " + e.getMessage());
        }
    }
}
