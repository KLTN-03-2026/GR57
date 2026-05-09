package com.university.repository.admin;

import com.university.dto.response.admin.DangKyTinChiAdminResponseDTO;
import com.university.entity.DangKyTinChi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DangKyTinChiAdminRepository extends JpaRepository<DangKyTinChi, UUID> {

    @Query("""
            SELECT new com.university.dto.response.admin.DangKyTinChiAdminResponseDTO(
                d.id,
                lhp.id,
                lhp.maLopHocPhan,
                hv.id,
                hv.maHocVien,
                u.id,
                mh.id,
                mh.maMonHoc,
                mh.soTinChi,
                d.createdAt
            )
            FROM DangKyTinChi d
            JOIN d.lopHocPhan lhp
            JOIN lhp.monHoc mh
            JOIN d.hocVien hv
            JOIN hv.users u
            ORDER BY d.createdAt DESC
            """)
    List<DangKyTinChiAdminResponseDTO> findAllDTO();

    @Query("""
            SELECT new com.university.dto.response.admin.DangKyTinChiAdminResponseDTO(
                d.id,
                lhp.id,
                lhp.maLopHocPhan,
                hv.id,
                hv.maHocVien,
                u.id,
                mh.id,
                mh.maMonHoc,
                mh.soTinChi,
                d.createdAt
            )
            FROM DangKyTinChi d
            JOIN d.lopHocPhan lhp
            JOIN lhp.monHoc mh
            JOIN d.hocVien hv
            JOIN hv.users u
            WHERE d.id = :id
            """)
    Optional<DangKyTinChiAdminResponseDTO> findDTOById(@Param("id") UUID id);

    @Query("""
            SELECT new com.university.dto.response.admin.DangKyTinChiAdminResponseDTO(
                d.id,
                lhp.id,
                lhp.maLopHocPhan,
                hv.id,
                hv.maHocVien,
                u.id,
                mh.id,
                mh.maMonHoc,
                mh.soTinChi,
                d.createdAt
            )
            FROM DangKyTinChi d
            JOIN d.lopHocPhan lhp
            JOIN lhp.monHoc mh
            JOIN d.hocVien hv
            JOIN hv.users u
            WHERE hv.id = :hocVienId
            ORDER BY d.createdAt DESC
            """)
    List<DangKyTinChiAdminResponseDTO> findAllByHocVienIdDTO(@Param("hocVienId") UUID hocVienId);

    @Query("""
            SELECT new com.university.dto.response.admin.DangKyTinChiAdminResponseDTO(
                d.id,
                lhp.id,
                lhp.maLopHocPhan,
                hv.id,
                hv.maHocVien,
                u.id,
                mh.id,
                mh.maMonHoc,
                mh.soTinChi,
                d.createdAt
            )
            FROM DangKyTinChi d
            JOIN d.lopHocPhan lhp
            JOIN lhp.monHoc mh
            JOIN d.hocVien hv
            JOIN hv.users u
            WHERE lhp.id = :lopHocPhanId
            ORDER BY d.createdAt DESC
            """)
    List<DangKyTinChiAdminResponseDTO> findAllByLopHocPhanIdDTO(@Param("lopHocPhanId") UUID lopHocPhanId);

    boolean existsByHocVien_IdAndLopHocPhan_Id(UUID hocVienId, UUID lopHocPhanId);

    boolean existsByHocVien_IdAndLopHocPhan_IdAndIdNot(UUID hocVienId, UUID lopHocPhanId, UUID id);

    int countByLopHocPhan_Id(UUID lopHocPhanId);

    @Query("""
            SELECT SUM(lhp.monHoc.soTinChi)
            FROM DangKyTinChi d
            JOIN d.lopHocPhan lhp
            WHERE d.hocVien.id = :hocVienId
            """)
    Integer sumTinChiByHocVien(@Param("hocVienId") UUID hocVienId);

    @Query("""
            SELECT SUM(lhp.monHoc.soTinChi)
            FROM DangKyTinChi d
            JOIN d.lopHocPhan lhp
            WHERE d.hocVien.id = :hocVienId
            AND d.id <> :excludeId
            """)
    Integer sumTinChiByHocVienExcludingId(@Param("hocVienId") UUID hocVienId, @Param("excludeId") UUID excludeId);

    @Query("""
            SELECT CASE WHEN COUNT(d) > 0 THEN true ELSE false END
            FROM DangKyTinChi d
            WHERE d.hocVien.id = :hocVienId
            AND d.lopHocPhan.monHoc.id = :monHocId
            """)
    boolean daHocMon(@Param("hocVienId") UUID hocVienId, @Param("monHocId") UUID monHocId);

    @Query("""
            SELECT CASE WHEN COUNT(d) > 0 THEN true ELSE false END
            FROM DangKyTinChi d
            WHERE d.hocVien.id = :hocVienId
            AND d.lopHocPhan.monHoc.id = :monHocId
            AND d.id <> :excludeId
            """)
    boolean daHocMonExcludingId(
            @Param("hocVienId") UUID hocVienId,
            @Param("monHocId") UUID monHocId,
            @Param("excludeId") UUID excludeId);

    @Query("""
            SELECT CASE WHEN COUNT(mtq) = 0 THEN true ELSE false END
            FROM MonHocTienQuyet mtq
            JOIN mtq.monHoc mh
            WHERE mh.id = :monHocId
            AND NOT EXISTS (
                SELECT 1 FROM DangKyTinChi d
                JOIN d.lopHocPhan lhp
                WHERE d.hocVien.id = :hocVienId
                AND lhp.monHoc.id = mtq.monTienQuyet.id
            )
            """)
    boolean daHocMonTienQuyet(@Param("hocVienId") UUID hocVienId, @Param("monHocId") UUID monHocId);

    @Query("""
            SELECT CASE WHEN COUNT(d) > 0 THEN true ELSE false END
            FROM DangKyTinChi d
            JOIN d.lopHocPhan lhp
            JOIN lhp.dLichs lich
            JOIN lich.gioHoc gh
            WHERE d.hocVien.id = :hocVienId
            AND EXISTS (
                SELECT 1 FROM LopHocPhan l2
                JOIN l2.dLichs lich2
                JOIN lich2.gioHoc gh2
                WHERE l2.id = :lopHocPhanId
                AND FUNCTION('DAYOFWEEK', lich.ngayHoc) = FUNCTION('DAYOFWEEK', lich2.ngayHoc)
                AND gh.thoiGianBatDau < gh2.thoiGianKetThuc
                AND gh.thoiGianKetThuc > gh2.thoiGianBatDau
            )
            """)
    boolean existsTrungLichFull(@Param("hocVienId") UUID hocVienId, @Param("lopHocPhanId") UUID lopHocPhanId);

    @Query("""
            SELECT CASE WHEN COUNT(d) > 0 THEN true ELSE false END
            FROM DangKyTinChi d
            JOIN d.lopHocPhan lhp
            JOIN lhp.dLichs lich
            JOIN lich.gioHoc gh
            WHERE d.hocVien.id = :hocVienId
            AND d.id <> :excludeId
            AND EXISTS (
                SELECT 1 FROM LopHocPhan l2
                JOIN l2.dLichs lich2
                JOIN lich2.gioHoc gh2
                WHERE l2.id = :lopHocPhanId
                AND FUNCTION('DAYOFWEEK', lich.ngayHoc) = FUNCTION('DAYOFWEEK', lich2.ngayHoc)
                AND gh.thoiGianBatDau < gh2.thoiGianKetThuc
                AND gh.thoiGianKetThuc > gh2.thoiGianBatDau
            )
            """)
    boolean existsTrungLichFullExcludingId(
            @Param("hocVienId") UUID hocVienId,
            @Param("lopHocPhanId") UUID lopHocPhanId,
            @Param("excludeId") UUID excludeId);

    void deleteAllByIdIn(List<UUID> ids);
}
