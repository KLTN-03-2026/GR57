package com.university.dto.response.lecturer;

import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LecturerProfileResponseDTO {
    private UUID id;
    private String hoTen;
    private String email;
    private String soDienThoai;
    private String avatarUrl;
    private List<LecturerScheduleDTO> schedule;
}
