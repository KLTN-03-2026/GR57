package com.university.controller.lecturer;

import com.university.dto.request.lecturer.AnswerRequestDTO;
import com.university.dto.request.lecturer.AttendanceRequestDTO;
import com.university.dto.request.lecturer.AssignmentRequestDTO;
import com.university.dto.request.lecturer.DocumentRequestDTO;
import com.university.dto.request.lecturer.GradeRequestDTO;
import com.university.dto.request.lecturer.LecturerProfileRequestDTO;
import com.university.dto.request.lecturer.NotificationRequestDTO;
import com.university.dto.request.lecturer.QuestionRequestDTO;
import com.university.dto.request.lecturer.QuizRequestDTO;
import com.university.dto.response.lecturer.AnswerResponseDTO;
import com.university.dto.response.lecturer.AttendanceResponseDTO;
import com.university.dto.response.lecturer.AssignmentResponseDTO;
import com.university.dto.response.lecturer.DocumentResponseDTO;
import com.university.dto.response.lecturer.GradeResponseDTO;
import com.university.dto.response.lecturer.LecturerClassDetailResponseDTO;
import com.university.dto.response.lecturer.LecturerClassSummaryResponseDTO;
import com.university.dto.response.lecturer.LecturerDashboardResponseDTO;
import com.university.dto.response.lecturer.LecturerProfileResponseDTO;
import com.university.dto.response.lecturer.LecturerScheduleDTO;
import com.university.dto.response.lecturer.NotificationResponseDTO;
import com.university.dto.response.lecturer.QuestionResponseDTO;
import com.university.dto.response.lecturer.QuizResultResponseDTO;
import com.university.dto.response.lecturer.QuizResponseDTO;
import com.university.dto.response.lecturer.SubmissionResponseDTO;
import com.university.service.lecturer.LecturerPermissionService;
import com.university.service.lecturer.LecturerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/lecturer")
@CrossOrigin
@RequiredArgsConstructor
public class LecturerController {

    private final LecturerService lecturerService;
    private final LecturerPermissionService permissionService;

    @GetMapping("/profile/{userId}")
    @PreAuthorize("@permissionService.hasPermission(#userId, 'LECTURER_PROFILE')")
    public ResponseEntity<LecturerProfileResponseDTO> getProfile(@PathVariable UUID userId) {
        return ResponseEntity.ok(lecturerService.getProfile(userId));
    }

    @PutMapping("/profile/{userId}")
    @PreAuthorize("@permissionService.hasPermission(#userId, 'LECTURER_PROFILE')")
    public ResponseEntity<LecturerProfileResponseDTO> updateProfile(
            @PathVariable UUID userId,
            @Valid @RequestBody LecturerProfileRequestDTO request) {
        return ResponseEntity.ok(lecturerService.updateProfile(userId, request));
    }

    @GetMapping("/dashboard/{userId}")
    @PreAuthorize("@permissionService.hasPermission(#userId, 'LECTURER_TEACHING')")
    public ResponseEntity<LecturerDashboardResponseDTO> getDashboard(@PathVariable UUID userId) {
        return ResponseEntity.ok(lecturerService.getDashboard(userId));
    }

    @GetMapping("/profile/{userId}/schedule")
    @PreAuthorize("@permissionService.hasPermission(#userId, 'LECTURER_TEACHING')")
    public ResponseEntity<List<LecturerScheduleDTO>> getSchedule(
            @PathVariable UUID userId,
            @RequestParam(required = false) LocalDate from,
            @RequestParam(required = false) LocalDate to) {
        LocalDate start = from != null ? from : LocalDate.now();
        LocalDate end = to != null ? to : start.plusWeeks(1);
        return ResponseEntity.ok(lecturerService.getSchedule(userId, start, end));
    }

    @GetMapping("/classes/{userId}")
    @PreAuthorize("@permissionService.hasPermission(#userId, 'LECTURER_TEACHING')")
    public ResponseEntity<List<LecturerClassSummaryResponseDTO>> getClasses(@PathVariable UUID userId) {
        return ResponseEntity.ok(lecturerService.getClasses(userId));
    }

    @GetMapping("/classes/{lopHocPhanId}/detail")
    @PreAuthorize("@permissionService.hasPermission(#userId, 'LECTURER_TEACHING')")
    public ResponseEntity<LecturerClassDetailResponseDTO> getClassDetail(
            @PathVariable UUID lopHocPhanId,
            @RequestParam UUID userId,
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(lecturerService.getClassDetail(userId, lopHocPhanId, keyword));
    }

    @PostMapping("/notifications")
    @PreAuthorize("@permissionService.hasPermission(#userId, 'LECTURER_NOTIFICATION')")
    public ResponseEntity<NotificationResponseDTO> sendNotification(
            @Valid @RequestBody NotificationRequestDTO request,
            @RequestParam UUID userId) {
        return ResponseEntity.ok(lecturerService.sendNotification(userId, request));
    }

