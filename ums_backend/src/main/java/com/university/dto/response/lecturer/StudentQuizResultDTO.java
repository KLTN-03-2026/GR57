package com.university.dto.response.lecturer;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentQuizResultDTO {
    private UUID hocVienId;
    private String tenHocVien;
    private String maHocVien;
    private Float diem;
    private Integer usedTime; // thời gian đã dùng (giây)
    private Integer remainingTime; // thời gian còn lại (giây)
    private String status; // "COMPLETED", "IN_PROGRESS"
}