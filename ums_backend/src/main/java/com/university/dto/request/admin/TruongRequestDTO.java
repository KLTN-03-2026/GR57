package com.university.dto.request.admin;

import java.time.LocalDateTime;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TruongRequestDTO {
    private String maTruong;
    private String tenTruong;
    private String diaChi;
    private String soDienThoai;
    private String email;
    private String website;
    private String moTa;
    private String logoUrl;
    private LocalDateTime ngayThanhLap;
    private String nguoiDaiDien;
}