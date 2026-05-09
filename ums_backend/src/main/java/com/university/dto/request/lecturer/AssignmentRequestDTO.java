package com.university.dto.request.lecturer;

import java.util.UUID;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AssignmentRequestDTO {
    @NotNull(message = "Mã lớp học phần không được để trống")
    private UUID lopHocPhanId;

    @NotBlank(message = "Tiêu đề bài tập không được để trống")
    private String tieuDe;

    private String moTa;

    @NotBlank(message = "URL bài tập không được để trống")
    private String fileExerciseUrl;

    public UUID getLopHocPhanId() {
        return lopHocPhanId;
    }

    public void setLopHocPhanId(UUID lopHocPhanId) {
        this.lopHocPhanId = lopHocPhanId;
    }

    public String getTieuDe() {
        return tieuDe;
    }

    public void setTieuDe(String tieuDe) {
        this.tieuDe = tieuDe;
    }

    public String getMoTa() {
        return moTa;
    }

    public void setMoTa(String moTa) {
        this.moTa = moTa;
    }

    public String getFileExerciseUrl() {
        return fileExerciseUrl;
    }

    public void setFileExerciseUrl(String fileExerciseUrl) {
        this.fileExerciseUrl = fileExerciseUrl;
    }
}
