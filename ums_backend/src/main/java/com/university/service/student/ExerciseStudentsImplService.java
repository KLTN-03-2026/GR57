package com.university.service.student;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.university.dto.response.student.ExerciseStudentsResponseDTO;
import com.university.entity.Exercise;
import com.university.entity.SubmitExercise;
import com.university.enums.ExerciseEnum;
import com.university.repository.student.ExerciseStudentsRepository;
import com.university.repository.student.SubmitExerciseStudentsRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExerciseStudentsImplService implements ExerciseStudentsService {

    private static final long HOURS_WARNING = 24;

    private final ExerciseStudentsRepository exerciseRepo;
    private final SubmitExerciseStudentsRepository submitRepo;
    private final CurrentHocVienService currentHocVienService;

    @Override
    @Transactional(readOnly = true)
    public Page<ExerciseStudentsResponseDTO> getDanhSachBaiTap(
            UUID lopHocPhanId, String keyword, int page, int size) {
        UUID hocVienId = currentHocVienService.getCurrentHocVienId();

        Pageable pageable = PageRequest.of(page, size, Sort.by("thoiGianBatDau").descending());
        Page<Exercise> pageData = (keyword == null || keyword.isBlank())
                ? exerciseRepo.findByLopHocPhan_Id(lopHocPhanId, pageable)
                : exerciseRepo.searchByTieuDe(lopHocPhanId, keyword, pageable);

        Map<UUID, SubmitExercise> submitMap = buildSubmitMap(pageData.getContent(), hocVienId);

        return pageData.map(exercise -> toResponseDTO(exercise, submitMap));
    }

    @Override
    @Transactional(readOnly = true)
    public ExerciseStudentsResponseDTO getChiTietBaiTap(UUID exerciseId) {
        UUID hocVienId = currentHocVienService.getCurrentHocVienId();
        Objects.requireNonNull(exerciseId, "exerciseId khong duoc null");

        Exercise exercise = exerciseRepo.findById(exerciseId)
                .orElseThrow(() -> new IllegalArgumentException("Khong tim thay bai tap"));

        Map<UUID, SubmitExercise> submitMap = buildSubmitMap(List.of(exercise), hocVienId);
        return toResponseDTO(exercise, submitMap);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExerciseStudentsResponseDTO> getBaiTapSapMo(UUID lopHocPhanId) {
        return mapExercises(exerciseRepo.findSapMoByLopHocPhanId(lopHocPhanId, LocalDateTime.now()));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExerciseStudentsResponseDTO> getBaiTapDangMo(UUID lopHocPhanId) {
        return mapExercises(exerciseRepo.findDangMoByLopHocPhanId(lopHocPhanId, LocalDateTime.now()));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExerciseStudentsResponseDTO> getBaiTapDaDong(UUID lopHocPhanId) {
        return mapExercises(exerciseRepo.findDaDongByLopHocPhanId(lopHocPhanId, LocalDateTime.now()));
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isExerciseOpen(UUID exerciseId) {
        Exercise exercise = exerciseRepo.findById(exerciseId)
                .orElseThrow(() -> new IllegalArgumentException("Khong tim thay bai tap"));

        LocalDateTime now = LocalDateTime.now();
        return exercise.getThoiGianBatDau() != null
                && exercise.getThoiGianKetThuc() != null
                && !now.isBefore(exercise.getThoiGianBatDau())
                && !now.isAfter(exercise.getThoiGianKetThuc());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasExerciseResult(UUID exerciseId) {
        UUID hocVienId = currentHocVienService.getCurrentHocVienId();

        return submitRepo
                .findByExercise_IdAndHocVien_Id(exerciseId, hocVienId)
                .map(submit -> submit.getDiem() != null)
                .orElse(false);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean canEditExercise(UUID exerciseId) {
        return isExerciseOpen(exerciseId) && !hasExerciseResult(exerciseId);
    }

    private List<ExerciseStudentsResponseDTO> mapExercises(List<Exercise> exercises) {
        if (exercises.isEmpty()) {
            return List.of();
        }

        UUID hocVienId = currentHocVienService.getCurrentHocVienId();
        Map<UUID, SubmitExercise> submitMap = buildSubmitMap(exercises, hocVienId);

        return exercises.stream()
                .map(exercise -> toResponseDTO(exercise, submitMap))
                .toList();
    }

    private Map<UUID, SubmitExercise> buildSubmitMap(List<Exercise> exercises, UUID hocVienId) {
        List<UUID> ids = exercises.stream()
                .map(Exercise::getId)
                .toList();

        if (ids.isEmpty()) {
            return Map.of();
        }

        return submitRepo.findByExerciseIdsAndHocVienId(ids, hocVienId).stream()
                .collect(Collectors.toMap(
                        submit -> submit.getExercise().getId(),
                        submit -> submit,
                        (current, replacement) -> replacement));
    }

    private ExerciseEnum getTrangThai(Exercise exercise) {
        LocalDateTime now = LocalDateTime.now();

        if (exercise.getThoiGianBatDau() != null && now.isBefore(exercise.getThoiGianBatDau())) {
            return ExerciseEnum.SAP_MO;
        }

        if (exercise.getThoiGianKetThuc() != null) {
            if (now.isAfter(exercise.getThoiGianKetThuc())) {
                return ExerciseEnum.DA_DONG;
            }

            if (now.isAfter(exercise.getThoiGianKetThuc().minusHours(HOURS_WARNING))) {
                return ExerciseEnum.SAP_HET_HAN;
            }
        }

        return ExerciseEnum.DANG_MO;
    }

    private ExerciseStudentsResponseDTO toResponseDTO(
            Exercise exercise, Map<UUID, SubmitExercise> submitMap) {
        SubmitExercise submit = submitMap.get(exercise.getId());
        Double score = submit != null ? submit.getDiem() : null;

        return ExerciseStudentsResponseDTO.builder()
                .id(exercise.getId())
                .tieude(exercise.getTieuDe())
                .moTa(exercise.getMoTa())
                .thoiGianBatDau(exercise.getThoiGianBatDau())
                .thoiGianKetThuc(exercise.getThoiGianKetThuc())
                .createdAt(exercise.getCreatedAt())
                .updatedAt(exercise.getUpdatedAt())
                .lopHocPhanId(exercise.getLopHocPhan() != null ? exercise.getLopHocPhan().getId() : null)
                .maLopHocPhan(exercise.getLopHocPhan() != null ? exercise.getLopHocPhan().getMaLopHocPhan() : null)
                .trangThai(getTrangThai(exercise))
                .dacoketqua(score != null)
                .diemSo(score)
                .build();
    }
}
