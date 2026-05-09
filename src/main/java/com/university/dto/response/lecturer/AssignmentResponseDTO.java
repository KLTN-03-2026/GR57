package com.university.dto.response.lecturer;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentResponseDTO {
    private UUID id;
    private String tieuDe;
    private String moTa;
    private String fileExerciseUrl;
    private LocalDateTime createdAt;
    private UUID lopHocPhanId;
    private int submissionCount;
}
