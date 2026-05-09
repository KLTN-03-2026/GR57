import { envConfig } from '@/constants/environment';
import apiClient from '@/api/axiosClient';
import { simulateNetworkDelay } from '@/utils/mockDataUtils';
import type {
  AdminContentItem,
  AdminDashboardSummary,
  AdminUserAccount,
  ClassScheduleItem,
  DepartmentItem,
  MajorItem,
  SubjectItem,
  CreditRegistrationItem,
  ContactItem,
  SystemNotificationItem,
} from '@/types';
import { getAllTuitionRecords } from '@/data/mockTuition';

const USERS_KEY = 'admin_users_v1';
const DEPARTMENTS_KEY = 'admin_departments_v1';
const MAJORS_KEY = 'admin_majors_v1';
const SUBJECTS_KEY = 'admin_subjects_v1';
const CLASSES_KEY = 'admin_classes_v1';
const CONTENT_KEY = 'admin_content_v1';
const CREDIT_REGISTRATIONS_KEY = 'admin_credit_registrations_v1';
const CONTACTS_KEY = 'admin_contacts_v1';
const NOTIFICATIONS_KEY = 'admin_notifications_v1';

const seedUsers: AdminUserAccount[] = [
  { id: 'USR001', name: 'Nguyễn Văn Lộc', email: 'locloclock41@gmail.com', role: 'admin', status: 'active', createdAt: '01/01/2026', lastLogin: '26/03/2026 14:30' },
  { id: 'USR002', name: 'Trần Thị Mai', email: 'mai.tran@gmail.com', role: 'lecture', status: 'active', createdAt: '05/01/2026', lastLogin: '26/03/2026 10:15' },
  { id: 'USR003', name: 'Lê Hoàng Nam', email: 'nam.le@gmail.com', role: 'student', status: 'active', createdAt: '10/01/2026', lastLogin: '25/03/2026 16:20' },
];

const seedDepartments: DepartmentItem[] = [
  { id: 'DEP001', code: 'CNTT', name: 'Công nghệ Thông tin', headOfDepartment: 'TS. Nguyễn Văn A' },
  { id: 'DEP002', code: 'KTMT', name: 'Kỹ thuật Máy tính', headOfDepartment: 'PGS.TS. Trần Thị B' },
];

const seedMajors: MajorItem[] = [
  { id: 'MAJ001', code: 'CNTT-K01', name: 'Công nghệ Phần mềm', departmentId: 'DEP001', departmentName: 'Công nghệ Thông tin' },
  { id: 'MAJ002', code: 'CNTT-K02', name: 'Trí tuệ Nhân tạo', departmentId: 'DEP001', departmentName: 'Công nghệ Thông tin' },
];

const seedSubjects: SubjectItem[] = [
  { id: 'SUB001', code: 'CS101', name: 'Lập trình Cơ bản', credits: 3, majorId: 'MAJ001', majorName: 'Công nghệ Phần mềm' },
  { id: 'SUB002', code: 'CS102', name: 'Cấu trúc Dữ liệu và Giải thuật', credits: 4, majorId: 'MAJ001', majorName: 'Công nghệ Phần mềm' },
];

const seedClasses: ClassScheduleItem[] = [
  { id: '1', classCode: 'IT301-01', subject: 'Lập trình Web', instructor: 'Trần Thị Mai', room: 'A101', schedule: 'T2, T4 - 08:00', enrolled: 42, capacity: 45, status: 'open' },
  { id: '2', classCode: 'IT205-02', subject: 'Cơ sở dữ liệu', instructor: 'Phạm Văn Đức', room: 'B203', schedule: 'T3, T5 - 14:00', enrolled: 45, capacity: 45, status: 'full' },
];

const seedContent: AdminContentItem[] = [
  { id: '1', type: 'Giáo trình', title: 'Module React nâng cao', owner: 'Trần Thị Mai', subject: 'Lập trình Web', status: 'pending' },
  { id: '2', type: 'Quiz', title: 'Quiz SQL Join', owner: 'Phạm Văn Đức', subject: 'Cơ sở dữ liệu', status: 'approved' },
];

const seedCreditRegistrations: CreditRegistrationItem[] = [
  { id: 'CR001', studentId: 'USR003', studentName: 'Lê Hoàng Nam', subjectId: 'SUB001', subjectName: 'Lập trình Cơ bản', credits: 3, semesterId: 'SEM001', semesterName: 'Học kỳ I 2026', status: 'pending', registeredAt: '25/03/2026' },
  { id: 'CR002', studentId: 'USR003', studentName: 'Lê Hoàng Nam', subjectId: 'SUB002', subjectName: 'Cấu trúc Dữ liệu và Giải thuật', credits: 4, semesterId: 'SEM001', semesterName: 'Học kỳ I 2026', status: 'approved', registeredAt: '24/03/2026' },
];

