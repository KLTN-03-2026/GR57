package com.university.repository.student;


import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;
import com.university.dto.response.student.DangKyTinChiResponseDTO;
import com.university.entity.DangKyTinChi;

public interface DangKyTinChiRepository  extends JpaRepository<DangKyTinChi, UUID> {
    boolean existsByHocVienIdAndLopHocPhanId(UUID hocVienId, UUID lopHocPhanId);
    Optional<DangKyTinChi> findByHocVienIdAndLopHocPhanId(UUID hocVienId, UUID lopHocPhanId);
    @Query("""
            SELECT new com.university.dto.response.student.DangKyTinChiResponseDTO(
                d.id,
                d.createdAt,
                hv.id,
                hv.maHocVien,
                lhp.id,
                lhp.maLopHocPhan,
                mh.id,
                mh.maMonHoc,
                mh.soTinChi
            )
            FROM DangKyTinChi d
            JOIN d.hocVien hv
            JOIN d.lopHocPhan lhp
            JOIN lhp.monHoc mh
            WHERE d.id = :id
            """)
            Optional<DangKyTinChiResponseDTO> findDangKyTinChiResponseDTOById(@Param("id") UUID id);
        @Query("""
            SELECT new com.university.dto.response.student.DangKyTinChiResponseDTO(
                d.id,
                d.createdAt,
                hv.id,
                hv.maHocVien,
                lhp.id,
                lhp.maLopHocPhan,
                mh.id,
                mh.maMonHoc,
                mh.soTinChi
            )
            FROM DangKyTinChi d
            JOIN d.hocVien hv
            JOIN d.lopHocPhan lhp
            JOIN lhp.monHoc mh
            WHERE hv.id = :hocVienId
            """)
           List<DangKyTinChiResponseDTO> findDangKyTinChiResponseDTOByHocVienId(@Param("hocVienId") UUID hocVienId);
    
    
}
