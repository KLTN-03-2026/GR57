import {
  LayoutDashboard,
  User,
  DollarSign,
  CreditCard,
  BarChart3,
  GraduationCap,
  LogOut,
  TrendingUp,
  FileText,
  GitCompare,
  Receipt,
  BookOpen,
  AlertTriangle,
  History,
  Bell
} from 'lucide-react';
import { useState, useEffect } from 'react';
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

export function AccountantSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [activeItem, setActiveItem] = useState('dashboard');

  // Update active item based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/accountant/dashboard')) {
      setActiveItem('dashboard');
    } else if (path.includes('/accountant/receivables')) {
      setActiveItem('receivables');
    } else if (path.includes('/accountant/tuition')) {
      setActiveItem('tuition');
    } else if (path.includes('/accountant/payment')) {
      setActiveItem('payment');
    } else if (path.includes('/accountant/reconciliation')) {
      setActiveItem('reconciliation');
    } else if (path.startsWith('/accountant/invoices')) {
      setActiveItem('invoices');
    } else if (path === '/accountant/invoice' || path.startsWith('/accountant/invoice/')) {
      setActiveItem('invoices');
    } else if (path.includes('/accountant/cashbook')) {
      setActiveItem('cashbook');
    } else if (path.includes('/accountant/reports')) {
      setActiveItem('reports');
    } else if (path.includes('/accountant/exceptions')) {
      setActiveItem('exceptions');
    } else if (path.includes('/accountant/history')) {
      setActiveItem('history');
    } else if (path.includes('/accountant/notifications')) {
      setActiveItem('notifications');
    } else if (path.includes('/accountant/profile')) {
      setActiveItem('profile');
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleMenuClick = (itemId: string) => {
    setActiveItem(itemId);

    if (itemId === 'dashboard') {
      navigate('/accountant/dashboard');
    } else if (itemId === 'receivables') {
      navigate('/accountant/receivables');
    } else if (itemId === 'tuition') {
      navigate('/accountant/tuition');
    } else if (itemId === 'payment') {
      navigate('/accountant/payment');
    } else if (itemId === 'reconciliation') {
      navigate('/accountant/reconciliation');
    } else if (itemId === 'invoices') {
      navigate('/accountant/invoices');
    } else if (itemId === 'cashbook') {
      navigate('/accountant/cashbook');
    } else if (itemId === 'reports') {
      navigate('/accountant/reports');
    } else if (itemId === 'exceptions') {
      navigate('/accountant/exceptions');
    } else if (itemId === 'history') {
      navigate('/accountant/history');
    } else if (itemId === 'notifications') {
      navigate('/accountant/notifications');
    } else if (itemId === 'profile') {
      navigate('/accountant/profile');
    }
  };

  const menuItems = [
    { id: 'dashboard', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard' },
    { id: 'receivables', icon: <TrendingUp className="w-4 h-4" />, label: 'Công nợ học phí' },
    { id: 'tuition', icon: <FileText className="w-4 h-4" />, label: 'Danh sách học phí' },
    { id: 'payment', icon: <CreditCard className="w-4 h-4" />, label: 'Xử lý thanh toán' },
    { id: 'reconciliation', icon: <GitCompare className="w-4 h-4" />, label: 'Đối soát thanh toán' },
    { id: 'invoices', icon: <Receipt className="w-4 h-4" />, label: 'Hóa đơn & biên lai' },
    { id: 'cashbook', icon: <BookOpen className="w-4 h-4" />, label: 'Sổ thu tiền' },
    { id: 'reports', icon: <BarChart3 className="w-4 h-4" />, label: 'Báo cáo' },
    { id: 'exceptions', icon: <AlertTriangle className="w-4 h-4" />, label: 'Xử lý ngoại lệ' },
    { id: 'history', icon: <History className="w-4 h-4" />, label: 'Lịch sử hoạt động' },
    { id: 'notifications', icon: <Bell className="w-4 h-4" />, label: 'Thông báo / Nhắc nợ' },
    { id: 'profile', icon: <User className="w-4 h-4" />, label: 'Hồ sơ cá nhân' },
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
              <p className="text-xs text-slate-400" style={{ fontFamily: "'Manrope', sans-serif" }}>Kế toán viên</p>
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
