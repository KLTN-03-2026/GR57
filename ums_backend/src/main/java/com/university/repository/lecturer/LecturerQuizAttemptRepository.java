package com.university.repository.lecturer;

import com.university.entity.QuizAttempt;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LecturerQuizAttemptRepository extends JpaRepository<QuizAttempt, UUID> {
    List<QuizAttempt> findByQuiz_LopHocPhan_DGiangDays_NhanVien_Users_Id(UUID userId);
    List<QuizAttempt> findByQuiz_Id(UUID quizId);
    List<QuizAttempt> findByHocVien_Id(UUID hocVienId);
}
