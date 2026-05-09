import { AccountantSidebar } from '@/components/layouts/AccountantSidebar';
import { AccountantHeader } from '@/components/layouts/AccountantHeader';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks';
import {
  History,
  CheckCircle,
  Edit,
  FileText,
  Mail,
  Download,
  User,
  Calendar,
  Filter
} from 'lucide-react';
import AiAssistantButton from '@/imports/AiAssistantButton-4-13343';
import { Toast } from '@/components/notification/Toast';

interface User {
  email: string;
  name?: string;
  role: string;
}

interface ActivityLog {
  id: string;
  action: 'confirm' | 'edit' | 'export' | 'email' | 'view';
  description: string;
  user: string;
  timestamp: string;
  metadata?: {
    invoiceId?: string;
    studentName?: string;
    amount?: number;
  };
}

export default function ActivityHistoryPage() {
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);
  const [selectedAction, setSelectedAction] = useState<'all' | 'confirm' | 'edit' | 'export' | 'email' | 'view'>('all');
  const [selectedDate, setSelectedDate] = useState('');

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

  const mockActivityLogs: ActivityLog[] = [
    {
      id: 'LOG-001',
      action: 'confirm',
      description: 'Xác nhận thanh toán HĐ-2026-0001',
      user: 'Nguyễn Văn Lộc',
      timestamp: '2026-04-22 14:35:20',
      metadata: {
        invoiceId: 'HĐ-2026-0001',
        studentName: 'Nguyễn Thị Hằng',
        amount: 12000000
      }
    },
    {
      id: 'LOG-002',
      action: 'email',
      description: 'Gửi hóa đơn qua email cho SV Trần Văn Minh',
      user: 'Nguyễn Văn Lộc',
      timestamp: '2026-04-22 14:20:15',
      metadata: {
        invoiceId: 'HĐ-2026-0005',
        studentName: 'Trần Văn Minh'
      }
    },
    {
      id: 'LOG-003',
      action: 'export',
      description: 'Xuất báo cáo doanh thu tháng 4/2026',
      user: 'Nguyễn Văn Lộc',
      timestamp: '2026-04-22 13:45:30',
    },
    {
      id: 'LOG-004',
      action: 'edit',
      description: 'Cập nhật thông tin hồ sơ cá nhân',
      user: 'Nguyễn Văn Lộc',
      timestamp: '2026-04-22 10:15:00',
    },
    {
      id: 'LOG-005',
      action: 'view',
      description: 'Xem chi tiết hóa đơn HĐ-2026-0010',
      user: 'Nguyễn Văn Lộc',
      timestamp: '2026-04-22 09:30:45',
      metadata: {
        invoiceId: 'HĐ-2026-0010',
        studentName: 'Lê Thị Lan'
      }
    },
  ];

  const filteredLogs = mockActivityLogs.filter(log => {
    if (selectedAction !== 'all' && log.action !== selectedAction) return false;
    if (selectedDate && !log.timestamp.startsWith(selectedDate)) return false;
    return true;
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'confirm':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'edit':
        return <Edit className="w-4 h-4 text-blue-600" />;
      case 'export':
        return <Download className="w-4 h-4 text-purple-600" />;
      case 'email':
        return <Mail className="w-4 h-4 text-amber-600" />;
      case 'view':
        return <FileText className="w-4 h-4 text-slate-600" />;
      default:
        return <History className="w-4 h-4 text-slate-600" />;
    }
  };

  const getActionBadge = (action: string) => {
    const colors = {
      confirm: 'bg-emerald-100 text-emerald-700',
      edit: 'bg-blue-100 text-blue-700',
      export: 'bg-purple-100 text-purple-700',
      email: 'bg-amber-100 text-amber-700',
      view: 'bg-slate-100 text-slate-700'
    };
    const labels = {
      confirm: 'Xác nhận',
      edit: 'Chỉnh sửa',
      export: 'Xuất file',
      email: 'Gửi email',
      view: 'Xem'
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${colors[action as keyof typeof colors]}`}>
        {getActionIcon(action)}
        {labels[action as keyof typeof labels]}
      </span>
    );
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-stone-50">
      <AccountantSidebar />

      <div className="flex-1 ml-64 flex flex-col">
        <AccountantHeader title="Lịch sử hoạt động" />

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "'Sora', sans-serif" }}>
                Lịch sử hoạt động
              </h2>
              <p className="text-slate-600 mt-1">Audit log - Ai thao tác gì, khi nào</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Loại thao tác</label>
                  <div className="flex gap-2 flex-wrap">
                    {['all', 'confirm', 'edit', 'export', 'email', 'view'].map((action) => (
                      <button
                        key={action}
                        onClick={() => setSelectedAction(action as any)}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-colors text-sm ${
                          selectedAction === action
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {action === 'all' ? 'Tất cả' :
                         action === 'confirm' ? 'Xác nhận' :
                         action === 'edit' ? 'Chỉnh sửa' :
                         action === 'export' ? 'Xuất file' :
                         action === 'email' ? 'Gửi email' : 'Xem'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Ngày</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-slate-400" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: "'Sora', sans-serif" }}>
                  Timeline ({filteredLogs.length} hoạt động)
                </h3>
              </div>
              <div className="p-6">
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200"></div>

                  <div className="space-y-6">
                    {filteredLogs.map((log, index) => (
                      <div key={log.id} className="relative flex gap-4">
                        {/* Timeline dot */}
                        <div className="relative flex items-center justify-center w-16 flex-shrink-0">
                          <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-600/30 z-10">
                            {getActionIcon(log.action)}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 bg-slate-50 rounded-lg p-4 border border-slate-200">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              {getActionBadge(log.action)}
                              <span className="font-mono text-xs text-slate-500">{log.id}</span>
                            </div>
                            <span className="text-xs text-slate-500">{log.timestamp}</span>
                          </div>
                          <p className="text-sm text-slate-900 font-medium mb-2">{log.description}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-600">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {log.user}
                            </div>
                            {log.metadata?.invoiceId && (
                              <div className="font-mono">Mã: {log.metadata.invoiceId}</div>
                            )}
                            {log.metadata?.studentName && (
                              <div>SV: {log.metadata.studentName}</div>
                            )}
                            {log.metadata?.amount && (
                              <div className="font-semibold text-emerald-600">
                                {log.metadata.amount.toLocaleString('vi-VN')} VNĐ
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
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
