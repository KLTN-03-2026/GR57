package com.university.dto.request.lecturer;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnswerRequestDTO {
    @NotEmpty(message = "Khóa đáp án không được để trống")
    private String keyAnswers; // A, B, C, D

    @NotEmpty(message = "Nội dung đáp án không được để trống")
    private String conText;

    private Boolean isCorrect = false;
}