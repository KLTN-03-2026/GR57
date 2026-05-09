import {
  LayoutDashboard,
  User,
  BookOpen,
  FileText,
  ClipboardList,
  BarChart3,
  UserCheck,
  Bell,
  GraduationCap,
  LogOut
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '@/hooks';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function SidebarItem({ icon, label, active, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
        active
          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <span className="shrink-0">{icon}</span>
      <span className="font-medium truncate">{label}</span>
    </button>
  );
}

export function InstructorSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { id: 'dashboard',     path: '/lecture/dashboard',     icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard' },
    { id: 'profile',       path: '/lecture/profile',       icon: <User className="w-4 h-4" />,            label: 'Hồ sơ/Lịch dạy' },
    { id: 'classes',       path: '/lecture/classes',       icon: <BookOpen className="w-4 h-4" />,        label: 'Lớp học phần' },
    { id: 'documents',     path: '/lecture/documents',     icon: <FileText className="w-4 h-4" />,        label: 'Tài liệu' },
    { id: 'assignments',   path: '/lecture/assignments',   icon: <ClipboardList className="w-4 h-4" />,   label: 'Bài tập & Quiz' },
    { id: 'grades',        path: '/lecture/grades',        icon: <BarChart3 className="w-4 h-4" />,       label: 'Quản lý điểm' },
    { id: 'attendance',    path: '/lecture/attendance',    icon: <UserCheck className="w-4 h-4" />,       label: 'Điểm danh' },
    { id: 'notifications', path: '/lecture/notifications', icon: <Bell className="w-4 h-4" />,            label: 'Thông báo' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-800 shadow-2xl z-50">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2 rounded-xl shadow-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
                LearningHub
              </h1>
              <p className="text-xs text-slate-400" style={{ fontFamily: "'Manrope', sans-serif" }}>Giảng viên</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-3" style={{ fontFamily: "'Manrope', sans-serif" }}>
          <div className="space-y-0.5">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                active={location.pathname.startsWith(item.path)}
                onClick={() => navigate(item.path)}
              />
            ))}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all text-sm font-medium"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800">
          <p className="text-xs text-slate-500 text-center" style={{ fontFamily: "'Manrope', sans-serif" }}>© 2026 LearningHub</p>
        </div>
      </div>
    </aside>
  );
}