    @GetMapping("/documents/{lopHocPhanId}")
    @PreAuthorize("@permissionService.hasPermission(#userId, 'LECTURER_DOCUMENT')")
    public ResponseEntity<List<DocumentResponseDTO>> getDocuments(
            @PathVariable UUID lopHocPhanId,
            @RequestParam UUID userId) {
        return ResponseEntity.ok(lecturerService.getDocuments(lopHocPhanId, userId));
    }

    @PostMapping("/documents")
    @PreAuthorize("@permissionService.hasPermission(#userId, 'LECTURER_DOCUMENT')")
    public ResponseEntity<DocumentResponseDTO> createDocument(
            @RequestParam UUID userId,
            @Valid @RequestBody DocumentRequestDTO request) {
        return ResponseEntity.ok(lecturerService.createDocument(userId, request));
    }

    @PutMapping("/documents/{documentId}")
    @PreAuthorize("@permissionService.hasPermission(#userId, 'LECTURER_DOCUMENT')")
    public ResponseEntity<DocumentResponseDTO> updateDocument(
            @PathVariable UUID documentId,
            @RequestParam UUID userId,
            @Valid @RequestBody DocumentRequestDTO request) {
        return ResponseEntity.ok(lecturerService.updateDocument(userId, documentId, request));
    }

