import { AdminSidebar } from '@/components/layouts/AdminSidebar';
import { AdminHeader } from '@/components/layouts/AdminHeader';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks';
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp,
  UserPlus,
  GraduationCap,
  CreditCard,
  Activity
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';
import AiAssistantButton from '@/imports/AiAssistantButton-4-13343';
import { adminRepository } from '@/api';
import { useAsync } from '@/hooks';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { data: summary } = useAsync(() => adminRepository.getDashboardSummary(), undefined);

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'admin') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  // Mock data for revenue chart
  const revenueData = useMemo(() => [
    { id: 'rev-t1', month: 'T1', revenue: 45000000, students: 120 },
    { id: 'rev-t2', month: 'T2', revenue: 52000000, students: 145 },
    { id: 'rev-t3', month: 'T3', revenue: 48000000, students: 138 },
    { id: 'rev-t4', month: 'T4', revenue: 61000000, students: 165 },
    { id: 'rev-t5', month: 'T5', revenue: 55000000, students: 152 },
    { id: 'rev-t6', month: 'T6', revenue: 67000000, students: 180 },
    { id: 'rev-t7', month: 'T7', revenue: 72000000, students: 195 },
    { id: 'rev-t8', month: 'T8', revenue: 69000000, students: 188 },
    { id: 'rev-t9', month: 'T9', revenue: 78000000, students: 210 },
    { id: 'rev-t10', month: 'T10', revenue: 82000000, students: 225 },
    { id: 'rev-t11', month: 'T11', revenue: 88000000, students: 242 },
    { id: 'rev-t12', month: 'T12', revenue: 95000000, students: 265 },
  ], []);

  // Mock data for user growth
  const userGrowthData = useMemo(() => [
    { id: 'user-t1', month: 'T1', students: 450, instructors: 25, total: 475 },
    { id: 'user-t2', month: 'T2', students: 520, instructors: 28, total: 548 },
    { id: 'user-t3', month: 'T3', students: 580, instructors: 30, total: 610 },
    { id: 'user-t4', month: 'T4', students: 640, instructors: 32, total: 672 },
    { id: 'user-t5', month: 'T5', students: 710, instructors: 35, total: 745 },
    { id: 'user-t6', month: 'T6', students: 780, instructors: 38, total: 818 },
  ], []);

  // Stats data
  const stats = [
    {
      id: 1,
      title: 'Tổng số User',
      value: summary ? summary.totalUsers.toLocaleString('vi-VN') : '...',
      change: '+12.5%',
      changeType: 'increase',
      icon: <Users className="w-6 h-6" />,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      details: '850 học viên mới trong tháng'
    },
    {
      id: 2,
      title: 'Tổng lớp học',
      value: summary ? summary.totalClasses.toLocaleString('vi-VN') : '...',
      change: '+8.2%',
      changeType: 'increase',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      details: '24 lớp học đang hoạt động'
    },
    {
      id: 3,
      title: 'Tổng doanh thu',
      value: summary ? `${Math.round(summary.totalRevenue / 1000000)}M VNĐ` : '...',
      change: '+15.3%',
      changeType: 'increase',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      details: 'Tháng này: 95M VNĐ'
    },
    {
      id: 4,
      title: 'Giảng viên',
      value: summary ? summary.totalInstructors.toLocaleString('vi-VN') : '...',
      change: '+5.1%',
      changeType: 'increase',
      icon: <GraduationCap className="w-6 h-6" />,
      color: 'orange',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
      details: '8 giảng viên mới'
    },
  ];

  // Quick stats
  const quickStats = [
    { label: 'Học viên mới hôm nay', value: '24', icon: <UserPlus className="w-5 h-5 text-blue-600" /> },
    { label: 'Lớp học đang diễn ra', value: '18', icon: <Activity className="w-5 h-5 text-green-600" /> },
    { label: 'Thanh toán hôm nay', value: '12', icon: <CreditCard className="w-5 h-5 text-purple-600" /> },
  ];

  // Recent activities
  const recentActivities = [
    { id: 1, type: 'user', message: 'Nguyễn Văn A đã đăng ký tài khoản', time: '5 phút trước' },
    { id: 2, type: 'class', message: 'Lớp "Lập trình Web" đã bắt đầu', time: '15 phút trước' },
    { id: 3, type: 'payment', message: 'Thanh toán học phí thành công - 5,000,000 VNĐ', time: '30 phút trước' },
    { id: 4, type: 'user', message: 'GV. Trần Thị B đã cập nhật hồ sơ', time: '1 giờ trước' },
    { id: 5, type: 'class', message: 'Lớp "Cơ sở dữ liệu" đã được tạo', time: '2 giờ trước' },
  ];

  const formatCurrency = (value: number) => {
    return (value / 1000000).toFixed(0) + 'M';
  };

  return (
    <div className="flex h-screen bg-[#f1f5f9]">
      <AdminSidebar activeMenu="dashboard" />
      
      <div className="flex-1 ml-64 flex flex-col">
        <AdminHeader title="Dashboard" />
        
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-[#1e3a5f] via-[#2d4a6b] to-[#0a2540] rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
              <div className="absolute bg-[rgba(255,255,255,0.1)] left-[1010px] rounded-full w-64 h-64 top-[-128px]" />
              <div className="absolute bg-[rgba(255,255,255,0.1)] left-[956px] rounded-full w-40 h-40 top-[178px]" />
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Chào mừng trở lại, Admin! 👋</h2>
                  <p className="text-blue-100">Tổng quan hệ thống Learning Hub</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-100">Hôm nay</p>
                  <p className="text-xl font-bold">Thứ Năm, 26/03/2026</p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div 
                  key={stat.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                      <div className={stat.textColor}>
                        {stat.icon}
                      </div>
                    </div>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      stat.changeType === 'increase' 
                        ? 'text-green-600 bg-green-50' 
                        : 'text-red-600 bg-red-50'
                    }`}>
                      <TrendingUp className="w-3 h-3 inline mr-1" />
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.details}</p>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickStats.map((stat, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center gap-4"
                >
                  <div className="bg-gray-50 p-3 rounded-lg">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Doanh thu theo tháng
                  </h2>
                  <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Năm 2026</option>
                    <option>Năm 2025</option>
                  </select>
                </div>

                <ResponsiveContainer width="100%" height={300} key="revenue-chart-container">
                  <AreaChart data={revenueData} id="admin-revenue-chart" margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorRevenueAdmin" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <YAxis 
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      tickFormatter={formatCurrency}
                    />
                    <Tooltip 
                      formatter={(value: number) => [formatCurrency(value) + ' VNĐ', 'Doanh thu']}
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorRevenueAdmin)" 
                      name="Doanh thu"
                    />
                  </AreaChart>
                </ResponsiveContainer>

                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Tổng doanh thu năm 2026</p>
                      <p className="text-2xl font-bold text-green-600">892M VNĐ</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Trung bình/tháng</p>
                      <p className="text-xl font-bold text-gray-900">74.3M VNĐ</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Growth Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Tăng trưởng User
                  </h2>
                  <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>6 tháng gần đây</option>
                    <option>12 tháng gần đây</option>
                  </select>
                </div>

                <ResponsiveContainer width="100%" height={300} key="user-growth-chart-container">
                  <BarChart data={userGrowthData} id="admin-user-growth-chart" margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="students" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Học viên" />
                    <Bar dataKey="instructors" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="Giảng viên" />
                  </BarChart>
                </ResponsiveContainer>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Tổng học viên</p>
                    <p className="text-xl font-bold text-blue-600">2,680</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Tổng giảng viên</p>
                    <p className="text-xl font-bold text-purple-600">165</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Hoạt động gần đây</h2>
              
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div 
                    key={activity.id}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className={`w-2 h-2 mt-2 rounded-full ${
                      activity.type === 'user' ? 'bg-blue-500' :
                      activity.type === 'class' ? 'bg-green-500' :
                      'bg-purple-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
                Xem tất cả hoạt động
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant Button */}
      <button 
        className="fixed bottom-8 right-8 w-16 h-16 z-50 hover:scale-110 transition-transform cursor-pointer"
        aria-label="AI Assistant"
      >
        <AiAssistantButton />
      </button>
    </div>
  );
}