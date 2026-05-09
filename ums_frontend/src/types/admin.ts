export type AdminUserRole = 'admin' | 'lecture' | 'student';
export type AdminUserStatus = 'active' | 'inactive' | 'suspended';

export interface AdminUserAccount {
  id: string;
  name: string;
  email: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  createdAt: string;
  lastLogin: string;
}

export interface SchoolItem {
  id: string;
  maTruong: string;
  tenTruong: string;
  diaChi?: string;
  moTa?: string;
  ngayThanhLap?: string; // formatted date
  nguoiDaiDien?: string;
}

export interface DepartmentItem {
  id: string;
  code: string;
  name: string;
  headOfDepartment?: string;
  // optional linkage to a school
  truongId?: string;
  truongName?: string;
  diaChi?: string;
  moTa?: string;
}

export interface MajorItem {
  id: string;
  code: string;
  name: string;
  departmentId: string;
  departmentName: string;
}

export interface SubjectItem {
  id: string;
  code: string;
  name: string;
  credits: number;
  majorId: string;
  majorName: string;
}

export interface RoomItem {
  id: string;
  maPhong: string;
  tenPhong?: string;
  tinhTrang?: string;
  toaNha?: string;
  tang?: number;
  moTa?: string;
}

export interface SemesterItem {
  id: string;
  maHocKi: string;
  tenHocKi: string;
  ngayBatDau?: string; // dd/MM/yyyy or ISO
  ngayKetThuc?: string;
}

export interface PeriodItem {
  id: string;
  maGioHoc: string;
  tenGioHoc: string;
  thoiGianBatDau?: string; // HH:mm:ss
  thoiGianKetThuc?: string; // HH:mm:ss
}

export interface ClassScheduleItem {
  id: string;
  classCode: string;
  subject: string;
  instructor: string;
  room: string;
  schedule: string;
  enrolled: number;
  capacity: number;
  status: 'open' | 'full' | 'upcoming';
}

export interface AdminContentItem {
  id: string;
  type: 'Giáo trình' | 'Quiz' | 'Bài tập';
  title: string;
  owner: string;
  subject: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface AdminDashboardSummary {
  totalUsers: number;
  totalClasses: number;
  totalRevenue: number;
  totalInstructors: number;
}

export interface CreditRegistrationItem {
  id: string;
  studentId: string;
  studentName: string;
  subjectId: string;
  subjectName: string;
  credits: number;
  semesterId: string;
  semesterName: string;
  status: 'pending' | 'approved' | 'rejected';
  registeredAt: string;
}

export interface ContactItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'in-progress' | 'resolved';
  createdAt: string;
  updatedAt?: string;
}

export interface SystemNotificationItem {
  id: string;
  title: string;
  content: string;
  targetAudience: 'all' | 'students' | 'instructors' | 'admins';
  priority: 'low' | 'medium' | 'high';
  status: 'draft' | 'sent' | 'scheduled';
  scheduledAt?: string;
  sentAt?: string;
  createdBy: string;
  createdAt: string;
}


export type AuthRolePermission = {
  maRole: string;
  maPermissions?: string | null;
};