    @DeleteMapping("/documents/{documentId}")
    @PreAuthorize("@permissionService.hasPermission(#userId, 'LECTURER_DOCUMENT')")
    public ResponseEntity<Void> deleteDocument(
            @PathVariable UUID documentId,
            @RequestParam UUID userId) {
        lecturerService.deleteDocument(userId, documentId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/assignments/{lopHocPhanId}")
    @PreAuthorize("@permissionService.hasPermission(#userId, 'LECTURER_ASSESSMENT')")
    public ResponseEntity<List<AssignmentResponseDTO>> getAssignments(
            @PathVariable UUID lopHocPhanId,
            @RequestParam UUID userId) {
        return ResponseEntity.ok(lecturerService.getAssignments(lopHocPhanId, userId));
    }

    @PostMapping("/assignments")
    @PreAuthorize("@permissionService.hasPermission(#userId, 'LECTURER_ASSESSMENT')")
    public ResponseEntity<AssignmentResponseDTO> createAssignment(
            @RequestParam UUID userId,
            @Valid @RequestBody AssignmentRequestDTO request) {
        return ResponseEntity.ok(lecturerService.createAssignment(userId, request));
    }

    @PutMapping("/assignments/{assignmentId}")
    @PreAuthorize("@permissionService.hasPermission(#userId, 'LECTURER_ASSESSMENT')")
    public ResponseEntity<AssignmentResponseDTO> updateAssignment(
            @PathVariable UUID assignmentId,
            @RequestParam UUID userId,
            @Valid @RequestBody AssignmentRequestDTO request) {
        return ResponseEntity.ok(lecturerService.updateAssignment(userId, assignmentId, request));
    }

    @DeleteMapping("/assignments/{assignmentId}")
    @PreAuthorize("@permissionService.hasPermission(#userId, 'LECTURER_ASSESSMENT')")
    public ResponseEntity<Void> deleteAssignment(
            @PathVariable UUID assignmentId,
            @RequestParam UUID userId) {
        lecturerService.deleteAssignment(userId, assignmentId);
        return ResponseEntity.noContent().build();
    }

    // ==================== SUBMISSION ENDPOINTS ====================

    /**
     * Lấy danh sách bài nộp của một bài tập trong lớp học phần
     * GET /api/lecturer/submissions/{lopHocPhanId}/{assignmentId}
     */
    @GetMapping("/submissions/{lopHocPhanId}/{assignmentId}")
    @PreAuthorize("@permissionService.hasPermission(#userId, 'LECTURER_ASSESSMENT')")
    public ResponseEntity<List<SubmissionResponseDTO>> getSubmissions(
            @PathVariable UUID lopHocPhanId,
            @PathVariable UUID assignmentId,
            @RequestParam UUID userId) {
        return ResponseEntity.ok(lecturerService.getSubmissions(lopHocPhanId, assignmentId, userId));
    }

    /**
     * Lấy chi tiết một bài nộp
     * GET /api/lecturer/submissions/{submissionId}/detail
     */
    @GetMapping("/submissions/{submissionId}/detail")
    @PreAuthorize("@permissionService.hasPermission(#userId, 'LECTURER_ASSESSMENT')")
    public ResponseEntity<SubmissionResponseDTO> getSubmissionDetail(
            @PathVariable Integer submissionId,
            @RequestParam UUID userId) {
        return ResponseEntity.ok(lecturerService.getSubmissionDetail(submissionId, userId));
    }

    // ==================== GRADE ENDPOINTS ====================

    @GetMapping("/grades/{lopHocPhanId}")
    @PreAuthorize("@permissionService.hasPermission(#userId, 'LECTURER_ASSESSMENT')")
    public ResponseEntity<GradeResponseDTO> getGrades(
            @PathVariable UUID lopHocPhanId,
            @RequestParam UUID userId) {
        return ResponseEntity.ok(lecturerService.getGrades(lopHocPhanId, userId));
    }

    @PutMapping("/grades")
    @PreAuthorize("@permissionService.hasPermission(#userId, 'LECTURER_ASSESSMENT')")
    public ResponseEntity<Void> updateGrades(
            @RequestParam UUID userId,
            @Valid @RequestBody GradeRequestDTO request) {
        lecturerService.updateGrades(userId, request);
        return ResponseEntity.ok().build();
    }

    // ==================== ATTENDANCE ENDPOINTS ====================

    @GetMapping("/attendance/{lopHocPhanId}")
    @PreAuthorize("@permissionService.hasPermission(#userId, 'LECTURER_ASSESSMENT')")
    public ResponseEntity<AttendanceResponseDTO> getAttendance(
            @PathVariable UUID lopHocPhanId,
            @RequestParam UUID userId) {
        return ResponseEntity.ok(lecturerService.getAttendance(lopHocPhanId, userId));
    }

    @PutMapping("/attendance")
    @PreAuthorize("@permissionService.hasPermission(#userId, 'LECTURER_ASSESSMENT')")
    public ResponseEntity<Void> updateAttendance(
            @RequestParam UUID userId,
            @Valid @RequestBody AttendanceRequestDTO request) {
        lecturerService.updateAttendance(userId, request);
        return ResponseEntity.ok().build();
    }

    // ==================== QUIZ MANAGEMENT ENDPOINTS ====================

    /**
     * Tạo quiz mới
     * POST /api/lecturer/quiz
     */
    @PostMapping("/quiz")
    @PreAuthorize("@permissionService.hasPermission(#userId, 'LECTURER_ASSESSMENT')")
    public ResponseEntity<QuizResponseDTO> createQuiz(
            @RequestParam UUID userId,
            @Valid @RequestBody QuizRequestDTO request) {
        return ResponseEntity.ok(lecturerService.createQuiz(request, userId));
    }

    /**
     * Lấy chi tiết quiz
     * GET /api/lecturer/quiz/{quizId}
     */
    @GetMapping("/quiz/{quizId}")
    @PreAuthorize("@permissionService.hasPermission(#userId, 'LECTURER_ASSESSMENT')")
    public ResponseEntity<QuizResponseDTO> getQuiz(
            @PathVariable UUID quizId,
            @RequestParam UUID userId) {
        return ResponseEntity.ok(lecturerService.getQuiz(quizId, userId));
    }

    /**
     * Cập nhật quiz
     * PUT /api/lecturer/quiz/{quizId}
     */
    @PutMapping("/quiz/{quizId}")
    @PreAuthorize("@permissionService.hasPermission(#userId, 'LECTURER_ASSESSMENT')")
    public ResponseEntity<QuizResponseDTO> updateQuiz(
            @PathVariable UUID quizId,
            @RequestParam UUID userId,
            @Valid @RequestBody QuizRequestDTO request) {
        return ResponseEntity.ok(lecturerService.updateQuiz(quizId, request, userId));
    }

    /**
     * Xóa quiz
     * DELETE /api/lecturer/quiz/{quizId}
     */
    @DeleteMapping("/quiz/{quizId}")
    @PreAuthorize("@permissionService.hasPermission(#userId, 'LECTURER_ASSESSMENT')")
    public ResponseEntity<Void> deleteQuiz(
            @PathVariable UUID quizId,
            @RequestParam UUID userId) {
        lecturerService.deleteQuiz(quizId, userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Lấy danh sách quiz của một lớp học phần
     * GET /api/lecturer/quiz/lop-hoc-phan/{lopHocPhanId}
     */
    @GetMapping("/quiz/lop-hoc-phan/{lopHocPhanId}")
    @PreAuthorize("@permissionService.hasPermission(#userId, 'LECTURER_ASSESSMENT')")
    public ResponseEntity<List<QuizResponseDTO>> getQuizzesByLopHocPhan(
            @PathVariable UUID lopHocPhanId,
            @RequestParam UUID userId) {
        return ResponseEntity.ok(lecturerService.getQuizzesByLopHocPhan(lopHocPhanId, userId));
    }

    /**
     * Xem kết quả quiz của lớp học phần
     * GET /api/lecturer/quiz/{lopHocPhanId}/results/{quizId}
     */
    @GetMapping("/quiz/{lopHocPhanId}/results/{quizId}")
    @PreAuthorize("@permissionService.hasPermission(#userId, 'LECTURER_ASSESSMENT')")
    public ResponseEntity<QuizResultResponseDTO> getQuizResults(
            @PathVariable UUID lopHocPhanId,
            @PathVariable UUID quizId,
            @RequestParam UUID userId) {
        return ResponseEntity.ok(lecturerService.getQuizResults(lopHocPhanId, quizId, userId));
    }
}
