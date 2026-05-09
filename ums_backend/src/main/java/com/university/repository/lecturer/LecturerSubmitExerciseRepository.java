package com.university.repository.lecturer;

import com.university.entity.SubmitExercise;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LecturerSubmitExerciseRepository extends JpaRepository<SubmitExercise, Integer> {
    List<SubmitExercise> findByExercise_LopHocPhan_Id(UUID lopHocPhanId);

    @Query("SELECT COUNT(se) FROM SubmitExercise se JOIN se.exercise e JOIN e.lopHocPhan lhp JOIN lhp.dGiangDays gd JOIN gd.nhanVien nv JOIN nv.users u WHERE u.id = :userId")
    int countByExercise_LopHocPhan_DGiangDays_NhanVien_Users_Id(@Param("userId") UUID userId);
}
