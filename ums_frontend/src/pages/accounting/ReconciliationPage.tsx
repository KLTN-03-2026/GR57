import { AccountantSidebar } from '@/components/layouts/AccountantSidebar';
import { AccountantHeader } from '@/components/layouts/AccountantHeader';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks';
import {
  Upload,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Download
} from 'lucide-react';
import AiAssistantButton from '@/imports/AiAssistantButton-4-13343';
import { Toast } from '@/components/notification/Toast';

interface User {
  email: string;
  name?: string;
  role: string;
}

export default function ReconciliationPage() {
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

  const mockReconciliations = [
    {
      id: 'REC-001',
      date: '22/04/2026',
      bankStatement: 'VCB_Statement_Apr2026.xlsx',
      totalTransactions: 45,
      matched: 42,
      unmatched: 3,
      status: 'completed'
    },
    {
      id: 'REC-002',
      date: '15/04/2026',
      bankStatement: 'VCB_Statement_Apr2026_Mid.xlsx',
      totalTransactions: 38,
      matched: 38,
      unmatched: 0,
      status: 'completed'
    },
  ];

  const handleImport = () => {
    setToast({ type: 'success', message: 'Import sao kê ngân hàng thành công!' });
  };

  const handleExportMismatch = () => {
    setToast({ type: 'success', message: 'Xuất danh sách giao dịch lệch thành công!' });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-stone-50">
      <AccountantSidebar />

      <div className="flex-1 ml-64 flex flex-col">
        <AccountantHeader title="Đối soát thanh toán" />

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "'Sora', sans-serif" }}>
                  Đối soát thanh toán
                </h2>
                <p className="text-slate-600 mt-1">Import sao kê ngân hàng và tự động đối soát giao dịch</p>
              </div>
              <button
                onClick={handleImport}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-lg shadow-emerald-600/30"
              >
                <Upload className="w-5 h-5" />
                Import sao kê
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Đã khớp</p>
                    <p className="text-2xl font-bold text-emerald-600" style={{ fontFamily: "'Sora', sans-serif" }}>80</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Chưa khớp</p>
                    <p className="text-2xl font-bold text-amber-600" style={{ fontFamily: "'Sora', sans-serif" }}>3</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Tổng giao dịch</p>
                    <p className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Sora', sans-serif" }}>83</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reconciliation History */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: "'Sora', sans-serif" }}>
                  Lịch sử đối soát
                </h3>
                <button
                  onClick={handleExportMismatch}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  Xuất lệch
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Mã đối soát
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Ngày
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        File sao kê
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Tổng GD
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Đã khớp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Chưa khớp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {mockReconciliations.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-mono text-sm text-slate-900">{rec.id}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                          {rec.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-700">{rec.bankStatement}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                          {rec.totalTransactions}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-emerald-600">
                          {rec.matched}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-amber-600">
                          {rec.unmatched}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                            <CheckCircle2 className="w-3 h-3" />
                            Hoàn thành
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
