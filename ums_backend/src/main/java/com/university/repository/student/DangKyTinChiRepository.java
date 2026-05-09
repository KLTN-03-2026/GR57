package com.university.repository.student;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.university.dto.response.student.DangKyTinChiResponseDTO;
import com.university.entity.DangKyTinChi;
import com.university.enums.TrangThaiLHP;

public interface DangKyTinChiRepository extends JpaRepository<DangKyTinChi, UUID> {

    boolean existsByHocVienIdAndLopHocPhanId(UUID hocVienId, UUID lopHocPhanId);

    int countByLopHocPhanId(UUID lopHocPhanId);

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
            AND lhp.hocKi.id = :hocKiId
            """)
    Integer sumTinChiByHocVienAndHocKi(@Param("hocVienId") UUID hocVienId, @Param("hocKiId") UUID hocKiId);

    @Query("""
            SELECT CASE WHEN COUNT(d) > 0 THEN true ELSE false END
            FROM DangKyTinChi d
            WHERE d.hocVien.id = :hocVienId
            AND d.lopHocPhan.monHoc.id = :monHocId
            """)
    boolean daHocMon(@Param("hocVienId") UUID hocVienId, @Param("monHocId") UUID monHocId);

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

    @Query(
            value = """
                SELECT EXISTS (
                    SELECT 1
                    FROM dang_ky_tin_chi dktc
                    JOIN lich l1 ON l1.lop_hoc_phan_id = dktc.lop_hoc_phan_id
                    JOIN gio_hoc gh1 ON gh1.id = l1.gio_hoc_id
                    WHERE dktc.hoc_vien_id = :hocVienId
                    AND EXISTS (
                        SELECT 1 FROM lich l2
                        JOIN gio_hoc gh2 ON gh2.id = l2.gio_hoc_id
                        WHERE l2.lop_hoc_phan_id = :lopHocPhanId
                        AND EXTRACT(DOW FROM l1.ngay_hoc) = EXTRACT(DOW FROM l2.ngay_hoc)
                        AND gh1.thoi_gian_bat_dau < gh2.thoi_gian_ket_thuc
                        AND gh1.thoi_gian_ket_thuc > gh2.thoi_gian_bat_dau
                    )
                )
                """,
            nativeQuery = true)
    boolean existsTrungLichFull(@Param("hocVienId") UUID hocVienId, @Param("lopHocPhanId") UUID lopHocPhanId);

    @Query("""
            SELECT new com.university.dto.response.student.DangKyTinChiResponseDTO(
                d.id,
                d.createdAt,
                d.hocVien.id,
                d.hocVien.maHocVien,
                lhp.id,
                lhp.maLopHocPhan,
                lhp.monHoc.id,
                lhp.monHoc.maMonHoc,
                lhp.monHoc.soTinChi,
                lhp.hocKi.id
            )
            FROM DangKyTinChi d
            JOIN d.lopHocPhan lhp
            WHERE d.hocVien.id = :hocVienId
            """)
    List<DangKyTinChiResponseDTO> findDangKyTinChiResponseDTOByHocVienId(@Param("hocVienId") UUID hocVienId);

    @Query("""
            SELECT new com.university.dto.response.student.DangKyTinChiResponseDTO(
                d.id,
                d.createdAt,
                d.hocVien.id,
                d.hocVien.maHocVien,
                lhp.id,
                lhp.maLopHocPhan,
                lhp.monHoc.id,
                lhp.monHoc.maMonHoc,
                lhp.monHoc.soTinChi,
                lhp.hocKi.id
            )
            FROM DangKyTinChi d
            JOIN d.lopHocPhan lhp
            WHERE d.id = :id
            """)
    Optional<DangKyTinChiResponseDTO> findDangKyTinChiResponseDTOById(@Param("id") UUID id);

    @Query("""
            SELECT d
            FROM DangKyTinChi d
            JOIN FETCH d.lopHocPhan lhp
            JOIN FETCH lhp.monHoc mh
            JOIN FETCH lhp.hocKi hk
            WHERE d.hocVien.id = :hocVienId
            AND lhp.trangThai = :trangThai
            """)
    List<DangKyTinChi> findByHocVienIdAndTrangThai(
            @Param("hocVienId") UUID hocVienId,
            @Param("trangThai") TrangThaiLHP trangThai);

    @Query("""
            SELECT d
            FROM DangKyTinChi d
            JOIN FETCH d.lopHocPhan lhp
            JOIN FETCH lhp.monHoc mh
            JOIN FETCH lhp.hocKi hk
            WHERE d.hocVien.id = :hocVienId
            """)
    List<DangKyTinChi> findAllByHocVienId(@Param("hocVienId") UUID hocVienId);

    @Query("""
            SELECT d
            FROM DangKyTinChi d
            JOIN FETCH d.lopHocPhan lhp
            JOIN FETCH lhp.monHoc mh
            JOIN FETCH lhp.hocKi hk
            WHERE d.hocVien.id = :hocVienId
            AND lhp.id = :lopHocPhanId
            """)
    Optional<DangKyTinChi> findByHocVienIdAndLopHocPhanId(
            @Param("hocVienId") UUID hocVienId,
            @Param("lopHocPhanId") UUID lopHocPhanId);

}
