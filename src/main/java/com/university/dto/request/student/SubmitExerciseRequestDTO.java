package com.university.dto.request.student;

import java.util.UUID;

import lombok.Data;
@Data
public class SubmitExerciseRequestDTO {
    private UUID exerciseId;
    private UUID hocVienId;
    private String fileExerciseUrl;
}
