import { AccountantSidebar } from '@/components/layouts/AccountantSidebar';
import { AccountantHeader } from '@/components/layouts/AccountantHeader';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertCircle,
  Calendar,
  Users
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { mockTuitionRecords, getTuitionStats } from '@/data/mockTuition';
import AiAssistantButton from '@/imports/AiAssistantButton-4-13343';
import { Toast } from '@/components/notification/Toast';

interface User {
  email: string;
  name?: string;
  role: string;
}

export default function TuitionReceivablesPage() {
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !authUser) {
      navigate('/');
      return;
    }
    if (authUser.role !== 'accountant') {
      navigate('/');
      return;
    }
    setUser({
      email: authUser.username,
      name: authUser.fullName,
      role: authUser.role,
    });
  }, [isAuthenticated, authUser, navigate]);

  const stats = getTuitionStats();

  const totalReceivable = mockTuitionRecords.reduce((sum, record) => sum + record.amount, 0);
  const totalCollected = mockTuitionRecords
    .filter(r => r.status === 'paid')
    .reduce((sum, record) => sum + record.amount, 0);
  const totalOutstanding = mockTuitionRecords
    .filter(r => r.status === 'pending' || r.status === 'failed')
    .reduce((sum, record) => sum + record.amount, 0);

  const overdueCount = mockTuitionRecords.filter(r =>
    r.status === 'pending' && new Date(r.dueDate.split('/').reverse().join('-')) < new Date()
  ).length;

  const monthlyData = useMemo(() => [
    { id: 'rec-t1', month: 'T1', receivable: 450000000, collected: 380000000, outstanding: 70000000 },
    { id: 'rec-t2', month: 'T2', receivable: 520000000, collected: 450000000, outstanding: 70000000 },
    { id: 'rec-t3', month: 'T3', receivable: 480000000, collected: 420000000, outstanding: 60000000 },
    { id: 'rec-t4', month: 'T4', receivable: 610000000, collected: 540000000, outstanding: 70000000 },
  ], []);

  const formatCurrency = (value: number) => {
    return (value / 1000000).toFixed(0) + 'M';
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-stone-50">
      <AccountantSidebar />

      <div className="flex-1 ml-64 flex flex-col">
        <AccountantHeader title="Công nợ học phí" />

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "'Sora', sans-serif" }}>
                Công nợ học phí
              </h2>
              <p className="text-slate-600 mt-1">Tổng quan phải thu và đã thu từ sinh viên</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Tổng phải thu</p>
                    <p className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Sora', sans-serif" }}>
                      {formatCurrency(totalReceivable)} VNĐ
                    </p>
                    <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      100%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Đã thu</p>
                    <p className="text-2xl font-bold text-emerald-600" style={{ fontFamily: "'Sora', sans-serif" }}>
                      {formatCurrency(totalCollected)} VNĐ
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                      {((totalCollected / totalReceivable) * 100).toFixed(1)}% tổng phải thu
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Còn nợ</p>
                    <p className="text-2xl font-bold text-amber-600" style={{ fontFamily: "'Sora', sans-serif" }}>
                      {formatCurrency(totalOutstanding)} VNĐ
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                      {((totalOutstanding / totalReceivable) * 100).toFixed(1)}% tổng phải thu
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Quá hạn</p>
                    <p className="text-2xl font-bold text-red-600" style={{ fontFamily: "'Sora', sans-serif" }}>
                      {overdueCount}
                    </p>
                    <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Cần nhắc nhở
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Receivables Trend */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4" style={{ fontFamily: "'Sora', sans-serif" }}>
                  Xu hướng thu - nợ
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorOutstanding" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" tickFormatter={formatCurrency} />
                    <Tooltip formatter={(value: number) => formatCurrency(value) + ' VNĐ'} />
                    <Legend />
                    <Area type="monotone" dataKey="collected" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCollected)" name="Đã thu" />
                    <Area type="monotone" dataKey="outstanding" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorOutstanding)" name="Còn nợ" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Monthly Comparison */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4" style={{ fontFamily: "'Sora', sans-serif" }}>
                  So sánh theo tháng
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" tickFormatter={formatCurrency} />
                    <Tooltip formatter={(value: number) => formatCurrency(value) + ' VNĐ'} />
                    <Legend />
                    <Bar dataKey="receivable" fill="#3b82f6" name="Phải thu" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="collected" fill="#10b981" name="Đã thu" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Breakdown by Semester */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: "'Sora', sans-serif" }}>
                  Phân tích theo học kỳ
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">HK2 2025-2026</p>
                        <p className="text-xs text-slate-500">Học kỳ hiện tại</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Phải thu:</span>
                        <span className="font-semibold text-slate-900">1,280M VNĐ</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Đã thu:</span>
                        <span className="font-semibold text-emerald-600">960M VNĐ</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Còn nợ:</span>
                        <span className="font-semibold text-amber-600">320M VNĐ</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 mt-3">
                        <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                      <p className="text-xs text-slate-500 text-center">75% đã thu</p>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">HK1 2025-2026</p>
                        <p className="text-xs text-slate-500">Học kỳ trước</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Phải thu:</span>
                        <span className="font-semibold text-slate-900">1,150M VNĐ</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Đã thu:</span>
                        <span className="font-semibold text-emerald-600">1,050M VNĐ</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Còn nợ:</span>
                        <span className="font-semibold text-amber-600">100M VNĐ</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 mt-3">
                        <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '91%' }}></div>
                      </div>
                      <p className="text-xs text-slate-500 text-center">91% đã thu</p>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Tất cả học kỳ</p>
                        <p className="text-xs text-slate-500">Tổng hợp</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Tổng SV:</span>
                        <span className="font-semibold text-slate-900">{mockTuitionRecords.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Đã đóng:</span>
                        <span className="font-semibold text-emerald-600">{stats.paid}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Chưa đóng:</span>
                        <span className="font-semibold text-amber-600">{stats.pending + stats.failed}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 mt-3">
                        <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${(stats.paid / mockTuitionRecords.length) * 100}%` }}></div>
                      </div>
                      <p className="text-xs text-slate-500 text-center">
                        {((stats.paid / mockTuitionRecords.length) * 100).toFixed(0)}% đã đóng
                      </p>
                    </div>
                  </div>
                </div>
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
