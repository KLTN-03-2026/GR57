import { createBrowserRouter } from 'react-router';
import type { ComponentType } from 'react';
import { ProtectedRoute } from './ProtectedRoute';

import Login from '@/pages/auth/Login';

import StudentDashboard from '@/pages/student/StudentDashboard';
import ProfilePage from '@/pages/student/ProfilePage';
import SchedulePage from '@/pages/student/SchedulePage';
import DocumentsPage from '@/pages/student/DocumentsPage';
import AssignmentsOnlyPage from '@/pages/student/AssignmentsOnlyPage';
import QuizPage from '@/pages/student/QuizPage';
import CourseRegistrationPage from '@/pages/student/CourseRegistrationPage';
import AcademicProgressPage from '@/pages/student/AcademicProgressPage';
import TuitionPage from '@/pages/student/TuitionPage';
import InstructorRatingPage from '@/pages/student/InstructorRatingPage';
import { ChatbotPage } from '@/pages/student/ChatbotPage';
import { NotificationsPage as StudentNotificationsPage } from '@/pages/student/StudentNotificationsPage';
import StudyProgramPage from '@/pages/student/StudyProgramPage';

import LectureDashboard from '@/pages/lecturer/InstructorDashboard';
import ClassManagement from '@/pages/lecturer/ClassManagement';
import ClassDetail from '@/pages/lecturer/ClassDetail';
import DocumentManagement from '@/pages/lecturer/DocumentManagement';
import AssignmentManagement from '@/pages/lecturer/AssignmentManagement';
import SubmissionsView from '@/pages/lecturer/SubmissionsView';
import GradeManagement from '@/pages/lecturer/GradeManagement';
import AttendanceManagement from '@/pages/lecturer/AttendanceManagement';
import NotificationManagement from '@/pages/lecturer/NotificationManagement';
import InstructorProfile from '@/pages/lecturer/InstructorProfile';

import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminDepartmentsPage from '@/pages/admin/AdminDepartmentsPage';
import AdminSchoolsPage from '@/pages/admin/AdminSchoolsPage';
import AdminRoomsPage from '@/pages/admin/AdminRoomsPage';
import AdminSemestersPage from '@/pages/admin/AdminSemestersPage';
import AdminPeriodsPage from '@/pages/admin/AdminPeriodsPage';
import AdminClassesPage from '@/pages/admin/AdminClassesPage';
import AdminContentPage from '@/pages/admin/AdminContentPage';
import AdminTuitionCoordinationPage from '@/pages/admin/AdminTuitionCoordinationPage';
import AdminReportsPage from '@/pages/admin/AdminReportsPage';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import AdminRolesPage from '@/pages/admin/AdminRolesPage';
import AdminPermissionsPage from '@/pages/admin/AdminPermissionsPage';
import AdminCreditRegistrationsPage from '@/pages/admin/AdminCreditRegistrationsPage';
import AdminContactsPage from '@/pages/admin/AdminContactsPage';
import AdminNotificationsPage from '@/pages/admin/AdminNotificationsPage';
import AdminTeachingManagementPage from '@/pages/admin/AdminTeachingManagementPage';
import AdminPermissionsAssignPage from '@/pages/admin/AdminPermissionsAssignPage';

import AccountantDashboard from '@/pages/accounting/AccountantDashboard';
import TuitionReceivablesPage from '@/pages/accounting/TuitionReceivablesPage';
import TuitionListPage from '@/pages/accounting/TuitionListPage';
import InvoiceDetailPage from '@/pages/accounting/InvoiceDetailPage';
import PaymentProcessingPage from '@/pages/accounting/PaymentProcessingPage';
import ReconciliationPage from '@/pages/accounting/ReconciliationPage';
import InvoicesPage from '@/pages/accounting/InvoicesPage';
import CashbookPage from '@/pages/accounting/CashbookPage';
import FinancialReportsPage from '@/pages/accounting/FinancialReportsPage';
import ExceptionsPage from '@/pages/accounting/ExceptionsPage';
import ActivityHistoryPage from '@/pages/accounting/ActivityHistoryPage';
import NotificationsPage from '@/pages/accounting/NotificationsPage';
import AccountantProfilePage from '@/pages/accounting/AccountantProfilePage';

const withRole = (Component: ComponentType, role: string) => () => (
  <ProtectedRoute requiredRole={role}>
    <Component />
  </ProtectedRoute>
);

