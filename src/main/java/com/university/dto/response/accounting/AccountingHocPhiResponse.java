package com.university.dto.response.accounting;

import com.university.enums.HocPhiEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountingHocPhiResponse {
    private UUID id;
    private Double soTien;
    private HocPhiEnum trangThai;
    private Integer soTinChi;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private UUID hocVienId;
    private String hocVienName;
    private String hocVienEmail;

    private UUID hocKiId;
    private String hocKiMa;
    private String hocKiName;
}
