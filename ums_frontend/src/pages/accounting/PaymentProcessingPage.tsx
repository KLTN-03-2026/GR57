import { AccountantSidebar } from '@/components/layouts/AccountantSidebar';
import { AccountantHeader } from '@/components/layouts/AccountantHeader';
import { useState, useEffect } from 'react';
import {
  Clock,
  XCircle,
  Eye,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks';
import AiAssistantButton from '@/imports/AiAssistantButton-4-13343';
import { tuitionRepository, workflowRepository } from '@/api';
import { useAsync } from '@/hooks';
import { Toast } from '@/components/notification/Toast';
import type { TuitionRecord } from '@/types';

type TabType = 'pending' | 'failed';

interface User {
  email: string;
  name?: string;
  role: string;
}

export default function PaymentProcessingPage() {
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);
  const [tuitionRecords, setTuitionRecords] = useState<TuitionRecord[]>([]);

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

  const { data: allTuitions = [] } = useAsync(
    () => tuitionRepository.getAllTuitions(),
    [],
  );
  useEffect(() => {
    setTuitionRecords(allTuitions);
  }, [allTuitions]);

  const pendingPayments = tuitionRecords.filter((item) => item.status === 'pending');
  const failedPayments = tuitionRecords.filter((item) => item.status === 'failed');

  const handleViewDetail = (id: string) => {
    navigate('/accountant/invoice', { state: { invoiceId: id } });
  };

  const handleApprove = async (id: string, studentName: string) => {
    await tuitionRepository.updateTuition(id, {
      status: 'paid',
      paymentMethod: 'transfer',
      note: `Xác nhận bởi kế toán: ${studentName}`,
    });
    await workflowRepository.appendLog({
      actorRole: 'accountant',
      actorId: user?.email || 'accountant',
      module: 'tuition',
      action: 'approve_payment',
      entityId: id,
      fromStatus: 'pending',
      toStatus: 'paid',
      note: `Xác nhận thanh toán cho ${studentName}`,
    });
    setTuitionRecords((prev) => prev.map((item) => (item.id === id ? { ...item, status: 'paid' } : item)));
    setToast({ type: 'success', message: `Đã xác nhận thanh toán cho ${studentName}` });
  };

  const handleRetry = async (id: string) => {
    await tuitionRepository.updateTuition(id, {
      status: 'pending',
      note: `Kế toán chuyển lại trạng thái chờ xử lý cho ${id}`,
    });
    await workflowRepository.appendLog({
      actorRole: 'accountant',
      actorId: user?.email || 'accountant',
      module: 'tuition',
      action: 'retry_payment',
      entityId: id,
      fromStatus: 'failed',
      toStatus: 'pending',
      note: 'Thử lại giao dịch thất bại',
    });
    setTuitionRecords((prev) => prev.map((item) => (item.id === id ? { ...item, status: 'pending' } : item)));
    setToast({ type: 'success', message: `Đã chuyển ${id} về trạng thái chờ xử lý` });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-[#f1f5f9]">
      <AccountantSidebar />

      <div className="flex-1 ml-64 flex flex-col">
        <AccountantHeader title="Xử lý thanh toán" />

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Xử lý thanh toán</h2>
              <p className="text-gray-600 mt-1">Quản lý các giao dịch cần xử lý</p>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Chờ xác nhận</p>
                    <p className="text-2xl font-bold text-gray-900">{pendingPayments.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Giao dịch lỗi</p>
                    <p className="text-2xl font-bold text-gray-900">{failedPayments.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('pending')}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === 'pending'
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="w-5 h-5" />
                      Chờ xác nhận ({pendingPayments.length})
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('failed')}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === 'failed'
                        ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <XCircle className="w-5 h-5" />
                      Giao dịch lỗi ({failedPayments.length})
                    </div>
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'pending' ? (
                  <>
                    {pendingPayments.length === 0 ? (
                      <div className="text-center py-12">
                        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">Không có giao dịch nào cần xác nhận</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {pendingPayments.map((payment) => (
                          <div
                            key={payment.id}
                            className="border border-yellow-200 bg-yellow-50 rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
                                    <Clock className="w-3 h-3" />
                                    Chờ xác nhận
                                  </span>
                                  <span className="font-mono text-sm text-gray-700">{payment.id}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                  <div>
                                    <p className="text-xs text-gray-600 mb-1">Sinh viên</p>
                                    <p className="font-semibold text-gray-900">{payment.studentName}</p>
                                    <p className="text-sm text-gray-600">{payment.studentCode}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-600 mb-1">Học kỳ</p>
                                    <p className="text-sm text-gray-900">{payment.semester}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-600 mb-1">Số tiền</p>
                                    <p className="font-semibold text-gray-900">
                                      {payment.amount.toLocaleString('vi-VN')} VNĐ
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-600 mb-1">Ngày tạo</p>
                                    <p className="text-sm text-gray-900">{payment.createdDate}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <button
                                  onClick={() => handleViewDetail(payment.id)}
                                  className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                                >
                                  <Eye className="w-4 h-4" />
                                  Chi tiết
                                </button>
                                <button
                                  onClick={() => handleApprove(payment.id, payment.studentName)}
                                  className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Xác nhận
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {failedPayments.length === 0 ? (
                      <div className="text-center py-12">
                        <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">Không có giao dịch lỗi nào</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {failedPayments.map((payment) => (
                          <div
                            key={payment.id}
                            className="border border-red-200 bg-red-50 rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                                    <XCircle className="w-3 h-3" />
                                    Thất bại
                                  </span>
                                  <span className="font-mono text-sm text-gray-700">{payment.id}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                                  <div>
                                    <p className="text-xs text-gray-600 mb-1">Sinh viên</p>
                                    <p className="font-semibold text-gray-900">{payment.studentName}</p>
                                    <p className="text-sm text-gray-600">{payment.studentCode}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-600 mb-1">Học kỳ</p>
                                    <p className="text-sm text-gray-900">{payment.semester}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-600 mb-1">Số tiền</p>
                                    <p className="font-semibold text-gray-900">
                                      {payment.amount.toLocaleString('vi-VN')} VNĐ
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-600 mb-1">Ngày tạo</p>
                                    <p className="text-sm text-gray-900">{payment.createdDate}</p>
                                  </div>
                                </div>
                                {payment.failureReason && (
                                  <div className="flex items-start gap-2 bg-white bg-opacity-60 rounded-lg p-3">
                                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                      <p className="text-xs text-gray-600">Lý do thất bại:</p>
                                      <p className="text-sm text-red-700 font-medium">{payment.failureReason}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <button
                                  onClick={() => handleViewDetail(payment.id)}
                                  className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                                >
                                  <Eye className="w-4 h-4" />
                                  Chi tiết
                                </button>
                                <button
                                  onClick={() => handleRetry(payment.id)}
                                  className="inline-flex items-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                                >
                                  <AlertTriangle className="w-4 h-4" />
                                  Thử lại
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
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
