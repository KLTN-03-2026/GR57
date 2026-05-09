import apiClient from './axiosClient';

// ── Types ──────────────────────────────────────────────────────────────────

export interface LecturerScheduleDTO {
  lichId: string;
  lopHocPhanId: string;
  maLopHocPhan: string;
  tenMonHoc: string;
  ngayHoc: string;
  gioBatDau: string;
  gioKetThuc: string;
  phong: string;
  toaNha: string;
}

export interface LecturerDashboardResponseDTO {
  todaySchedule: LecturerScheduleDTO[];
  totalClasses: number;
  ungradedAssignments: number;
  attendanceRate: number;
}

export interface LecturerProfileResponseDTO {
  id: string;
  hoTen: string;
  email: string;
  soDienThoai: string;
  avatarUrl: string;
  schedule: LecturerScheduleDTO[];
}

export interface LecturerProfileRequestDTO {
  soDienThoai: string;
  email: string;
  avatarUrl?: string;
}

export interface LecturerClassSummaryResponseDTO {
  lopHocPhanId: string;
  maLopHocPhan: string;
  tenMonHoc: string;
  phong: string;
  toaNha: string;
  ngayBatDau: string;
  ngayKetThuc: string;
}

export interface LecturerClassStudentResponseDTO {
  hocVienId: string;
  hoTen: string;
  maHocVien: string;
  avatarUrl: string;
}

export interface LecturerClassDetailResponseDTO {
  lopHocPhanId: string;
  maLopHocPhan: string;
  tenMonHoc: string;
  phong: string;
  toaNha: string;
  lichMoTa: string;
  hocViens: LecturerClassStudentResponseDTO[];
}

export interface DocumentResponseDTO {
  id: string;
  tenTaiLieu: string;
  moTa: string;
  fileTaiLieuUrl: string;
  loaiTaiLieu: string;
  ngayDang: string;
  lopHocPhanId: string;
}

export interface DocumentRequestDTO {
  lopHocPhanId: string;
  tenTaiLieu: string;
  moTa?: string;
  fileTaiLieuUrl: string;
  loaiTaiLieu?: string;
}

export interface AssignmentResponseDTO {
  id: string;
  tieuDe: string;
  moTa: string;
  fileExerciseUrl: string;
  createdAt: string;
  lopHocPhanId: string;
  submissionCount: number;
}

export interface AssignmentRequestDTO {
  lopHocPhanId: string;
  tieuDe: string;
  moTa?: string;
  fileExerciseUrl: string;
}

export interface SubmissionResponseDTO {
  submissionId: number;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  fileUrl: string;
  submittedAt: string;
  grade: number | null;
  feedback: string | null;
}

export interface GradeStudentResponseDTO {
  hocVienId: string;
  hoTen: string;
  maHocVien: string;
  diemTrungBinh: number | null;
}

export interface GradeResponseDTO {
  lopHocPhanId: string;
  students: GradeStudentResponseDTO[];
}

export interface GradeRequestDTO {
  lopHocPhanId: string;
  studentGrades: Record<string, number>;
}

export interface AttendanceStudentResponseDTO {
  hocVienId: string;
  hoTen: string;
  maHocVien: string;
  trangThai: boolean;
}

export interface AttendanceResponseDTO {
  lopHocPhanId: string;
  students: AttendanceStudentResponseDTO[];
}

export interface AttendanceEntryDTO {
  hocVienId: string;
  trangThai: boolean;
  ghiChu?: string;
}

export interface AttendanceRequestDTO {
  lopHocPhanId: string;
  ngayDiemDanh?: string;
  entries: AttendanceEntryDTO[];
}

export interface NotificationResponseDTO {
  id: string;
  tieuDe: string;
  noiDung: string;
  fileThongBao: string | null;
  createdAt: string;
}

export interface NotificationRequestDTO {
  lopHocPhanId: string;
  tieuDe: string;
  noiDung: string;
  fileThongBao?: string;
}

export interface QuizResponseDTO {
  quizId: string;
  lopHocPhanId: string;
  tenLopHocPhan: string;
  tieuDe: string;
  moTa: string;
  thoiGianBatDau: string;
  thoiGianKetThuc: string;
  thoiGianLam: number;
  createdAt: string;
  exerciseCount: number;
}

// ── API ────────────────────────────────────────────────────────────────────

