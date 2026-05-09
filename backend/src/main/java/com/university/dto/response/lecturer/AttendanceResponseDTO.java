package com.university.dto.response.lecturer;

import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceResponseDTO {
    private UUID lopHocPhanId;
    private List<AttendanceStudentResponseDTO> students;
}