const seedContacts: ContactItem[] = [
  { id: 'C001', name: 'Nguyễn Văn An', email: 'an.nguyen@gmail.com', phone: '0123456789', subject: 'Hỗ trợ kỹ thuật', message: 'Không thể đăng nhập vào hệ thống', status: 'new', createdAt: '26/03/2026 10:00' },
  { id: 'C002', name: 'Trần Thị Linh', email: 'linh.tran@gmail.com', subject: 'Thông tin học phí', message: 'Cần thông tin về học phí năm 2026', status: 'in-progress', createdAt: '25/03/2026 15:30' },
];

const seedNotifications: SystemNotificationItem[] = [
  { id: 'N001', title: 'Thông báo nghỉ lễ', content: 'Hệ thống sẽ tạm ngừng hoạt động từ 30/04 đến 02/05 để bảo trì.', targetAudience: 'all', priority: 'medium', status: 'sent', sentAt: '20/03/2026', createdBy: 'Admin', createdAt: '19/03/2026' },
  { id: 'N002', title: 'Đăng ký học phần', content: 'Thời gian đăng ký học phần cho học kỳ II sẽ bắt đầu từ 01/04.', targetAudience: 'students', priority: 'high', status: 'draft', createdBy: 'Admin', createdAt: '26/03/2026' },
];