const lecturerApi = {
  getDashboard: (userId: string) =>
    apiClient.get<LecturerDashboardResponseDTO>(`/lecturer/dashboard/${userId}`).then(r => r.data),

  getProfile: (userId: string) =>
    apiClient.get<LecturerProfileResponseDTO>(`/lecturer/profile/${userId}`).then(r => r.data),

  updateProfile: (userId: string, data: LecturerProfileRequestDTO) =>
    apiClient.put<LecturerProfileResponseDTO>(`/lecturer/profile/${userId}`, data).then(r => r.data),

  getSchedule: (userId: string, from?: string, to?: string) =>
    apiClient.get<LecturerScheduleDTO[]>(`/lecturer/profile/${userId}/schedule`, {
      params: { from, to },
    }).then(r => r.data),

  getClasses: (userId: string) =>
    apiClient.get<LecturerClassSummaryResponseDTO[]>(`/lecturer/classes/${userId}`).then(r => r.data),

  getClassDetail: (lopHocPhanId: string, userId: string, keyword?: string) =>
    apiClient.get<LecturerClassDetailResponseDTO>(`/lecturer/classes/${lopHocPhanId}/detail`, {
      params: { userId, keyword },
    }).then(r => r.data),

  // Documents
  getDocuments: (lopHocPhanId: string, userId: string) =>
    apiClient.get<DocumentResponseDTO[]>(`/lecturer/documents/${lopHocPhanId}`, {
      params: { userId },
    }).then(r => r.data),

  createDocument: (userId: string, data: DocumentRequestDTO) =>
    apiClient.post<DocumentResponseDTO>(`/lecturer/documents`, data, {
      params: { userId },
    }).then(r => r.data),

  updateDocument: (documentId: string, userId: string, data: DocumentRequestDTO) =>
    apiClient.put<DocumentResponseDTO>(`/lecturer/documents/${documentId}`, data, {
      params: { userId },
    }).then(r => r.data),

  deleteDocument: (documentId: string, userId: string) =>
    apiClient.delete(`/lecturer/documents/${documentId}`, { params: { userId } }),

  // Assignments
  getAssignments: (lopHocPhanId: string, userId: string) =>
    apiClient.get<AssignmentResponseDTO[]>(`/lecturer/assignments/${lopHocPhanId}`, {
      params: { userId },
    }).then(r => r.data),

  createAssignment: (userId: string, data: AssignmentRequestDTO) =>
    apiClient.post<AssignmentResponseDTO>(`/lecturer/assignments`, data, {
      params: { userId },
    }).then(r => r.data),

  updateAssignment: (assignmentId: string, userId: string, data: AssignmentRequestDTO) =>
    apiClient.put<AssignmentResponseDTO>(`/lecturer/assignments/${assignmentId}`, data, {
      params: { userId },
    }).then(r => r.data),

  deleteAssignment: (assignmentId: string, userId: string) =>
    apiClient.delete(`/lecturer/assignments/${assignmentId}`, { params: { userId } }),

  // Submissions
  getSubmissions: (lopHocPhanId: string, assignmentId: string, userId: string) =>
    apiClient.get<SubmissionResponseDTO[]>(`/lecturer/submissions/${lopHocPhanId}/${assignmentId}`, {
      params: { userId },
    }).then(r => r.data),

  getSubmissionDetail: (submissionId: number, userId: string) =>
    apiClient.get<SubmissionResponseDTO>(`/lecturer/submissions/${submissionId}/detail`, {
      params: { userId },
    }).then(r => r.data),

  // Grades
  getGrades: (lopHocPhanId: string, userId: string) =>
    apiClient.get<GradeResponseDTO>(`/lecturer/grades/${lopHocPhanId}`, {
      params: { userId },
    }).then(r => r.data),

  updateGrades: (userId: string, data: GradeRequestDTO) =>
    apiClient.put(`/lecturer/grades`, data, { params: { userId } }),

  // Attendance
  getAttendance: (lopHocPhanId: string, userId: string) =>
    apiClient.get<AttendanceResponseDTO>(`/lecturer/attendance/${lopHocPhanId}`, {
      params: { userId },
    }).then(r => r.data),

  updateAttendance: (userId: string, data: AttendanceRequestDTO) =>
    apiClient.put(`/lecturer/attendance`, data, { params: { userId } }),

  // Notifications
  sendNotification: (userId: string, data: NotificationRequestDTO) =>
    apiClient.post<NotificationResponseDTO>(`/lecturer/notifications`, data, {
      params: { userId },
    }).then(r => r.data),

  // Quiz
  getQuizzesByClass: (lopHocPhanId: string, userId: string) =>
    apiClient.get<QuizResponseDTO[]>(`/lecturer/quiz/lop-hoc-phan/${lopHocPhanId}`, {
      params: { userId },
    }).then(r => r.data),
};

export default lecturerApi;
