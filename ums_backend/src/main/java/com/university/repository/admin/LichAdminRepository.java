package com.university.repository.admin;

import com.university.entity.Lich;

import io.lettuce.core.dynamic.annotation.Param;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LichAdminRepository extends JpaRepository<Lich, UUID> {

    @Query("SELECT l FROM Lich l WHERE l.lopHocPhan.id = :lopHocPhanId")
    List<Lich> findAllLichByLopHocPhanId(@Param("lopHocPhanId") UUID lopHocPhanId);

    void deleteAllByIdIn(List<UUID> ids);
}
