package com.university.dto.request.lecturer;

import java.util.List;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionRequestDTO {
    @NotEmpty(message = "Nội dung câu hỏi không được để trống")
    private String noiDung;

    @NotEmpty(message = "Phải có ít nhất 1 đáp án")
    @Valid
    private List<AnswerRequestDTO> answers;

    @NotNull(message = "Điểm số không được để trống")
    private Float diem;

    private Boolean loaiCauHoi = false; // false: single choice, true: multiple choice
}