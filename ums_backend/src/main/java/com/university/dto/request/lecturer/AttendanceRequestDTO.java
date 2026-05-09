package com.university.dto.request.lecturer;

import java.util.List;
import java.util.UUID;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AttendanceRequestDTO {
    @NotNull(message = "Mã lớp học phần không được để trống")
    private UUID lopHocPhanId;

    @NotNull(message = "Danh sách điểm danh không được để trống")
    private List<AttendanceEntryDTO> entries;

    public UUID getLopHocPhanId() {
        return lopHocPhanId;
    }

    public void setLopHocPhanId(UUID lopHocPhanId) {
        this.lopHocPhanId = lopHocPhanId;
    }

    public List<AttendanceEntryDTO> getEntries() {
        return entries;
    }

    public void setEntries(List<AttendanceEntryDTO> entries) {
        this.entries = entries;
    }
}