export const router = createBrowserRouter([
  { path: '/', Component: Login },

  { path: '/student/dashboard', Component: withRole(StudentDashboard, 'student') },
  { path: '/student/profile', Component: withRole(ProfilePage, 'student') },
  { path: '/student/schedule', Component: withRole(SchedulePage, 'student') },
  { path: '/student/documents', Component: withRole(DocumentsPage, 'student') },
  { path: '/student/assignments', Component: withRole(AssignmentsOnlyPage, 'student') },
  { path: '/student/quiz', Component: withRole(QuizPage, 'student') },
  { path: '/student/register', Component: withRole(CourseRegistrationPage, 'student') },
  { path: '/student/progress', Component: withRole(AcademicProgressPage, 'student') },
  { path: '/student/tuition', Component: withRole(TuitionPage, 'student') },
  { path: '/student/rating', Component: withRole(InstructorRatingPage, 'student') },
  { path: '/student/chatbot', Component: withRole(ChatbotPage, 'student') },
  { path: '/student/notifications', Component: withRole(StudentNotificationsPage, 'student') },
  { path: '/student/study-program', Component: withRole(StudyProgramPage, 'student') },

  { path: '/lecture/dashboard', Component: withRole(LectureDashboard, 'lecture') },
  { path: '/lecture/classes', Component: withRole(ClassManagement, 'lecture') },
  { path: '/lecture/classes/:classId', Component: withRole(ClassDetail, 'lecture') },
  { path: '/lecture/documents', Component: withRole(DocumentManagement, 'lecture') },
  { path: '/lecture/assignments', Component: withRole(AssignmentManagement, 'lecture') },
  { path: '/lecture/assignments/:assignmentId/submissions', Component: withRole(SubmissionsView, 'lecture') },
  { path: '/lecture/grades', Component: withRole(GradeManagement, 'lecture') },
  { path: '/lecture/attendance', Component: withRole(AttendanceManagement, 'lecture') },
  { path: '/lecture/notifications', Component: withRole(NotificationManagement, 'lecture') },
  { path: '/lecture/profile', Component: withRole(InstructorProfile, 'lecture') },

  { path: '/admin/dashboard', Component: withRole(AdminDashboard, 'admin') },
  { path: '/admin/schools', Component: withRole(AdminSchoolsPage, 'admin') },
  { path: '/admin/rooms', Component: withRole(AdminRoomsPage, 'admin') },
  { path: '/admin/hoc-ki', Component: withRole(AdminSemestersPage, 'admin') },
  { path: '/admin/gio-hoc', Component: withRole(AdminPeriodsPage, 'admin') },
  { path: '/admin/departments', Component: withRole(AdminDepartmentsPage, 'admin') },
  { path: '/admin/classes', Component: withRole(AdminClassesPage, 'admin') },
  { path: '/admin/content', Component: withRole(AdminContentPage, 'admin') },
  { path: '/admin/tuition', Component: withRole(AdminTuitionCoordinationPage, 'admin') },
  { path: '/admin/reports', Component: withRole(AdminReportsPage, 'admin') },
  { path: '/admin/users', Component: withRole(AdminUsersPage, 'admin') },
  { path: '/admin/roles', Component: withRole(AdminRolesPage, 'admin') },
  { path: '/admin/permissions', Component: withRole(AdminPermissionsPage, 'admin') },
  { path: '/admin/permissions-assign', Component: withRole(AdminPermissionsAssignPage, 'admin') },
  { path: '/admin/credit-registrations', Component: withRole(AdminCreditRegistrationsPage, 'admin') },
  { path: '/admin/contacts', Component: withRole(AdminContactsPage, 'admin') },
  { path: '/admin/notifications', Component: withRole(AdminNotificationsPage, 'admin') },
  { path: '/admin/notifications', Component: withRole(AdminNotificationsPage, 'admin') },
  { path: '/admin/teaching', Component: withRole(AdminTeachingManagementPage, 'admin') },

  { path: '/accountant/dashboard', Component: withRole(AccountantDashboard, 'accountant') },
  { path: '/accountant/receivables', Component: withRole(TuitionReceivablesPage, 'accountant') },
  { path: '/accountant/tuition', Component: withRole(TuitionListPage, 'accountant') },
  { path: '/accountant/invoice', Component: withRole(InvoiceDetailPage, 'accountant') },
  { path: '/accountant/payment', Component: withRole(PaymentProcessingPage, 'accountant') },
  { path: '/accountant/reconciliation', Component: withRole(ReconciliationPage, 'accountant') },
  { path: '/accountant/invoices', Component: withRole(InvoicesPage, 'accountant') },
  { path: '/accountant/cashbook', Component: withRole(CashbookPage, 'accountant') },
  { path: '/accountant/reports', Component: withRole(FinancialReportsPage, 'accountant') },
  { path: '/accountant/exceptions', Component: withRole(ExceptionsPage, 'accountant') },
  { path: '/accountant/history', Component: withRole(ActivityHistoryPage, 'accountant') },
  { path: '/accountant/notifications', Component: withRole(NotificationsPage, 'accountant') },
  { path: '/accountant/profile', Component: withRole(AccountantProfilePage, 'accountant') },
]);