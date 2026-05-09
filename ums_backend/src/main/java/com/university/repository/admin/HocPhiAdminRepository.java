package com.university.repository.admin;

import com.university.dto.response.admin.HocPhiAdminResponseDTO;
import com.university.entity.HocPhi;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface HocPhiAdminRepository extends JpaRepository<HocPhi, UUID> {

    @Query("""
            SELECT SUM(mh.soTinChi)
            FROM DangKyTinChi d
            JOIN d.lopHocPhan lhp
            JOIN lhp.monHoc mh
            WHERE d.hocVien.id = :userId
            """)
    Optional<Long> getTongTinChiByHocVien(@Param("userId") UUID userId);

    @Query("""
            SELECT SUM(mh.soTinChi)
            FROM DangKyTinChi d
            JOIN d.lopHocPhan lhp
            JOIN lhp.monHoc mh
            WHERE d.hocVien.id = :hocVienId
            AND lhp.hocKi.id = :hocKiId
            """)
    Optional<Long> getTongTinChiByHocVienAndHocKi(
            @Param("hocVienId") UUID hocVienId,
            @Param("hocKiId") UUID hocKiId);

    List<HocPhiAdminResponseDTO.HocPhiView> findAllProjectedBy();

    void deleteAllByIdIn(List<UUID> ids);
}
