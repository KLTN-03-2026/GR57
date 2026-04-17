package com.university.repository.lecturer;

import com.university.entity.Quiz;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LecturerQuizRepository extends JpaRepository<Quiz, UUID> {
    List<Quiz> findByLopHocPhan_Id(UUID lopHocPhanId);
    List<Quiz> findByLopHocPhan_DGiangDays_NhanVien_Users_Id(UUID userId);
}
