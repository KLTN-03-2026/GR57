package com.university.dto.response.admin;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class KhoaResponseDTO {
    private UUID id;
    private String maKhoa;
    private String tenKhoa;
    private String tenTruong;
}