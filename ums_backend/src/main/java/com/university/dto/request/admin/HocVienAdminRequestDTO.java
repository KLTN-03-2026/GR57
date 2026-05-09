package com.university.dto.request.admin;

import java.time.LocalDateTime;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HocVienAdminRequestDTO {

    @NotBlank(message = "Mã học viên không được để trống")
    private String maHocVien;

    private LocalDateTime ngayNhapHoc;

    private LocalDateTime ngayTotNghiep;

    @NotBlank(message = "Mã ngành không được để trống")
    private String maNganh;

}