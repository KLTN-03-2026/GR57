package com.university.dto.request.lecturer;

import java.util.Map;
import java.util.UUID;
import jakarta.validation.constraints.NotNull;

public class GradeRequestDTO {
    @NotNull(message = "Mã lớp học phần không được để trống")
    private UUID lopHocPhanId;

    @NotNull(message = "Danh sách điểm không được để trống")
    private Map<UUID, Float> studentGrades;

    public UUID getLopHocPhanId() {
        return lopHocPhanId;
    }

    public void setLopHocPhanId(UUID lopHocPhanId) {
        this.lopHocPhanId = lopHocPhanId;
    }

    public Map<UUID, Float> getStudentGrades() {
        return studentGrades;
    }

    public void setStudentGrades(Map<UUID, Float> studentGrades) {
        this.studentGrades = studentGrades;
    }
}
