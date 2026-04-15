package com.university.service.student;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import java.util.Optional;
import com.university.entity.Exercise;
import com.university.entity.HocVien;
import com.university.entity.SubmitExercise;
import com.university.repository.student.ExerciseStudentsRepository;
import com.university.repository.student.HocVienStudentsRepository;
import com.university.repository.SubmitExerciseStudentsRepository;
import lombok.RequiredArgsConstructor;
import com.university.dto.request.student.SubmitExerciseRequestDTO;
@Service
@RequiredArgsConstructor
public class SubmitExerciseService {

    private final SubmitExerciseStudentsRepository submitRepo;
    private final ExerciseStudentsRepository exerciseRepo;
    private final HocVienStudentsRepository hocVienRepo;

    public String submit(SubmitExerciseRequestDTO request) {

        Exercise exercise = exerciseRepo.findById(request.getExerciseId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài tập"));

        HocVien hocVien = hocVienRepo.findById(request.getHocVienId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy học viên"));

        LocalDateTime now = LocalDateTime.now();

        // check deadline
        if (exercise.getThoiGianKetThuc() != null &&
            now.isAfter(exercise.getThoiGianKetThuc())) {
            return "Quá hạn nộp bài!";
        }

        // check đã nộp chưa
        Optional<SubmitExercise> existing =
                submitRepo.findByExercise_IdAndHocVien_Id(
                        request.getExerciseId(),
                        request.getHocVienId()
                );

        if (existing.isPresent()) {
            // update bài nộp
            SubmitExercise submit = existing.get();
            submit.setFileExerciseUrl(request.getFileExerciseUrl());
            submit.setThoiGianNop(now);

            submitRepo.save(submit);
            return "Cập nhật bài nộp thành công!";
        }

        // tạo mới
        SubmitExercise submit = new SubmitExercise();
        submit.setExercise(exercise);
        submit.setHocVien(hocVien);
        submit.setFileExerciseUrl(request.getFileExerciseUrl());
        submit.setThoiGianNop(now);

        submitRepo.save(submit);

        return "Nộp bài thành công!";
    }
}

