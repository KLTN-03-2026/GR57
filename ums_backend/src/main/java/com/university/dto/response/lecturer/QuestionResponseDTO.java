package com.university.dto.response.lecturer;

import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionResponseDTO {
    private UUID questionId;
    private String noiDung;
    private Float diem;
    private Boolean loaiCauHoi; // false: single, true: multiple
    private List<AnswerResponseDTO> answers;
}