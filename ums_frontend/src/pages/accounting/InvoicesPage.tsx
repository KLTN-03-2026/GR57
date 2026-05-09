import { AccountantSidebar } from '@/components/layouts/AccountantSidebar';
import { AccountantHeader } from '@/components/layouts/AccountantHeader';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks';
import {
  FileText,
  Download,
  Mail,
  Printer,
  Eye,
  Search
} from 'lucide-react';
import { mockTuitionRecords } from '@/data/mockTuition';
import AiAssistantButton from '@/imports/AiAssistantButton-4-13343';
import { Toast } from '@/components/notification/Toast';

interface User {
  email: string;
  name?: string;
  role: string;
}

export default function InvoicesPage() {
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const paidInvoices = mockTuitionRecords.filter(r => r.status === 'paid');

  const handleSendEmail = (id: string, email: string) => {
    setToast({ type: 'success', message: `Đã gửi hóa đơn ${id} đến ${email}` });
  };

  const handlePrintPDF = (id: string) => {
    setToast({ type: 'success', message: `Đang xuất PDF hóa đơn ${id}...` });
  };

  const filteredInvoices = paidInvoices.filter(inv =>
    inv.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.studentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-stone-50">
      <AccountantSidebar />

      <div className="flex-1 ml-64 flex flex-col">
        <AccountantHeader title="Hóa đơn & biên lai" />

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "'Sora', sans-serif" }}>
                Hóa đơn & biên lai
              </h2>
              <p className="text-slate-600 mt-1">Quản lý, xuất PDF và gửi email hóa đơn đã thanh toán</p>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, mã sinh viên, hoặc mã hóa đơn..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: "'Sora', sans-serif" }}>
                  Danh sách hóa đơn ({filteredInvoices.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Mã hóa đơn
                      </th>
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
                        Ngày thanh toán
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredInvoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-emerald-600" />
                            <span className="font-mono text-sm text-slate-900">{invoice.id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="font-semibold text-slate-900">{invoice.studentName}</p>
                            <p className="text-sm text-slate-500">{invoice.studentCode}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                          {invoice.semester}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-semibold text-slate-900">
                            {invoice.amount.toLocaleString('vi-VN')} VNĐ
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                          {invoice.paidDate || invoice.createdDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => navigate('/accountant/invoice', { state: { invoiceId: invoice.id } })}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handlePrintPDF(invoice.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                              title="Xuất PDF"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleSendEmail(invoice.id, invoice.email)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors text-sm"
                              title="Gửi email"
                            >
                              <Mail className="w-4 h-4" />
                            </button>
                          </div>
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
