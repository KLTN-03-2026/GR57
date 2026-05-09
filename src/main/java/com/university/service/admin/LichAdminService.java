package com.university.service.admin;

import com.university.dto.request.admin.LichAdminRequestDTO;
import com.university.dto.response.admin.LichAdminResponseDTO;
import com.university.entity.GioHoc;
import com.university.entity.Lich;
import com.university.entity.LopHocPhan;
import com.university.entity.Phong;
import com.university.exception.SimpleMessageException;
import com.university.mapper.admin.LichAdminMapper;
import com.university.repository.admin.GioHocAdminRepository;
import com.university.repository.admin.LichAdminRepository;
import com.university.repository.admin.LopHocPhanAdminRepository;
import com.university.repository.admin.PhongAdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LichAdminService {

    private final LichAdminRepository lichAdminRepository;
    private final GioHocAdminRepository gioHocAdminRepository;
    private final PhongAdminRepository phongAdminRepository;
    private final LopHocPhanAdminRepository lopHocPhanAdminRepository;
    private final LichAdminMapper lichMapper;

    @Transactional
    public LichAdminResponseDTO createLich(LichAdminRequestDTO request) {
        if (request == null) {
            throw new SimpleMessageException("Dữ liệu không hợp lệ");
        }

        GioHoc gioHoc = gioHocAdminRepository.findById(request.getGioHocId())
                .orElseThrow(() -> new SimpleMessageException("Giờ học không tồn tại"));

        Phong phong = phongAdminRepository.findById(request.getPhongId())
                .orElseThrow(() -> new SimpleMessageException("Phòng học không tồn tại"));

        LopHocPhan lopHocPhan = lopHocPhanAdminRepository.findById(request.getLopHocPhanId())
                .orElseThrow(() -> new SimpleMessageException("Lớp học phần không tồn tại"));

        // 2. Logic kiểm tra trùng lịch
        // Tìm tất cả lịch học của Lớp học phần này
        List<Lich> existingSchedules = lichAdminRepository.findAllLichByLopHocPhanId(lopHocPhan.getId());

        for (Lich existing : existingSchedules) {
            // Kiểm tra nếu trùng ngày học
            if (existing.getNgayHoc().equals(request.getNgayHoc())) {
                // Nếu trùng ngày, tiếp tục kiểm tra trùng Giờ học (ID)
                if (existing.getGioHoc().getId().equals(request.getGioHocId())) {
                    throw new SimpleMessageException("Lớp học phần này đã có lịch vào ngày "
                            + request.getNgayHoc() + " tại khung giờ này!");
                }
            }
        }

        Lich lich = lichMapper.toEntity(request);
        lich.setGioHoc(gioHoc);
        lich.setPhong(phong);
        lich.setLopHocPhan(lopHocPhan);
        lich.setCreatedAt(LocalDateTime.now());
        lich.setUpdatedAt(LocalDateTime.now());

        Lich saved = lichAdminRepository.save(lich);
        return lichMapper.toResponseDTO(saved);
    }

    @Transactional
    public LichAdminResponseDTO updateLich(UUID id, LichAdminRequestDTO request) {
        Lich existing = lichAdminRepository.findById(id)
                .orElseThrow(() -> new SimpleMessageException("Lịch không tồn tại"));

        GioHoc gioHoc = gioHocAdminRepository.findById(request.getGioHocId())
                .orElseThrow(() -> new SimpleMessageException("Giờ học không tồn tại"));

        Phong phong = phongAdminRepository.findById(request.getPhongId())
                .orElseThrow(() -> new SimpleMessageException("Phòng học không tồn tại"));

        LopHocPhan lopHocPhan = lopHocPhanAdminRepository.findById(request.getLopHocPhanId())
                .orElseThrow(() -> new SimpleMessageException("Lớp học phần không tồn tại"));

        lichMapper.updateEntity(existing, request);
        existing.setGioHoc(gioHoc);
        existing.setPhong(phong);
        existing.setLopHocPhan(lopHocPhan);
        existing.setUpdatedAt(LocalDateTime.now());

        Lich updated = lichAdminRepository.save(existing);
        return lichMapper.toResponseDTO(updated);
    }

    public LichAdminResponseDTO getLichById(UUID id) {
        Lich lich = lichAdminRepository.findById(id)
                .orElseThrow(() -> new SimpleMessageException("Lịch không tồn tại"));
        return lichMapper.toResponseDTO(lich);
    }

    public List<LichAdminResponseDTO> getAllLich() {
        return lichAdminRepository.findAll()
                .stream()
                .map(lichMapper::toResponseDTO)
                .toList();
    }

    public List<LichAdminResponseDTO> getAllLichByLopHopPhan(UUID id) {
        List<Lich> lichs = lichAdminRepository.findAllLichByLopHocPhanId(id);

        List<LichAdminResponseDTO> lichAdminResponseDTOs = lichs.stream().map(l -> {
            LichAdminResponseDTO responseDTO = lichMapper.toResponseDTO(l);
            return responseDTO;
        }).toList();
        return lichAdminResponseDTOs;
    }

    @Transactional
    public void delete(UUID id) {
        if (!lichAdminRepository.existsById(id)) {
            throw new SimpleMessageException("Lịch không tồn tại");
        }
        lichAdminRepository.deleteById(id);
    }

    @Transactional
    public void deleteAllByList(List<UUID> ids) {
        if (ids == null || ids.isEmpty()) {
            return;
        }
        try {
            lichAdminRepository.deleteAllByIdIn(ids);
        } catch (Exception e) {
            throw new SimpleMessageException("Lỗi khi xóa danh sách: " + e.getMessage());
        }
    }
}
