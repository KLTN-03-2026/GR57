package com.university.service.student;

import com.university.dto.response.student.LichStudentsResponseDTO;
import com.university.entity.Lich;
import com.university.repository.student.LichStudentsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LichStudentsService {

    private final LichStudentsRepository lichStudentsRepository;

    public List<LichStudentsResponseDTO> getLichByLopHocPhan(UUID lopHocPhanId) {
        List<Lich> lichs = lichStudentsRepository.findByLopHocPhanId(lopHocPhanId);

        // deduplicate by (thu, thoiGianBatDau, thoiGianKetThuc, maPhong)
        Set<String> seen = new LinkedHashSet<>();
        return lichs.stream()
                .map(l -> {
                    String thu = toThu(l.getNgayHoc().getDayOfWeek());
                    String key = thu + "|"
                            + l.getGioHoc().getThoiGianBatDau() + "|"
                            + l.getGioHoc().getThoiGianKetThuc() + "|"
                            + l.getPhong().getMaPhong();
                    if (!seen.add(key)) return null;
                    return new LichStudentsResponseDTO(
                            thu,
                            l.getGioHoc().getThoiGianBatDau(),
                            l.getGioHoc().getThoiGianKetThuc(),
                            l.getGioHoc().getTenGioHoc(),
                            l.getPhong().getMaPhong(),
                            l.getPhong().getTenPhong()
                    );
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    private String toThu(DayOfWeek dow) {
        return switch (dow) {
            case MONDAY -> "Thứ 2";
            case TUESDAY -> "Thứ 3";
            case WEDNESDAY -> "Thứ 4";
            case THURSDAY -> "Thứ 5";
            case FRIDAY -> "Thứ 6";
            case SATURDAY -> "Thứ 7";
            case SUNDAY -> "Chủ nhật";
        };
    }
}
