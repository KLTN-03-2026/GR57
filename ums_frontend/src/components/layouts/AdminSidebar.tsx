import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  Clock,
  FileText,
  DollarSign,
  BarChart3,
  GraduationCap,
  Home,
  MapPin,
  LogOut,
  Lock,
  Shield,
  Key,
  MessageCircle,
  Bell,
  UserCheck
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks';

interface SidebarItemProps {
  icon?: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  isSeparator?: boolean;
}

function SidebarItem({ icon, label, active, onClick, isSeparator }: SidebarItemProps) {
  if (isSeparator) {
    return (
      <div className="px-3 py-2 mt-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${active
        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }`}
    >
      <span className="shrink-0">{icon}</span>
      <span className="font-medium truncate">{label}</span>
    </button>
  );
}

interface AdminSidebarProps {
  activeMenu?: string;
}

export function AdminSidebar({ activeMenu = 'dashboard' }: AdminSidebarProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [active, setActive] = useState(activeMenu);

  const menuItems = [
    { id: 'dashboard', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard' },
    { id: 'separator-system', label: '--- QUẢN LÝ PHÂN QUYỀN ---', isSeparator: true },
    { id: 'users', icon: <Users className="w-4 h-4" />, label: 'Người Dùng' },
    { id: 'roles', icon: <Shield className="w-4 h-4" />, label: 'Vai Trò' },
    { id: 'permissions', icon: <Lock className="w-4 h-4" />, label: 'Quyền Hạn' },
    { id: 'permissions-assign', icon: <Key className="w-4 h-4" />, label: 'Phân Quyền' },
    { id: 'separator-school', label: '--- QUẢN LÝ TRƯỜNG HỌC ---', isSeparator: true },
    { id: 'schools', icon: <Home className="w-4 h-4" />, label: 'Trường' },
    { id: 'rooms', icon: <MapPin className="w-4 h-4" />, label: 'Phòng' },
    { id: 'departments', icon: <BookOpen className="w-4 h-4" />, label: 'Khoa / Ngành / Môn' },
    { id: 'hoc-ki', icon: <Calendar className="w-4 h-4" />, label: 'Học kỳ' },
    { id: 'gio-hoc', icon: <Clock className="w-4 h-4" />, label: 'Giờ học' },
    { id: 'classes', icon: <Calendar className="w-4 h-4" />, label: 'Lớp học & lịch' },
    { id: 'teaching', icon: <UserCheck className="w-4 h-4" />, label: 'Quản lý giảng dạy' },
    { id: 'credit-registrations', icon: <FileText className="w-4 h-4" />, label: 'Đăng ký tín chỉ' },
    { id: 'separator-other', label: '--- KHÁC ---', isSeparator: true },
    { id: 'contacts', icon: <MessageCircle className="w-4 h-4" />, label: 'Liên hệ' },
    { id: 'notifications', icon: <Bell className="w-4 h-4" />, label: 'Thông báo hệ thống' },
    { id: 'content', icon: <FileText className="w-4 h-4" />, label: 'Nội dung' },
    { id: 'tuition', icon: <DollarSign className="w-4 h-4" />, label: 'Học phí' },
    { id: 'reports', icon: <BarChart3 className="w-4 h-4" />, label: 'Báo cáo' },
  ];

  const handleMenuClick = (id: string) => {
    setActive(id);
    if (id === 'dashboard') {
      navigate('/admin/dashboard');
    } else if (id === 'users') {
      navigate('/admin/users');
    } else if (id === 'roles') {
      navigate('/admin/roles');
    } else if (id === 'permissions') {
      navigate('/admin/permissions');
    } else if (id === 'permissions-assign') {
      navigate('/admin/permissions-assign');
    } else if (id === 'schools') {
      navigate('/admin/schools');
    } else if (id === 'rooms') {
      navigate('/admin/rooms');
    } else if (id === 'departments') {
      navigate('/admin/departments');
    } else if (id === 'hoc-ki') {
      navigate('/admin/hoc-ki');
    } else if (id === 'gio-hoc') {
      navigate('/admin/gio-hoc');
    } else if (id === 'classes') {
      navigate('/admin/classes');
    } else if (id === 'teaching') {
      navigate('/admin/teaching');
    } else if (id === 'credit-registrations') {
      navigate('/admin/credit-registrations');
    } else if (id === 'contacts') {
      navigate('/admin/contacts');
    } else if (id === 'notifications') {
      navigate('/admin/notifications');
    } else if (id === 'content') {
      navigate('/admin/content');
    } else if (id === 'tuition') {
      navigate('/admin/tuition');
    } else if (id === 'reports') {
      navigate('/admin/reports');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
              <p className="text-xs text-slate-400" style={{ fontFamily: "'Manrope', sans-serif" }}>Admin Panel</p>
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
                active={active === item.id}
                onClick={() => handleMenuClick(item.id)}
                isSeparator={item.isSeparator}
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