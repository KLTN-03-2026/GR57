package com.university.dto.response.lecturer;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LecturerDashboardResponseDTO {
    private List<LecturerScheduleDTO> todaySchedule;
    private int totalClasses;
    private int ungradedAssignments;
    private double attendanceRate;
}
