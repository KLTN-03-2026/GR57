package com.university.dto.response.admin;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TruongResponseDTO {
    private UUID id;
    private String maTruong;
    private String tenTruong;
    private String diaChi;
    private String moTa;
    private LocalDateTime ngayThanhLap;
    private String nguoiDaiDien;
}