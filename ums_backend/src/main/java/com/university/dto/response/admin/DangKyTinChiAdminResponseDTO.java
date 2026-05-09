package com.university.dto.response.admin;

import java.time.LocalDateTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DangKyTinChiAdminResponseDTO {

    private UUID id;
    private UUID lopHocPhanId;
    private String maLopHocPhan;
    private UUID hocVienId;
    private String maHocVien;
    private UUID usersId;
    private UUID monHocId;
    private String maMonHoc;
    private Integer soTinChi;
    @JsonFormat(pattern = "dd/MM/yyyy : hh:mm:ss")
    private LocalDateTime createdAt;

    public interface DangKyTinChiView {
        UUID getId();

        LopHocPhanInfo getLopHocPhan();

        interface LopHocPhanInfo {
            UUID getId();
        }

        HocVienInfo getHocVien();

        interface HocVienInfo {

            UUID getId();
        }

        UsersInfo getUsers();

        interface UsersInfo {

            UUID getId();
        }

        LocalDateTime getCreatedAt();
    }
}
