import {
  LayoutDashboard,
  User,
  Calendar,
  FileText,
  ClipboardList,
  Award,
  BookCheck,
  TrendingUp,
  DollarSign,
  Star,
  MessageCircle,
  Bell,
  GraduationCap,
  GitBranch,
  LogOut
} from 'lucide-react';
import { useEffect, useState } from 'react';
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

const ROUTE_TO_MENU: Record<string, string> = {
  '/student/dashboard': 'dashboard',
  '/student/profile': 'profile',
  '/student/schedule': 'schedule',
  '/student/documents': 'documents',
  '/student/assignments': 'assignments',
  '/student/quiz': 'quiz',
  '/student/register': 'register',
  '/student/progress': 'progress',
  '/student/tuition': 'tuition',
  '/student/rating': 'rating',
  '/student/chatbot': 'chatbot',
  '/student/notifications': 'notifications',
  '/student/study-program': 'study-program',
};

export function StudentSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [activeItem, setActiveItem] = useState(
    () => ROUTE_TO_MENU[location.pathname] ?? 'dashboard'
  );

  useEffect(() => {
    const id = ROUTE_TO_MENU[location.pathname];
    if (id) setActiveItem(id);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleMenuClick = (itemId: string) => {
    setActiveItem(itemId);

    if (itemId === 'dashboard') {
      navigate('/student/dashboard');
    } else if (itemId === 'profile') {
      navigate('/student/profile');
    } else if (itemId === 'schedule') {
      navigate('/student/schedule');
    } else if (itemId === 'documents') {
      navigate('/student/documents');
    } else if (itemId === 'assignments') {
      navigate('/student/assignments');
    } else if (itemId === 'quiz') {
      navigate('/student/quiz');
    } else if (itemId === 'register') {
      navigate('/student/register');
    } else if (itemId === 'progress') {
      navigate('/student/progress');
    } else if (itemId === 'tuition') {
      navigate('/student/tuition');
    } else if (itemId === 'rating') {
      navigate('/student/rating');
    } else if (itemId === 'chatbot') {
      navigate('/student/chatbot');
    } else if (itemId === 'notifications') {
      navigate('/student/notifications');
    } else if (itemId === 'study-program') {
      navigate('/student/study-program');
    }
  };

  const menuItems = [
    { id: 'dashboard', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard' },
    { id: 'profile', icon: <User className="w-4 h-4" />, label: 'Hồ sơ cá nhân' },
    { id: 'schedule', icon: <Calendar className="w-4 h-4" />, label: 'Lịch học' },
    { id: 'documents', icon: <FileText className="w-4 h-4" />, label: 'Tài liệu' },
    { id: 'assignments', icon: <ClipboardList className="w-4 h-4" />, label: 'Bài tập' },
    { id: 'quiz', icon: <Award className="w-4 h-4" />, label: 'Quiz' },
    { id: 'register', icon: <BookCheck className="w-4 h-4" />, label: 'Đăng ký tín chỉ' },
    { id: 'progress', icon: <TrendingUp className="w-4 h-4" />, label: 'Tiến độ học tập' },
    { id: 'tuition', icon: <DollarSign className="w-4 h-4" />, label: 'Học phí' },
    { id: 'rating', icon: <Star className="w-4 h-4" />, label: 'Đánh giá giảng viên' },
    { id: 'chatbot', icon: <MessageCircle className="w-4 h-4" />, label: 'Chatbot AI' },
    { id: 'notifications', icon: <Bell className="w-4 h-4" />, label: 'Thông báo' },
    { id: 'study-program', icon: <GitBranch className="w-4 h-4" />, label: 'Chương trình học' },
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
              <p className="text-xs text-slate-400" style={{ fontFamily: "'Manrope', sans-serif" }}>Sinh viên</p>
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
                active={activeItem === item.id}
                onClick={() => handleMenuClick(item.id)}
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
