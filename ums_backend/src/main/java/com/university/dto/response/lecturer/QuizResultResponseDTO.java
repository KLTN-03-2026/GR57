package com.university.dto.response.lecturer;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizResultResponseDTO {
    private UUID quizId;
    private String tieuDe;
    private Integer tongSoHocVien; // tổng số học viên trong lớp
    private Integer soLuongDaLam; // số học viên đã làm
    private Float diemTrungBinh;
    private List<StudentQuizResultDTO> studentResults;
}