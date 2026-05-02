package com.university.repository.student;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.university.entity.HocVien;

@Repository
public interface HocVienStudentsRepository extends JpaRepository<HocVien, UUID> {

    @Query("""
        SELECT h
        FROM HocVien h
        JOIN FETCH h.nganh n
        JOIN FETCH h.users u
        WHERE h.id = :hocVienId
    """)
    Optional<HocVien> findByIdWithNganh(@Param("hocVienId") UUID hocVienId);
}
