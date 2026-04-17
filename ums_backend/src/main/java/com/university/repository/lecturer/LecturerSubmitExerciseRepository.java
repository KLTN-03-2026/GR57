package com.university.repository.lecturer;

import com.university.entity.SubmitExercise;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LecturerSubmitExerciseRepository extends JpaRepository<SubmitExercise, Integer> {
    List<SubmitExercise> findByExercise_LopHocPhan_Id(UUID lopHocPhanId);
    int countByExercise_LopHocPhan_DGiangDays_NhanVien_Users_Id(UUID userId);
}
