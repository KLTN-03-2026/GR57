import { AccountantSidebar } from '@/components/layouts/AccountantSidebar';
import { AccountantHeader } from '@/components/layouts/AccountantHeader';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks';
import {
  BookOpen,
  ArrowDownCircle,
  ArrowUpCircle,
  Calendar,
  Filter
} from 'lucide-react';
import { mockTuitionRecords } from '@/data/mockTuition';
import AiAssistantButton from '@/imports/AiAssistantButton-4-13343';
import { Toast } from '@/components/notification/Toast';

interface User {
  email: string;
  name?: string;
  role: string;
}

export default function CashbookPage() {
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);
  const [selectedDate, setSelectedDate] = useState('2026-04');

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

  // Generate cashbook entries from paid tuitions
  const cashbookEntries = mockTuitionRecords
    .filter(r => r.status === 'paid')
    .map(r => ({
      id: r.id,
      date: r.paidDate || r.createdDate,
      description: `Thu học phí ${r.semester} - ${r.studentName} (${r.studentCode})`,
      debit: r.amount,
      credit: 0,
      balance: 0,
      type: 'receipt' as const,
      method: r.paymentMethod || 'transfer',
      transactionRef: r.transactionRef || '',
    }))
    .sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-'));
      const dateB = new Date(b.date.split('/').reverse().join('-'));
      return dateB.getTime() - dateA.getTime();
    });

  // Calculate running balance
  let runningBalance = 0;
  cashbookEntries.forEach(entry => {
    runningBalance += entry.debit - entry.credit;
    entry.balance = runningBalance;
  });

  const totalReceipts = cashbookEntries.reduce((sum, e) => sum + e.debit, 0);

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-stone-50">
      <AccountantSidebar />

      <div className="flex-1 ml-64 flex flex-col">
        <AccountantHeader title="Sổ thu tiền" />

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "'Sora', sans-serif" }}>
                Sổ thu tiền
              </h2>
              <p className="text-slate-600 mt-1">Ghi nhận tất cả giao dịch thu theo thời gian</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <ArrowDownCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Tổng thu</p>
                    <p className="text-2xl font-bold text-emerald-600" style={{ fontFamily: "'Sora', sans-serif" }}>
                      {(totalReceipts / 1000000).toFixed(0)}M VNĐ
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Số giao dịch</p>
                    <p className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Sora', sans-serif" }}>
                      {cashbookEntries.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Số dư cuối kỳ</p>
                    <p className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Sora', sans-serif" }}>
                      {runningBalance > 0 ? (runningBalance / 1000000).toFixed(0) : 0}M VNĐ
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div className="flex items-center gap-4">
                <Filter className="w-5 h-5 text-slate-400" />
                <input
                  type="month"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Cashbook Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: "'Sora', sans-serif" }}>
                  Sổ chi tiết
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Ngày
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Diễn giải
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Phương thức
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Thu (VNĐ)
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Số dư (VNĐ)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {cashbookEntries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                          {entry.date}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-900">{entry.description}</p>
                          {entry.transactionRef && (
                            <p className="text-xs text-slate-500 font-mono mt-1">Ref: {entry.transactionRef}</p>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            {entry.method === 'transfer' ? 'Chuyển khoản' : entry.method === 'cash' ? 'Tiền mặt' : entry.method === 'card' ? 'Thẻ' : 'Ví điện tử'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className="font-semibold text-emerald-600">
                            +{entry.debit.toLocaleString('vi-VN')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className="font-semibold text-slate-900">
                            {entry.balance.toLocaleString('vi-VN')}
                          </span>
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
