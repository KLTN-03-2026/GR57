import { AccountantSidebar } from '@/components/layouts/AccountantSidebar';
import { AccountantHeader } from '@/components/layouts/AccountantHeader';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks';
import {
  AlertTriangle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  MessageSquare
} from 'lucide-react';
import AiAssistantButton from '@/imports/AiAssistantButton-4-13343';
import { Toast } from '@/components/notification/Toast';

interface User {
  email: string;
  name?: string;
  role: string;
}

interface Exception {
  id: string;
  type: 'overpayment' | 'underpayment' | 'mismatch' | 'duplicate';
  studentName: string;
  studentCode: string;
  semester: string;
  expected: number;
  actual: number;
  difference: number;
  date: string;
  status: 'pending' | 'resolved';
  note?: string;
}

export default function ExceptionsPage() {
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);
  const [selectedType, setSelectedType] = useState<'all' | 'overpayment' | 'underpayment' | 'mismatch' | 'duplicate'>('all');

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

  const mockExceptions: Exception[] = [
    {
      id: 'EXC-001',
      type: 'overpayment',
      studentName: 'Nguyễn Văn Anh',
      studentCode: 'SV2022001',
      semester: 'HK2 2025-2026',
      expected: 12000000,
      actual: 12500000,
      difference: 500000,
      date: '20/04/2026',
      status: 'pending',
    },
    {
      id: 'EXC-002',
      type: 'underpayment',
      studentName: 'Trần Thị Bình',
      studentCode: 'SV2022015',
      semester: 'HK2 2025-2026',
      expected: 15000000,
      actual: 14800000,
      difference: -200000,
      date: '19/04/2026',
      status: 'pending',
    },
    {
      id: 'EXC-003',
      type: 'mismatch',
      studentName: 'Lê Văn Cường',
      studentCode: 'SV2022030',
      semester: 'HK2 2025-2026',
      expected: 13500000,
      actual: 13500000,
      difference: 0,
      date: '18/04/2026',
      status: 'resolved',
      note: 'Đã xác nhận chuyển khoản đúng sinh viên'
    },
  ];

  const filteredExceptions = selectedType === 'all'
    ? mockExceptions
    : mockExceptions.filter(e => e.type === selectedType);

  const pendingCount = mockExceptions.filter(e => e.status === 'pending').length;

  const handleResolve = (id: string) => {
    setToast({ type: 'success', message: `Đã đánh dấu ${id} đã xử lý` });
  };

  const handleAddNote = (id: string) => {
    setToast({ type: 'success', message: `Thêm ghi chú cho ${id}` });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-stone-50">
      <AccountantSidebar />

      <div className="flex-1 ml-64 flex flex-col">
        <AccountantHeader title="Xử lý ngoại lệ" />

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "'Sora', sans-serif" }}>
                Xử lý ngoại lệ
              </h2>
              <p className="text-slate-600 mt-1">Giao dịch sai, thiếu tiền, dư tiền cần xử lý</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Chờ xử lý</p>
                    <p className="text-2xl font-bold text-amber-600" style={{ fontFamily: "'Sora', sans-serif" }}>
                      {pendingCount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Dư tiền</p>
                    <p className="text-2xl font-bold text-emerald-600" style={{ fontFamily: "'Sora', sans-serif" }}>
                      1
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Thiếu tiền</p>
                    <p className="text-2xl font-bold text-red-600" style={{ fontFamily: "'Sora', sans-serif" }}>
                      1
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Giao dịch sai</p>
                    <p className="text-2xl font-bold text-blue-600" style={{ fontFamily: "'Sora', sans-serif" }}>
                      1
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div className="flex gap-2">
                {['all', 'overpayment', 'underpayment', 'mismatch', 'duplicate'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type as any)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                      selectedType === type
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {type === 'all' ? 'Tất cả' :
                     type === 'overpayment' ? 'Dư tiền' :
                     type === 'underpayment' ? 'Thiếu tiền' :
                     type === 'mismatch' ? 'Giao dịch sai' : 'Trùng lặp'}
                  </button>
                ))}
              </div>
            </div>

            {/* Exceptions List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: "'Sora', sans-serif" }}>
                  Danh sách ngoại lệ ({filteredExceptions.length})
                </h3>
              </div>
              <div className="divide-y divide-slate-200">
                {filteredExceptions.map((exception) => (
                  <div key={exception.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                            exception.type === 'overpayment' ? 'bg-emerald-100 text-emerald-700' :
                            exception.type === 'underpayment' ? 'bg-red-100 text-red-700' :
                            exception.type === 'mismatch' ? 'bg-blue-100 text-blue-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {exception.type === 'overpayment' ? <TrendingUp className="w-3 h-3" /> :
                             exception.type === 'underpayment' ? <TrendingDown className="w-3 h-3" /> :
                             <AlertTriangle className="w-3 h-3" />}
                            {exception.type === 'overpayment' ? 'Dư tiền' :
                             exception.type === 'underpayment' ? 'Thiếu tiền' :
                             exception.type === 'mismatch' ? 'Giao dịch sai' : 'Trùng lặp'}
                          </span>
                          <span className="font-mono text-sm text-slate-700">{exception.id}</span>
                          {exception.status === 'resolved' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs">
                              <CheckCircle className="w-3 h-3" />
                              Đã xử lý
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-slate-600 mb-1">Sinh viên</p>
                            <p className="font-semibold text-slate-900">{exception.studentName}</p>
                            <p className="text-sm text-slate-600">{exception.studentCode}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-600 mb-1">Học kỳ</p>
                            <p className="text-sm text-slate-900">{exception.semester}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-600 mb-1">Số tiền</p>
                            <p className="text-sm text-slate-900">Phải: {exception.expected.toLocaleString('vi-VN')} VNĐ</p>
                            <p className="text-sm text-slate-900">Thực: {exception.actual.toLocaleString('vi-VN')} VNĐ</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-600 mb-1">Chênh lệch</p>
                            <p className={`text-sm font-bold ${exception.difference > 0 ? 'text-emerald-600' : exception.difference < 0 ? 'text-red-600' : 'text-slate-900'}`}>
                              {exception.difference > 0 ? '+' : ''}{exception.difference.toLocaleString('vi-VN')} VNĐ
                            </p>
                          </div>
                        </div>
                        {exception.note && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-sm text-blue-900">
                              <MessageSquare className="w-4 h-4 inline mr-2" />
                              {exception.note}
                            </p>
                          </div>
                        )}
                      </div>
                      {exception.status === 'pending' && (
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => handleAddNote(exception.id)}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                          >
                            <MessageSquare className="w-4 h-4" />
                            Ghi chú
                          </button>
                          <button
                            onClick={() => handleResolve(exception.id)}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Đã xử lý
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
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
