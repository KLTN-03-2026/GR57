import { AccountantSidebar } from '@/components/layouts/AccountantSidebar';
import { AccountantHeader } from '@/components/layouts/AccountantHeader';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks';
import {
  DollarSign,
  Clock,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  XCircle,
  ArrowUpRight
} from 'lucide-react';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';
import AiAssistantButton from '@/imports/AiAssistantButton-4-13343';
import { tuitionRepository } from '@/api';
import { getAllTuitionRecords, getTuitionStats } from '@/data/mockTuition';
import { useAsync } from '@/hooks';
import { Toast } from '@/components/notification/Toast';

interface User {
  email: string;
  name?: string;
  role: string;
}

export default function AccountantDashboard() {
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);

  // Fetch tuition data with fallback
  const { data: tuitions } = useAsync(
    () => tuitionRepository.getAllTuitions(),
    getAllTuitionRecords()
  );

  useEffect(() => {
    if (!isAuthenticated || !authUser) {
      navigate('/');
      return;
    }

    if (authUser.role !== 'accountant') {
      navigate('/');
      return;
    }

    setUser(authUser as User);
  }, [isAuthenticated, authUser, navigate]);

  const statsData = useMemo(() => {
    if (!tuitions) return getTuitionStats();
    
    const paid = tuitions.filter(t => t.status === 'paid').length;
    const pending = tuitions.filter(t => t.status === 'pending').length;
    const failed = tuitions.filter(t => t.status === 'failed').length;
    const totalRevenue = tuitions
      .filter(t => t.status === 'paid')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      paid,
      pending,
      failed,
      total: tuitions.length,
      totalRevenue,
    };
  }, [tuitions]);

  const revenueData = useMemo(() => [
    { id: 'rev-t1', month: 'T1', revenue: 450000000 },
    { id: 'rev-t2', month: 'T2', revenue: 520000000 },
    { id: 'rev-t3', month: 'T3', revenue: 480000000 },
    { id: 'rev-t4', month: 'T4', revenue: 610000000 },
    { id: 'rev-t5', month: 'T5', revenue: 550000000 },
    { id: 'rev-t6', month: 'T6', revenue: 670000000 },
  ], []);

  const paymentStatusData = useMemo(() => [
    { id: 'status-paid', name: 'Đã thanh toán', value: statsData.paid, color: '#10b981' },
    { id: 'status-pending', name: 'Chờ thanh toán', value: statsData.pending, color: '#f59e0b' },
    { id: 'status-failed', name: 'Giao dịch lỗi', value: statsData.failed, color: '#ef4444' },
  ], [statsData]);

  const stats = [
    {
      id: 1,
      title: 'Tổng doanh thu',
      value: `${(statsData.totalRevenue / 1000000).toFixed(1)}M VNĐ`,
      change: '+15.3%',
      changeType: 'increase' as const,
      icon: <DollarSign className="w-6 h-6" />,
      bgColor: 'bg-emerald-100',
      textColor: 'text-emerald-600',
      details: 'Từ đầu học kỳ 2'
    },
    {
      id: 2,
      title: 'Đã thanh toán',
      value: statsData.paid.toString(),
      change: '+8.2%',
      changeType: 'increase' as const,
      icon: <CheckCircle className="w-6 h-6" />,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      details: 'Sinh viên đã hoàn tất'
    },
    {
      id: 3,
      title: 'Chờ thanh toán',
      value: statsData.pending.toString(),
      change: '-5.1%',
      changeType: 'decrease' as const,
      icon: <Clock className="w-6 h-6" />,
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-600',
      details: 'Cần xử lý'
    },
    {
      id: 4,
      title: 'Giao dịch lỗi',
      value: statsData.failed.toString(),
      change: '+2.3%',
      changeType: 'increase' as const,
      icon: <AlertTriangle className="w-6 h-6" />,
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
      details: 'Cần kiểm tra'
    },
  ];

  const recentTransactions = useMemo(() => {
    const source = tuitions || getAllTuitionRecords();
    return source.slice(0, 5);
  }, [tuitions]);

  const formatCurrency = (value: number) => {
    return (value / 1000000).toFixed(0) + 'M';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Đã thanh toán
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
            <Clock className="w-3 h-3" />
            Chờ xác nhận
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
            <XCircle className="w-3 h-3" />
            Thất bại
          </span>
        );
      default:
        return null;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-stone-50">
      <AccountantSidebar />

      <div className="flex-1 ml-64 flex flex-col">
        <AccountantHeader title="Dashboard" />

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
              <div className="absolute bg-emerald-600/20 right-[-50px] rounded-full w-64 h-64 top-[-128px] blur-3xl" />
              <div className="absolute bg-emerald-500/10 right-[100px] rounded-full w-40 h-40 top-[150px] blur-2xl" />
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>
                    Chào mừng, {user.name || 'Kế toán'}! 👋
                  </h2>
                  <p className="text-slate-300">Tổng quan quản lý học phí và thanh toán</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Hôm nay</p>
                  <p className="text-xl font-semibold">Thứ 4, 23/04/2026</p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div
                  key={stat.id}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg hover:border-emerald-300 transition-all group cursor-pointer"
                  onClick={() => {
                    if (stat.id === 1) navigate('/accountant/receivables');
                    else if (stat.id === 2) navigate('/accountant/tuition');
                    else if (stat.id === 3) navigate('/accountant/payment');
                    else if (stat.id === 4) navigate('/accountant/exceptions');
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <div className={stat.textColor}>
                        {stat.icon}
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-semibold ${
                      stat.changeType === 'increase' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className={`w-4 h-4 ${stat.changeType === 'decrease' ? 'rotate-180' : ''}`} />
                      {stat.change}
                    </div>
                  </div>
                  <h3 className="text-slate-600 text-sm font-medium mb-1">{stat.title}</h3>
                  <p className="text-2xl font-bold text-slate-900 mb-1" style={{ fontFamily: "'Sora', sans-serif" }}>
                    {stat.value}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500">{stat.details}</p>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Revenue Chart */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4" style={{ fontFamily: "'Sora', sans-serif" }}>
                  Doanh thu 6 tháng gần nhất
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" tickFormatter={formatCurrency} />
                    <Tooltip formatter={(value: number) => formatCurrency(value) + ' VNĐ'} />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Payment Status Pie Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4" style={{ fontFamily: "'Sora', sans-serif" }}>
                  Tỷ lệ trạng thái
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {paymentStatusData.map((entry) => (
                        <Cell key={entry.id} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {paymentStatusData.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-slate-600">{item.name}</span>
                      </div>
                      <span className="font-semibold text-slate-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: "'Sora', sans-serif" }}>
                  Giao dịch gần đây
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Sinh viên
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Học kỳ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Số tiền
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Ngày
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {recentTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate('/accountant/invoice', { state: { invoiceId: transaction.id } })}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="font-semibold text-slate-900">{transaction.studentName}</p>
                            <p className="text-sm text-slate-500">{transaction.studentCode}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-slate-700">{transaction.semester}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-semibold text-slate-900">
                            {transaction.amount.toLocaleString('vi-VN')} VNĐ
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(transaction.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {transaction.createdDate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* AI Assistant Button */}
      <button
        onClick={() => setToast({ type: 'warning', message: 'Tính năng Trợ lý AI đang được phát triển!' })}
        className="fixed bottom-8 right-8 w-16 h-16 hover:scale-110 transition-transform duration-200 z-50"
        aria-label="AI Assistant"
      >
        <AiAssistantButton />
      </button>
    </div>
  );
}
