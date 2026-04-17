package com.university.repository.lecturer;

import com.university.entity.Lich;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LecturerScheduleRepository extends JpaRepository<Lich, UUID> {
    List<Lich> findByLopHocPhan_DGiangDays_NhanVien_Users_IdAndNgayHocBetween(UUID userId, LocalDateTime start, LocalDateTime end);
    List<Lich> findByLopHocPhan_DGiangDays_NhanVien_Users_Id(UUID userId);
}
