package com.university.service.lecturer;

import com.university.dto.request.lecturer.AttendanceEntryDTO;
import com.university.dto.request.lecturer.AttendanceRequestDTO;
import com.university.dto.request.lecturer.AssignmentRequestDTO;
import com.university.dto.request.lecturer.DocumentRequestDTO;
import com.university.dto.request.lecturer.GradeRequestDTO;
import com.university.dto.request.lecturer.LecturerProfileRequestDTO;
import com.university.dto.request.lecturer.NotificationRequestDTO;
import com.university.dto.request.lecturer.QuizRequestDTO;
import com.university.dto.request.lecturer.QuestionRequestDTO;
import com.university.dto.request.lecturer.AnswerRequestDTO;
import com.university.dto.response.lecturer.AttendanceResponseDTO;
import com.university.dto.response.lecturer.AssignmentResponseDTO;
import com.university.dto.response.lecturer.DocumentResponseDTO;
import com.university.dto.response.lecturer.GradeResponseDTO;
import com.university.dto.response.lecturer.GradeStudentResponseDTO;
import com.university.dto.response.lecturer.LecturerClassDetailResponseDTO;
import com.university.dto.response.lecturer.LecturerClassSummaryResponseDTO;
import com.university.dto.response.lecturer.LecturerDashboardResponseDTO;
import com.university.dto.response.lecturer.LecturerProfileResponseDTO;
import com.university.dto.response.lecturer.LecturerScheduleDTO;
import com.university.dto.response.lecturer.NotificationResponseDTO;
import com.university.dto.response.lecturer.LecturerClassStudentResponseDTO;
import com.university.dto.response.lecturer.AttendanceStudentResponseDTO;
import com.university.dto.response.lecturer.SubmissionResponseDTO;
import com.university.dto.response.lecturer.QuizResponseDTO;
import com.university.dto.response.lecturer.QuestionResponseDTO;
import com.university.dto.response.lecturer.AnswerResponseDTO;
import com.university.dto.response.lecturer.QuizResultResponseDTO;
import com.university.dto.response.lecturer.ExerciseQuizResponseDTO;
import com.university.dto.response.lecturer.StudentQuizResultDTO;
import com.university.entity.CotDiem;
import com.university.entity.DangKyTinChi;
import com.university.entity.DanhGiaGiangVien;
import com.university.entity.DiemDanh;
import com.university.entity.DiemThanhPhan;
import com.university.entity.Exercise;
import com.university.entity.FileStorage;
import com.university.entity.HocVien;
import com.university.entity.Lich;
import com.university.entity.LopHocPhan;
import com.university.entity.MonHoc;
import com.university.entity.NhanVien;
import com.university.entity.Quiz;
import com.university.entity.Questions;
import com.university.entity.Answers;
import com.university.entity.QuizAttempt;
import com.university.entity.QuizExercise;
import com.university.entity.SubmitExercise;
import com.university.entity.ThongBao;
import com.university.entity.ThongBaoNguoiDung;
import com.university.entity.Users;
import com.university.enums.FileEnum;
import com.university.enums.LoaiThongBaoEnum;
import com.university.enums.TaiLieuEnum;
import com.university.mapper.lecturer.LecturerMapper;
import com.university.repository.admin.UsersAdminRepository;
import com.university.repository.admin.LopHocPhanAdminRepository;
import com.university.repository.lecturer.LecturerAttendanceRepository;
import com.university.repository.lecturer.LecturerAssignmentRepository;
import com.university.repository.lecturer.LecturerDocumentRepository;
import com.university.repository.lecturer.LecturerDangKyTinChiRepository;
import com.university.repository.lecturer.LecturerDiemThanhPhanRepository;
import com.university.repository.lecturer.LecturerExerciseRepository;
import com.university.repository.lecturer.LecturerFileStorageRepository;
import com.university.repository.lecturer.LecturerGradeRepository;
import com.university.repository.lecturer.LecturerNotificationRepository;
import com.university.repository.lecturer.LecturerQuizAttemptRepository;
import com.university.repository.lecturer.LecturerQuizExerciseRepository;
import com.university.repository.lecturer.LecturerQuizRepository;
import com.university.repository.lecturer.LecturerQuestionRepository;
import com.university.repository.lecturer.LecturerRepository;
import com.university.repository.lecturer.LecturerScheduleRepository;
import com.university.repository.lecturer.LecturerStudentRepository;
import com.university.repository.lecturer.LecturerSubmitExerciseRepository;
import com.university.repository.lecturer.LecturerThongBaoNguoiDungRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class LecturerService {

    private final UsersAdminRepository userRepository;
    private final LecturerRepository lecturerRepository;
    private final LecturerScheduleRepository scheduleRepository;
    private final LecturerStudentRepository studentRepository;
    private final LecturerDocumentRepository documentRepository;
    private final LecturerAssignmentRepository assignmentRepository;
    private final LecturerSubmitExerciseRepository submitExerciseRepository;
    private final LecturerNotificationRepository thongBaoRepository;
    private final LecturerAttendanceRepository attendanceRepository;
    private final LecturerGradeRepository gradeRepository;
    private final LecturerDiemThanhPhanRepository diemThanhPhanRepository;
    private final LecturerFileStorageRepository fileStorageRepository;
    private final LopHocPhanAdminRepository lopHocPhanRepository;
    private final LecturerDangKyTinChiRepository dangKyTinChiRepository;
    private final LecturerThongBaoNguoiDungRepository thongBaoNguoiDungRepository;
    private final LecturerQuizRepository quizRepository;
    private final LecturerQuestionRepository questionRepository;
    private final LecturerQuizAttemptRepository quizAttemptRepository;
    private final LecturerExerciseRepository exerciseRepository;
    private final LecturerQuizExerciseRepository quizExerciseRepository;
    private final LecturerMapper mapper;

    public LecturerProfileResponseDTO getProfile(UUID userId) {
        Users user = loadActiveLecturerUser(userId);
        List<LecturerScheduleDTO> schedule = getSchedule(userId, LocalDate.now(), LocalDate.now().plusDays(7));
        return mapper.toProfileResponse(user, schedule);
    }

    public LecturerProfileResponseDTO updateProfile(UUID userId, LecturerProfileRequestDTO request) {
        Users user = loadActiveLecturerUser(userId);
        user.setSoDienThoai(request.getSoDienThoai());
        user.setEmail(request.getEmail());

        if (request.getAvatarUrl() != null && !request.getAvatarUrl().isBlank()) {
            FileStorage avatar = fileStorageRepository.findByUsers_IdAndFileType(userId, FileEnum.AVATAR).stream().findFirst().orElse(null);
            if (avatar == null) {
                avatar = new FileStorage();
                avatar.setUsers(user);
                avatar.setFileType(FileEnum.AVATAR);
                avatar.setFileName("avatar-");
            }
            avatar.setFileUrl(request.getAvatarUrl());
            fileStorageRepository.save(avatar);
        }

        userRepository.save(user);
        return getProfile(userId);
    }

    public LecturerDashboardResponseDTO getDashboard(UUID userId) {
        validateLecturerAssignment(userId, null);
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        LocalDateTime todayEnd = todayStart.plusDays(1);

        List<LecturerScheduleDTO> todaySchedule = scheduleRepository
                .findByLopHocPhan_DGiangDays_NhanVien_Users_IdAndNgayHocBetween(userId, todayStart, todayEnd).stream()
                .map(mapper::toScheduleDTO)
                .collect(Collectors.toList());

        int totalClasses = scheduleRepository.findByLopHocPhan_DGiangDays_NhanVien_Users_Id(userId).stream()
                .map(lich -> lich.getLopHocPhan().getId())
                .distinct()
                .collect(Collectors.toList())
                .size();

        int ungradedAssignments = submitExerciseRepository.countByExercise_LopHocPhan_DGiangDays_NhanVien_Users_Id(userId);

        List<DiemDanh> allAttendance = attendanceRepository.findByLich_LopHocPhan_DGiangDays_NhanVien_Users_Id(userId);
        double attendanceRate = 0.0;
        if (!allAttendance.isEmpty()) {
            long presentCount = allAttendance.stream().filter(d -> Boolean.TRUE.equals(d.getTrangThai())).count();
            attendanceRate = (presentCount * 100.0) / allAttendance.size();
        }

        return new LecturerDashboardResponseDTO(todaySchedule, totalClasses, ungradedAssignments, attendanceRate);
    }

    public List<LecturerScheduleDTO> getSchedule(UUID userId, LocalDate fromDate, LocalDate toDate) {
        LocalDateTime from = fromDate.atStartOfDay();
        LocalDateTime to = toDate.plusDays(1).atStartOfDay();
        return scheduleRepository.findByLopHocPhan_DGiangDays_NhanVien_Users_IdAndNgayHocBetween(userId, from, to).stream()
                .map(mapper::toScheduleDTO)
                .collect(Collectors.toList());
    }

    public List<LecturerClassSummaryResponseDTO> getClasses(UUID userId) {
        validateLecturerAssignment(userId, null);
        List<Lich> schedules = scheduleRepository.findByLopHocPhan_DGiangDays_NhanVien_Users_Id(userId);
        Map<UUID, LecturerClassSummaryResponseDTO> map = new HashMap<>();

        schedules.forEach(lich -> {
            LopHocPhan lopHocPhan = lich.getLopHocPhan();
            map.compute(lopHocPhan.getId(), (id, existing) -> {
                LocalDateTime start = lich.getNgayHoc();
                LocalDateTime end = lich.getNgayHoc();
                if (existing != null) {
                    start = existing.getNgayBatDau().isBefore(start) ? existing.getNgayBatDau() : start;
                    end = existing.getNgayKetThuc().isAfter(end) ? existing.getNgayKetThuc() : end;
                }
                return new LecturerClassSummaryResponseDTO(
                        lopHocPhan.getId(),
                        lopHocPhan.getMaLopHocPhan(),
                        lopHocPhan.getMonHoc().getTenMonHoc(),
                        lich.getPhong().getTenPhong(),
                        lich.getPhong().getToaNha(),
                        start,
                        end
                );
            });
        });

        return new ArrayList<>(map.values());
    }

    public LecturerClassDetailResponseDTO getClassDetail(UUID userId, UUID lopHocPhanId, String keyword) {
        validateLecturerAssignment(userId, lopHocPhanId);
        LopHocPhan lopHocPhan = lopHocPhanRepository.findById(lopHocPhanId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học phần."));

        List<LecturerClassStudentResponseDTO> students = studentRepository.findStudentsByLopHocPhanId(lopHocPhanId, keyword);
        String lichMoTa = lopHocPhan.getDLichs().stream()
                .map(lich -> lich.getNgayHoc() + " - " + lich.getGioHoc().getTenGioHoc())
                .collect(Collectors.joining("; "));

        return new LecturerClassDetailResponseDTO(
                lopHocPhan.getId(),
                lopHocPhan.getMaLopHocPhan(),
                lopHocPhan.getMonHoc().getTenMonHoc(),
                firstPhong(lopHocPhan),
                firstToaNha(lopHocPhan),
                lichMoTa,
                students
        );
    }

    public NotificationResponseDTO sendNotification(UUID userId, NotificationRequestDTO request) {
        validateLecturerAssignment(userId, request.getLopHocPhanId());
        Users user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User không tồn tại."));

        ThongBao thongBao = new ThongBao();
        thongBao.setTieuDe(request.getTieuDe());
        thongBao.setNoiDung(request.getNoiDung());
        thongBao.setFileThongBao(request.getFileThongBao());
        thongBao.setLoaiThongBao(LoaiThongBaoEnum.THONG_BAO_GIANG_VIEN);
        thongBao.setUsers(user);
        thongBaoRepository.save(thongBao);

        List<DangKyTinChi> registrations = dangKyTinChiRepository.findByLopHocPhan_Id(request.getLopHocPhanId());
        List<ThongBaoNguoiDung> receivers = registrations.stream()
                .map(reg -> {
                    ThongBaoNguoiDung tnd = new ThongBaoNguoiDung();
                    tnd.setUsers(reg.getHocVien().getUsers());
                    tnd.setThongBao(thongBao);
                    tnd.setDaNhan(false);
                    return tnd;
                })
                .collect(Collectors.toList());

        thongBaoNguoiDungRepository.saveAll(receivers);
        return new NotificationResponseDTO(thongBao.getId(), thongBao.getTieuDe(), thongBao.getNoiDung(), thongBao.getFileThongBao(), thongBao.getCreatedAt());
    }

    public List<DocumentResponseDTO> getDocuments(UUID lopHocPhanId, UUID userId) {
        validateLecturerAssignment(userId, lopHocPhanId);
        return documentRepository.findByLopHocPhan_Id(lopHocPhanId).stream()
                .map(taiLieu -> new DocumentResponseDTO(
                        taiLieu.getId(),
                        taiLieu.getTenTaiLieu(),
                        taiLieu.getMoTa(),
                        taiLieu.getFileTaiLieuUrl(),
                        taiLieu.getLoaiTaiLieu().name(),
                        taiLieu.getNgayDang(),
                        taiLieu.getLopHocPhan().getId()))
                .collect(Collectors.toList());
    }

    public DocumentResponseDTO createDocument(UUID userId, DocumentRequestDTO request) {
        validateLecturerAssignment(userId, request.getLopHocPhanId());
        LopHocPhan lopHocPhan = lopHocPhanRepository.findById(request.getLopHocPhanId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học phần."));

        com.university.entity.TaiLieu taiLieu = new com.university.entity.TaiLieu();
        taiLieu.setTenTaiLieu(request.getTenTaiLieu());
        taiLieu.setMoTa(request.getMoTa());
        taiLieu.setFileTaiLieuUrl(request.getFileTaiLieuUrl());
        taiLieu.setLopHocPhan(lopHocPhan);

        if (request.getLoaiTaiLieu() != null) {
            taiLieu.setLoaiTaiLieu(TaiLieuEnum.valueOf(request.getLoaiTaiLieu().toUpperCase(Locale.ROOT)));
        } else {
            taiLieu.setLoaiTaiLieu(TaiLieuEnum.PDF);
        }

        taiLieu.setNgayDang(LocalDateTime.now());
        com.university.entity.TaiLieu saved = documentRepository.save(taiLieu);

        return new DocumentResponseDTO(saved.getId(), saved.getTenTaiLieu(), saved.getMoTa(), saved.getFileTaiLieuUrl(), saved.getLoaiTaiLieu().name(), saved.getNgayDang(), saved.getLopHocPhan().getId());
    }

    public DocumentResponseDTO updateDocument(UUID userId, UUID documentId, DocumentRequestDTO request) {
        com.university.entity.TaiLieu existing = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Tài liệu không tồn tại."));
        validateLecturerAssignment(userId, existing.getLopHocPhan().getId());
        existing.setTenTaiLieu(request.getTenTaiLieu());
        existing.setMoTa(request.getMoTa());
        existing.setFileTaiLieuUrl(request.getFileTaiLieuUrl());
        if (request.getLoaiTaiLieu() != null) {
            existing.setLoaiTaiLieu(TaiLieuEnum.valueOf(request.getLoaiTaiLieu().toUpperCase(Locale.ROOT)));
        }
        com.university.entity.TaiLieu saved = documentRepository.save(existing);
        return new DocumentResponseDTO(saved.getId(), saved.getTenTaiLieu(), saved.getMoTa(), saved.getFileTaiLieuUrl(), saved.getLoaiTaiLieu().name(), saved.getNgayDang(), saved.getLopHocPhan().getId());
    }

    public void deleteDocument(UUID userId, UUID documentId) {
        com.university.entity.TaiLieu existing = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Tài liệu không tồn tại."));
        validateLecturerAssignment(userId, existing.getLopHocPhan().getId());
        documentRepository.delete(existing);
    }

    public List<AssignmentResponseDTO> getAssignments(UUID lopHocPhanId, UUID userId) {
        validateLecturerAssignment(userId, lopHocPhanId);
        return assignmentRepository.findByLopHocPhan_Id(lopHocPhanId).stream()
                .map(exercise -> {
                    int submissionCount = submitExerciseRepository.findByExercise_LopHocPhan_Id(lopHocPhanId).size();
                    return new AssignmentResponseDTO(
                            exercise.getId(),
                            exercise.getTieuDe(),
                            exercise.getMoTa(),
                            null,
                            exercise.getCreatedAt(),
                            exercise.getLopHocPhan().getId(),
                            submissionCount);
                })
                .collect(Collectors.toList());
    }

    public AssignmentResponseDTO createAssignment(UUID userId, AssignmentRequestDTO request) {
        validateLecturerAssignment(userId, request.getLopHocPhanId());
        LopHocPhan lopHocPhan = lopHocPhanRepository.findById(request.getLopHocPhanId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học phần."));

        Exercise exercise = new Exercise();
        exercise.setTieuDe(request.getTieuDe());
        exercise.setMoTa(request.getFileExerciseUrl());
        exercise.setLopHocPhan(lopHocPhan);
        exercise.setThoiGianBatDau(LocalDateTime.now());
        exercise.setThoiGianKetThuc(LocalDateTime.now().plusWeeks(1));

        Exercise saved = assignmentRepository.save(exercise);
        return new AssignmentResponseDTO(saved.getId(), saved.getTieuDe(), saved.getMoTa(), null, saved.getCreatedAt(), saved.getLopHocPhan().getId(), 0);
    }

    public AssignmentResponseDTO updateAssignment(UUID userId, UUID assignmentId, AssignmentRequestDTO request) {
        Exercise existing = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Bài tập không tồn tại."));
        validateLecturerAssignment(userId, existing.getLopHocPhan().getId());
        existing.setTieuDe(request.getTieuDe());
        existing.setMoTa(request.getFileExerciseUrl());
        Exercise saved = assignmentRepository.save(existing);
        int submissionCount = submitExerciseRepository.findByExercise_LopHocPhan_Id(existing.getLopHocPhan().getId()).size();
        return new AssignmentResponseDTO(saved.getId(), saved.getTieuDe(), saved.getMoTa(), null, saved.getCreatedAt(), saved.getLopHocPhan().getId(), submissionCount);
    }

    public void deleteAssignment(UUID userId, UUID assignmentId) {
        Exercise existing = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Bài tập không tồn tại."));
        validateLecturerAssignment(userId, existing.getLopHocPhan().getId());
        assignmentRepository.delete(existing);
    }

    public GradeResponseDTO getGrades(UUID lopHocPhanId, UUID userId) {
        validateLecturerAssignment(userId, lopHocPhanId);
        List<DangKyTinChi> registrations = dangKyTinChiRepository.findByLopHocPhan_Id(lopHocPhanId);
        List<GradeStudentResponseDTO> students = registrations.stream()
                .map(reg -> mapper.toGradeStudentDTO(reg.getHocVien(), findAverageGrade(lopHocPhanId, reg.getHocVien().getId())))
                .collect(Collectors.toList());
        return new GradeResponseDTO(lopHocPhanId, students);
    }

    public void updateGrades(UUID userId, GradeRequestDTO request) {
        validateLecturerAssignment(userId, request.getLopHocPhanId());
        CotDiem totalCotDiem = gradeRepository.findByLopHocPhan_IdAndTenCotDiem(request.getLopHocPhanId(), "TỔNG").orElseGet(() -> {
            CotDiem entity = new CotDiem();
            entity.setTenCotDiem("TỔNG");
            entity.setTiTrong("100");
            entity.setLoai(null);
            entity.setThuTuHienThi(1);
            entity.setLopHocPhan(lopHocPhanRepository.findById(request.getLopHocPhanId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học phần.")));
            return gradeRepository.save(entity);
        });

        request.getStudentGrades().forEach((hocVienId, diem) -> {
            DangKyTinChi registration = dangKyTinChiRepository.findByHocVien_IdAndLopHocPhan_Id(hocVienId, request.getLopHocPhanId())
                    .orElseThrow(() -> new RuntimeException("Sinh viên không ghi danh hoặc không thuộc lớp."));
            DiemThanhPhan diemThanhPhan = diemThanhPhanRepository.findByDangKyTinChi_HocVien_IdAndCotDiem_Id(hocVienId, totalCotDiem.getId())
                    .orElseGet(() -> {
                        DiemThanhPhan newEntity = new DiemThanhPhan();
                        newEntity.setDangKyTinChi(registration);
                        newEntity.setCotDiem(totalCotDiem);
                        return newEntity;
                    });
            diemThanhPhan.setDiemSo(diem);
            diemThanhPhanRepository.save(diemThanhPhan);
        });
    }

    public AttendanceResponseDTO getAttendance(UUID lopHocPhanId, UUID userId) {
        validateLecturerAssignment(userId, lopHocPhanId);
        List<DangKyTinChi> registrations = dangKyTinChiRepository.findByLopHocPhan_Id(lopHocPhanId);
        Map<UUID, Boolean> attendanceMap = attendanceRepository.findByLich_LopHocPhan_Id(lopHocPhanId).stream()
                .collect(Collectors.toMap(d -> d.getHocVien().getId(), DiemDanh::getTrangThai, (first, second) -> second));

        List<AttendanceStudentResponseDTO> students = registrations.stream()
                .map(reg -> mapper.toAttendanceStudentDTO(reg.getHocVien(), attendanceMap.get(reg.getHocVien().getId())))
                .collect(Collectors.toList());
        return new AttendanceResponseDTO(lopHocPhanId, students);
    }

    public void updateAttendance(UUID userId, AttendanceRequestDTO request) {
        validateLecturerAssignment(userId, request.getLopHocPhanId());
        LopHocPhan lopHocPhan = lopHocPhanRepository.findById(request.getLopHocPhanId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học phần."));

        List<Lich> schedule = lopHocPhan.getDLichs();
        if (schedule.isEmpty()) {
            throw new RuntimeException("Lớp học phần chưa có lịch.");
        }

        Lich todayLich = schedule.stream()
                .filter(lich -> lich.getNgayHoc().toLocalDate().equals(LocalDate.now()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Không có lịch dạy hôm nay cho lớp này."));

        for (AttendanceEntryDTO entry : request.getEntries()) {
            HocVien hocVien = dangKyTinChiRepository.findByHocVien_IdAndLopHocPhan_Id(entry.getHocVienId(), request.getLopHocPhanId())
                    .map(DangKyTinChi::getHocVien)
                    .orElseThrow(() -> new RuntimeException("Sinh viên không thuộc lớp học phần."));

            DiemDanh diemDanh = attendanceRepository.findByHocVien_IdAndLich_Id(entry.getHocVienId(), todayLich.getId())
                    .orElseGet(() -> {
                        DiemDanh dd = new DiemDanh();
                        dd.setHocVien(hocVien);
                        dd.setLich(todayLich);
                        return dd;
                    });
            diemDanh.setTrangThai(entry.getTrangThai());
            attendanceRepository.save(diemDanh);
        }
    }

    private Users loadActiveLecturerUser(UUID userId) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại."));
        NhanVien lecturer = lecturerRepository.findByUsers_Id(userId)
                .orElseThrow(() -> new RuntimeException("Người dùng không phải giảng viên."));
        if (!user.isTrangThai()) {
            throw new RuntimeException("Người dùng đang không hoạt động.");
        }
        return user;
    }

    private void validateLecturerAssignment(UUID userId, UUID lopHocPhanId) {
        if (lopHocPhanId == null) {
            lecturerRepository.findByUsers_Id(userId)
                    .orElseThrow(() -> new RuntimeException("Người dùng không phải giảng viên."));
            return;
        }
        boolean assigned = lopHocPhanRepository.findById(lopHocPhanId)
                .map(lhp -> lhp.getDGiangDays().stream()
                        .anyMatch(gd -> gd.getNhanVien().getUsers().getId().equals(userId)))
                .orElse(false);
        if (!assigned) {
            throw new RuntimeException("Giảng viên không được phân công cho lớp học phần này.");
        }
    }

    private Float findAverageGrade(UUID lopHocPhanId, UUID hocVienId) {
        List<DiemThanhPhan> grades = diemThanhPhanRepository.findByDangKyTinChi_LopHocPhan_Id(lopHocPhanId).stream()
                .filter(item -> item.getDangKyTinChi().getHocVien().getId().equals(hocVienId))
                .collect(Collectors.toList());
        if (grades.isEmpty()) {
            return null;
        }
        double sum = grades.stream().mapToDouble(d -> d.getDiemSo() != null ? d.getDiemSo() : 0.0).sum();
        return (float)(sum / grades.size());
    }

    private String firstPhong(LopHocPhan lopHocPhan) {
        return lopHocPhan.getDLichs().stream().findFirst().map(l -> l.getPhong().getTenPhong()).orElse(null);
    }

    private String firstToaNha(LopHocPhan lopHocPhan) {
        return lopHocPhan.getDLichs().stream().findFirst().map(l -> l.getPhong().getToaNha()).orElse(null);
    }

    /**
     * Lấy danh sách bài nộp của một bài tập trong lớp học phần
     */
    public List<SubmissionResponseDTO> getSubmissions(UUID lopHocPhanId, UUID exerciseId, UUID userId) {
        validateLecturerAssignment(userId, lopHocPhanId);

        // Kiểm tra exercise thuộc lớp học phần này
        Exercise exercise = assignmentRepository.findById(exerciseId)
                .orElseThrow(() -> new RuntimeException("Bài tập không tồn tại."));

        if (!exercise.getLopHocPhan().getId().equals(lopHocPhanId)) {
            throw new RuntimeException("Bài tập không thuộc lớp học phần này.");
        }

        List<SubmitExercise> submissions = submitExerciseRepository.findByExercise_LopHocPhan_Id(lopHocPhanId);

        return submissions.stream()
                .map(submission -> {
                    HocVien hocVien = submission.getHocVien();
                    Users user = hocVien.getUsers();

                    // Lấy điểm của sinh viên cho bài tập này (nếu có)
                    Float grade = findAverageGrade(lopHocPhanId, hocVien.getId());

                    return new SubmissionResponseDTO(
                            submission.getPhienThucHien(),
                            exercise.getId(),
                            exercise.getTieuDe(),
                            hocVien.getId(),
                            user.getHoTen(),
                            hocVien.getMaHocVien(),
                            submission.getFileExerciseUrl(),
                            submission.getThoiGianNop(),
                            grade,
                            null // feedback chưa có
                    );
                })
                .collect(Collectors.toList());
    }

    /**
     * Lấy chi tiết một bài nộp
     */
    public SubmissionResponseDTO getSubmissionDetail(Integer submissionId, UUID userId) {
        SubmitExercise submission = submitExerciseRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Bài nộp không tồn tại."));

        Exercise exercise = submission.getExercise();
        LopHocPhan lopHocPhan = exercise.getLopHocPhan();

        // Kiểm tra giảng viên có quyền xem lớp này không
        validateLecturerAssignment(userId, lopHocPhan.getId());

        HocVien hocVien = submission.getHocVien();
        Users user = hocVien.getUsers();

        // Lấy điểm của sinh viên cho bài tập này
        Float grade = findAverageGrade(lopHocPhan.getId(), hocVien.getId());

        return new SubmissionResponseDTO(
                submission.getPhienThucHien(),
                exercise.getId(),
                exercise.getTieuDe(),
                hocVien.getId(),
                user.getHoTen(),
                hocVien.getMaHocVien(),
                submission.getFileExerciseUrl(),
                submission.getThoiGianNop(),
                grade,
                null
        );
    }

    // ==================== QUIZ MANAGEMENT ====================

    /**
     * Tạo quiz mới với các exercise
     */
    public QuizResponseDTO createQuiz(QuizRequestDTO request, UUID userId) {
        // Kiểm tra giảng viên có dạy lớp học phần này không
        LopHocPhan lopHocPhan = lopHocPhanRepository.findById(request.getLopHocPhanId())
                .orElseThrow(() -> new RuntimeException("Lớp học phần không tồn tại."));

        validateLecturerAssignment(userId, request.getLopHocPhanId());

        // Tạo quiz
        Quiz quiz = new Quiz();
        quiz.setTieuDe(request.getTieuDe());
        quiz.setMoTa(request.getMoTa());
        quiz.setThoiGianBatDau(request.getThoiGianBatDau());
        quiz.setThoiGianKetThuc(request.getThoiGianKetThuc());
        quiz.setThoiGianLam(request.getThoiGianLam());
        quiz.setLopHocPhan(lopHocPhan);

        Quiz savedQuiz = quizRepository.save(quiz);

        // Liên kết quiz với các exercise
        List<ExerciseQuizResponseDTO> exerciseDTOs = request.getExercises().stream()
                .map(exerciseReq -> {
                    Exercise exercise = exerciseRepository.findById(exerciseReq.getExerciseId())
                            .orElseThrow(() -> new RuntimeException("Exercise không tồn tại: " + exerciseReq.getExerciseId()));

                    // Kiểm tra exercise thuộc lớp học phần này
                    if (!exercise.getLopHocPhan().getId().equals(request.getLopHocPhanId())) {
                        throw new RuntimeException("Exercise không thuộc lớp học phần này.");
                    }

                    QuizExercise quizExercise = new QuizExercise();
                    quizExercise.setQuiz(savedQuiz);
                    quizExercise.setExercise(exercise);
                    quizExerciseRepository.save(quizExercise);

                    // Đếm số câu hỏi trong exercise
                    int questionCount = exercise.getDQuestions() != null ? exercise.getDQuestions().size() : 0;

                    return new ExerciseQuizResponseDTO(
                            exercise.getId(),
                            exercise.getTieuDe(),
                            questionCount
                    );
                })
                .collect(Collectors.toList());

        return new QuizResponseDTO(
                savedQuiz.getId(),
                savedQuiz.getLopHocPhan().getId(),
                savedQuiz.getLopHocPhan().getMonHoc().getTenMonHoc(),
                savedQuiz.getTieuDe(),
                savedQuiz.getMoTa(),
                savedQuiz.getThoiGianBatDau(),
                savedQuiz.getThoiGianKetThuc(),
                savedQuiz.getThoiGianLam(),
                savedQuiz.getCreatedAt(),
                exerciseDTOs.size(),
                exerciseDTOs
        );
    }

    /**
     * Lấy chi tiết quiz theo ID
     */
    public QuizResponseDTO getQuiz(UUID quizId, UUID userId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz không tồn tại."));

        // Kiểm tra giảng viên có quyền xem lớp này không
        validateLecturerAssignment(userId, quiz.getLopHocPhan().getId());

        // Lấy danh sách exercises của quiz
        List<ExerciseQuizResponseDTO> exerciseDTOs = quiz.getDQuizExercises().stream()
                .map(quizExercise -> {
                    Exercise exercise = quizExercise.getExercise();
                    int questionCount = exercise.getDQuestions() != null ? exercise.getDQuestions().size() : 0;
                    return new ExerciseQuizResponseDTO(
                            exercise.getId(),
                            exercise.getTieuDe(),
                            questionCount
                    );
                })
                .collect(Collectors.toList());

        return new QuizResponseDTO(
                quiz.getId(),
                quiz.getLopHocPhan().getId(),
                quiz.getLopHocPhan().getMonHoc().getTenMonHoc(),
                quiz.getTieuDe(),
                quiz.getMoTa(),
                quiz.getThoiGianBatDau(),
                quiz.getThoiGianKetThuc(),
                quiz.getThoiGianLam(),
                quiz.getCreatedAt(),
                exerciseDTOs.size(),
                exerciseDTOs
        );
    }

    /**
     * Cập nhật quiz
     */
    public QuizResponseDTO updateQuiz(UUID quizId, QuizRequestDTO request, UUID userId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz không tồn tại."));

        // Kiểm tra giảng viên có quyền sửa lớp này không
        validateLecturerAssignment(userId, quiz.getLopHocPhan().getId());

        // Kiểm tra quiz chưa bắt đầu mới cho phép sửa
        if (quiz.getThoiGianBatDau() != null && quiz.getThoiGianBatDau().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Không thể sửa quiz đã bắt đầu.");
        }

        quiz.setTieuDe(request.getTieuDe());
        quiz.setMoTa(request.getMoTa());
        quiz.setThoiGianBatDau(request.getThoiGianBatDau());
        quiz.setThoiGianKetThuc(request.getThoiGianKetThuc());
        quiz.setThoiGianLam(request.getThoiGianLam());

        Quiz savedQuiz = quizRepository.save(quiz);

        // Xóa tất cả liên kết QuizExercise cũ
        quizExerciseRepository.deleteByQuiz_Id(quizId);
        quiz.getDQuizExercises().clear();

        // Tạo liên kết mới với các exercise
        List<ExerciseQuizResponseDTO> exerciseDTOs = request.getExercises().stream()
                .map(exerciseReq -> {
                    Exercise exercise = exerciseRepository.findById(exerciseReq.getExerciseId())
                            .orElseThrow(() -> new RuntimeException("Exercise không tồn tại: " + exerciseReq.getExerciseId()));

                    // Kiểm tra exercise thuộc lớp học phần này
                    if (!exercise.getLopHocPhan().getId().equals(request.getLopHocPhanId())) {
                        throw new RuntimeException("Exercise không thuộc lớp học phần này.");
                    }

                    QuizExercise quizExercise = new QuizExercise();
                    quizExercise.setQuiz(savedQuiz);
                    quizExercise.setExercise(exercise);
                    quizExerciseRepository.save(quizExercise);

                    int questionCount = exercise.getDQuestions() != null ? exercise.getDQuestions().size() : 0;
                    return new ExerciseQuizResponseDTO(
                            exercise.getId(),
                            exercise.getTieuDe(),
                            questionCount
                    );
                })
                .collect(Collectors.toList());

        return new QuizResponseDTO(
                savedQuiz.getId(),
                savedQuiz.getLopHocPhan().getId(),
                savedQuiz.getLopHocPhan().getMonHoc().getTenMonHoc(),
                savedQuiz.getTieuDe(),
                savedQuiz.getMoTa(),
                savedQuiz.getThoiGianBatDau(),
                savedQuiz.getThoiGianKetThuc(),
                savedQuiz.getThoiGianLam(),
                savedQuiz.getCreatedAt(),
                exerciseDTOs.size(),
                exerciseDTOs
        );
    }

    /**
     * Xóa quiz
     */
    public void deleteQuiz(UUID quizId, UUID userId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz không tồn tại."));

        validateLecturerAssignment(userId, quiz.getLopHocPhan().getId());

        // Kiểm tra quiz đã bắt đầu chưa
        if (quiz.getThoiGianBatDau() != null && quiz.getThoiGianBatDau().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Không thể xóa quiz đã bắt đầu.");
        }

        quizRepository.delete(quiz);
    }

    /**
     * Lấy danh sách quiz của một lớp học phần
     */
    public List<QuizResponseDTO> getQuizzesByLopHocPhan(UUID lopHocPhanId, UUID userId) {
        validateLecturerAssignment(userId, lopHocPhanId);

        return quizRepository.findByLopHocPhan_Id(lopHocPhanId).stream()
                .map(quiz -> {
                    List<ExerciseQuizResponseDTO> exerciseDTOs = quiz.getDQuizExercises().stream()
                            .map(quizExercise -> {
                                Exercise exercise = quizExercise.getExercise();
                                int questionCount = exercise.getDQuestions() != null ? exercise.getDQuestions().size() : 0;
                                return new ExerciseQuizResponseDTO(
                                        exercise.getId(),
                                        exercise.getTieuDe(),
                                        questionCount
                                );
                            })
                            .collect(Collectors.toList());

                    return new QuizResponseDTO(
                            quiz.getId(),
                            quiz.getLopHocPhan().getId(),
                            quiz.getLopHocPhan().getMonHoc().getTenMonHoc(),
                            quiz.getTieuDe(),
                            quiz.getMoTa(),
                            quiz.getThoiGianBatDau(),
                            quiz.getThoiGianKetThuc(),
                            quiz.getThoiGianLam(),
                            quiz.getCreatedAt(),
                            exerciseDTOs.size(),
                            exerciseDTOs
                    );
                })
                .collect(Collectors.toList());
    }

    /**
     * Xem kết quả quiz của lớp học phần
     */
    public QuizResultResponseDTO getQuizResults(UUID lopHocPhanId, UUID quizId, UUID userId) {
        validateLecturerAssignment(userId, lopHocPhanId);

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz không tồn tại."));

        if (!quiz.getLopHocPhan().getId().equals(lopHocPhanId)) {
            throw new RuntimeException("Quiz không thuộc lớp học phần này.");
        }

        // Đếm tổng số học viên trong lớp
        Long tongSoHocVien = dangKyTinChiRepository.countByLopHocPhan_Id(lopHocPhanId);

        // Lấy tất cả attempts của quiz này
        List<QuizAttempt> attempts = quizAttemptRepository.findByQuiz_Id(quizId);

        Integer soLuongDaLam = attempts.size();

        // Tính điểm trung bình
        Float diemTrungBinh = null;
        if (!attempts.isEmpty()) {
            double sum = attempts.stream()
                    .mapToDouble(a -> a.getScore() != null ? a.getScore() : 0.0)
                    .sum();
            diemTrungBinh = (float) (sum / attempts.size());
        }

        // Chi tiết từng học viên
        List<StudentQuizResultDTO> studentResults = attempts.stream()
                .map(attempt -> {
                    HocVien hocVien = attempt.getHocVien();
                    Users user = hocVien.getUsers();
                    return new StudentQuizResultDTO(
                            hocVien.getId(),
                            user.getHoTen(),
                            hocVien.getMaHocVien(),
                            attempt.getScore(),
                            attempt.getUsedTime(),
                            attempt.getRemainingTime(),
                            attempt.getStatus() ? "COMPLETED" : "IN_PROGRESS"
                    );
                })
                .collect(Collectors.toList());

        return new QuizResultResponseDTO(
                quiz.getId(),
                quiz.getTieuDe(),
                tongSoHocVien.intValue(),
                soLuongDaLam,
                diemTrungBinh,
                studentResults
        );
    }
}