const readOrSeed = <T>(key: string, seed: T[]): T[] => {
  const raw = localStorage.getItem(key);
  if (!raw) {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(raw) as T[];
};

const write = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export interface AdminRepository {
  getUsers(): Promise<AdminUserAccount[]>;
  getDepartments(): Promise<DepartmentItem[]>;
  getMajors(): Promise<MajorItem[]>;
  getSubjects(): Promise<SubjectItem[]>;
  getClasses(): Promise<ClassScheduleItem[]>;
  getContentItems(): Promise<AdminContentItem[]>;
  getDashboardSummary(): Promise<AdminDashboardSummary>;
  updateContentStatus(contentId: string, status: AdminContentItem['status']): Promise<void>;
  getCreditRegistrations(): Promise<CreditRegistrationItem[]>;
  updateCreditRegistrationStatus(registrationId: string, status: CreditRegistrationItem['status']): Promise<void>;
  getContacts(): Promise<ContactItem[]>;
  updateContactStatus(contactId: string, status: ContactItem['status']): Promise<void>;
  getSystemNotifications(): Promise<SystemNotificationItem[]>;
  createSystemNotification(notification: Omit<SystemNotificationItem, 'id' | 'createdAt'>): Promise<SystemNotificationItem>;
  updateSystemNotification(notificationId: string, updates: Partial<SystemNotificationItem>): Promise<void>;
  assignInstructorToClass(instructorId: string, classId: string): Promise<void>;
  getTeachingAssignments(): Promise<any[]>;
  getInstructorWorkloads(): Promise<any[]>;
}

class MockAdminRepository implements AdminRepository {
  async getUsers(): Promise<AdminUserAccount[]> {
    await simulateNetworkDelay();
    return readOrSeed(USERS_KEY, seedUsers);
  }
  async getDepartments(): Promise<DepartmentItem[]> {
    await simulateNetworkDelay();
    return readOrSeed(DEPARTMENTS_KEY, seedDepartments);
  }
  async getMajors(): Promise<MajorItem[]> {
    await simulateNetworkDelay();
    return readOrSeed(MAJORS_KEY, seedMajors);
  }
  async getSubjects(): Promise<SubjectItem[]> {
    await simulateNetworkDelay();
    return readOrSeed(SUBJECTS_KEY, seedSubjects);
  }
  async getClasses(): Promise<ClassScheduleItem[]> {
    await simulateNetworkDelay();
    return readOrSeed(CLASSES_KEY, seedClasses);
  }
  async getContentItems(): Promise<AdminContentItem[]> {
    await simulateNetworkDelay();
    return readOrSeed(CONTENT_KEY, seedContent);
  }
  async getDashboardSummary(): Promise<AdminDashboardSummary> {
    await simulateNetworkDelay();
    const users = readOrSeed(USERS_KEY, seedUsers);
    const classes = readOrSeed(CLASSES_KEY, seedClasses);
    const tuition = getAllTuitionRecords();
    return {
      totalUsers: users.length,
      totalClasses: classes.length,
      totalRevenue: tuition.filter((t) => t.status === 'paid').reduce((sum, t) => sum + t.amount, 0),
      totalInstructors: users.filter((u) => u.role === 'lecture').length,
    };
  }
  async updateContentStatus(contentId: string, status: AdminContentItem['status']): Promise<void> {
    await simulateNetworkDelay();
    const items = readOrSeed(CONTENT_KEY, seedContent);
    write(
      CONTENT_KEY,
      items.map((item) => (item.id === contentId ? { ...item, status } : item)),
    );
  }
  async getCreditRegistrations(): Promise<CreditRegistrationItem[]> {
    await simulateNetworkDelay();
    return readOrSeed(CREDIT_REGISTRATIONS_KEY, seedCreditRegistrations);
  }
  async updateCreditRegistrationStatus(registrationId: string, status: CreditRegistrationItem['status']): Promise<void> {
    await simulateNetworkDelay();
    const items = readOrSeed(CREDIT_REGISTRATIONS_KEY, seedCreditRegistrations);
    write(
      CREDIT_REGISTRATIONS_KEY,
      items.map((item) => (item.id === registrationId ? { ...item, status } : item)),
    );
  }
  async getContacts(): Promise<ContactItem[]> {
    await simulateNetworkDelay();
    return readOrSeed(CONTACTS_KEY, seedContacts);
  }
  async updateContactStatus(contactId: string, status: ContactItem['status']): Promise<void> {
    await simulateNetworkDelay();
    const items = readOrSeed(CONTACTS_KEY, seedContacts);
    write(
      CONTACTS_KEY,
      items.map((item) => (item.id === contactId ? { ...item, status, updatedAt: new Date().toISOString() } : item)),
    );
  }
  async getSystemNotifications(): Promise<SystemNotificationItem[]> {
    await simulateNetworkDelay();
    return readOrSeed(NOTIFICATIONS_KEY, seedNotifications);
  }
  async createSystemNotification(notification: Omit<SystemNotificationItem, 'id' | 'createdAt'>): Promise<SystemNotificationItem> {
    await simulateNetworkDelay();
    const items = readOrSeed(NOTIFICATIONS_KEY, seedNotifications);
    const newNotification: SystemNotificationItem = {
      ...notification,
      id: `N${String(items.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
    };
    items.push(newNotification);
    write(NOTIFICATIONS_KEY, items);
    return newNotification;
  }
  async updateSystemNotification(notificationId: string, updates: Partial<SystemNotificationItem>): Promise<void> {
    await simulateNetworkDelay();
    const items = readOrSeed(NOTIFICATIONS_KEY, seedNotifications);
    write(
      NOTIFICATIONS_KEY,
      items.map((item) => (item.id === notificationId ? { ...item, ...updates } : item)),
    );
  }
  async assignInstructorToClass(_instructorId: string, _classId: string): Promise<void> {
    await simulateNetworkDelay();
    // In mock implementation, this would update the class with the instructor
    // For now, just simulate success
  }
  async getTeachingAssignments(): Promise<any[]> {
    await simulateNetworkDelay();
    // Return mock teaching assignments
    return [];
  }
  async getInstructorWorkloads(): Promise<any[]> {
    await simulateNetworkDelay();
    // Return mock instructor workloads
    return [];
  }
}

class ApiAdminRepository implements AdminRepository {
  async getUsers() { return (await apiClient.get('/admin/users')).data; }
  // Backend controllers use Vietnamese paths: 'khoa' (departments), 'nganh' (majors), 'mon-hoc' (subjects)
  async getDepartments() { return (await apiClient.get('/admin/khoa')).data; }
  async getMajors() { return (await apiClient.get('/admin/nganh')).data; }
  // MonHoc controller exposes '/api/admin/mon-hoc/all' for listing all subjects
  async getSubjects() { return (await apiClient.get('/admin/mon-hoc/all')).data; }
  // Classes endpoint is 'lop-hoc-phan'
  async getClasses() { return (await apiClient.get('/admin/lop-hoc-phan')).data; }
  async getContentItems() { return (await apiClient.get('/admin/content')).data; }
  async getDashboardSummary() { return (await apiClient.get('/admin/dashboard-summary')).data; }
  async updateContentStatus(contentId: string, status: AdminContentItem['status']): Promise<void> {
    await apiClient.post(`/admin/content/${contentId}/status`, { status });
  }
  async getCreditRegistrations() { return (await apiClient.get('/admin/credit-registrations')).data; }
  async updateCreditRegistrationStatus(registrationId: string, status: CreditRegistrationItem['status']): Promise<void> {
    await apiClient.post(`/admin/credit-registrations/${registrationId}/status`, { status });
  }
  async getContacts() { return (await apiClient.get('/admin/contacts')).data; }
  async updateContactStatus(contactId: string, status: ContactItem['status']): Promise<void> {
    await apiClient.post(`/admin/contacts/${contactId}/status`, { status });
  }
  async getSystemNotifications() { return (await apiClient.get('/admin/notifications')).data; }
  async createSystemNotification(notification: Omit<SystemNotificationItem, 'id' | 'createdAt'>) {
    return (await apiClient.post('/admin/notifications', notification)).data;
  }
  async updateSystemNotification(notificationId: string, updates: Partial<SystemNotificationItem>): Promise<void> {
    await apiClient.put(`/admin/notifications/${notificationId}`, updates);
  }
  async assignInstructorToClass(instructorId: string, classId: string): Promise<void> {
    await apiClient.post('/admin/teaching/assign', { instructorId, classId });
  }
  async getTeachingAssignments() { return (await apiClient.get('/admin/teaching/assignments')).data; }
  async getInstructorWorkloads() { return (await apiClient.get('/admin/teaching/workloads')).data; }
}

export const adminRepository: AdminRepository = envConfig.useMockData
  ? new MockAdminRepository()
  : new ApiAdminRepository();

