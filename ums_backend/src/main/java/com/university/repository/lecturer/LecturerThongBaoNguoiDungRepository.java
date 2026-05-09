package com.university.repository.lecturer;

import com.university.entity.ThongBaoNguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface LecturerThongBaoNguoiDungRepository extends JpaRepository<ThongBaoNguoiDung, UUID> {
}