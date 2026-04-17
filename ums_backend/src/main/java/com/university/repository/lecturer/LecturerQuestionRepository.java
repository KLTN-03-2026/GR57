package com.university.repository.lecturer;

import com.university.entity.Questions;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LecturerQuestionRepository extends JpaRepository<Questions, UUID> {
    List<Questions> findByQuiz_Id(UUID quizId);
    List<Questions> findByQuiz_LopHocPhan_DGiangDays_NhanVien_Users_Id(UUID userId);
    void deleteByQuiz_Id(UUID quizId);
}
