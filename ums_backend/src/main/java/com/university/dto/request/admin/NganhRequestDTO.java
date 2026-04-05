package com.university.dto.request.admin;

import java.util.UUID;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NganhRequestDTO {

    @NotBlank(message = "Mã ngành không được để trống")
    private String maNganh;

    @NotBlank(message = "Tên ngành không được để trống")
    private String tenNganh;

    private String danhGia;

    private String moTa;

    private UUID khoaId;

}
