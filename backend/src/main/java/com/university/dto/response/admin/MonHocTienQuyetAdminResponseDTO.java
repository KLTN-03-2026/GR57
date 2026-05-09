package com.university.dto.response.admin;

import java.util.UUID;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MonHocTienQuyetAdminResponseDTO {

    private UUID id;
    private String maMonHoc;
    private UUID monHocId;
    private UUID monTienQuyetId;

    public interface MonHocTienQuyetView {
        UUID getId();
    }

}