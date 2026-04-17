package com.university.repository.lecturer;

import com.university.entity.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LecturerExerciseRepository extends JpaRepository<Exercise, UUID> {
    List<Exercise> findByLopHocPhan_Id(UUID lopHocPhanId);
    List<Exercise> findByLopHocPhan_DGiangDays_NhanVien_Users_Id(UUID userId);
}