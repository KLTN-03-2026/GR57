package com.university.dto.request.admin;

import java.time.LocalDate;

import org.hibernate.validator.constraints.Length;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TruongAdminRequestDTO {
    @NotBlank(message = "Mã trường không được để trống")
    @Length(max = 10, message = "Mã trường tối đa 10 kí")
    private String maTruong;
    private String tenTruong;
    private String diaChi;
    private String moTa;
    @JsonFormat(pattern = "dd/MM/yyyy : hh:mm:ss")
    private LocalDate ngayThanhLap;
    private String nguoiDaiDien;
}