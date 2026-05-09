import { AccountantSidebar } from '@/components/layouts/AccountantSidebar';
import { AccountantHeader } from '@/components/layouts/AccountantHeader';
import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Download,
  Printer,
  User,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Tag
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import AiAssistantButton from '@/imports/AiAssistantButton-4-13343';
import { getTuitionById, updateTuitionStatus } from '@/data/mockTuition';
import { useAuth } from '@/hooks';
import { Toast } from '@/components/notification/Toast';

interface User {
  email: string;
  name?: string;
  role: string;
}

export default function InvoiceDetailPage() {
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated } = useAuth();
  const location = useLocation();
  const invoiceId = location.state?.invoiceId || 'TUI001';

  const [user, setUser] = useState<User | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);

  // Payment confirmation form
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer' | 'card' | 'ewallet'>('transfer');
  const [transactionRef, setTransactionRef] = useState('');

  // Failure form
  const [failureReason, setFailureReason] = useState('');

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

  // Get invoice data by ID
  const invoice = getTuitionById(invoiceId);

  if (!invoice) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f1f5f9]">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy hóa đơn</h2>
          <p className="text-gray-600 mb-4">Hóa đơn ID: {invoiceId} không tồn tại</p>
          <button
            onClick={() => navigate('/accountant/tuition')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const subtotal = invoice.courses.reduce((sum, course) => sum + course.total, 0);
  const finalAmount = subtotal - invoice.discount;

  const handleConfirmPayment = () => {
    setShowConfirmModal(true);
  };

  const handleRejectPayment = () => {
    setShowRejectModal(true);
  };

  const handleExportPDF = () => {
    setToast({ type: 'success', message: 'Xuất PDF thành công!' });
  };

  const handlePrint = () => {
    window.print();
  };

  const confirmPaymentAction = () => {
    if (paymentMethod === 'transfer' && !transactionRef.trim()) {
      setToast({ type: 'error', message: 'Vui lòng nhập mã giao dịch!' });
      return;
    }

    const success = updateTuitionStatus(invoiceId, 'paid', {
      paymentMethod,
      transactionRef: transactionRef.trim() || undefined,
      confirmedBy: user?.name || 'Kế toán'
    });

    if (success) {
      setToast({ type: 'success', message: 'Đã xác nhận thanh toán thành công!' });
      setShowConfirmModal(false);
      setTimeout(() => navigate('/accountant/tuition'), 1500);
    } else {
      setToast({ type: 'error', message: 'Có lỗi xảy ra, vui lòng thử lại!' });
    }
  };

  const rejectPaymentAction = () => {
    if (!failureReason.trim()) {
      setToast({ type: 'error', message: 'Vui lòng nhập lý do thất bại!' });
      return;
    }

    const success = updateTuitionStatus(invoiceId, 'failed', {
      failureReason: failureReason.trim()
    });

    if (success) {
      setToast({ type: 'success', message: 'Đã đánh dấu giao dịch thất bại!' });
      setShowRejectModal(false);
      setTimeout(() => navigate('/accountant/payment'), 1500);
    } else {
      setToast({ type: 'error', message: 'Có lỗi xảy ra, vui lòng thử lại!' });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .print-full-width {
            margin: 0 !important;
            max-width: 100% !important;
          }
        }
      `}</style>

      <div className="flex h-screen bg-[#f1f5f9]">
        <div className="no-print">
          <AccountantSidebar />
        </div>

        <div className="flex-1 ml-64 flex flex-col print:ml-0">
          <div className="no-print">
            <AccountantHeader title="Chi tiết hóa đơn" />
          </div>

          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-5xl mx-auto space-y-6 print-full-width">
              {/* Header */}
              <div className="flex items-center justify-between no-print">
                <button
                  onClick={() => navigate('/accountant/tuition')}
                  className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Quay lại
                </button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrint}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    <Printer className="w-5 h-5" />
                    In
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Download className="w-5 h-5" />
                    Xuất PDF
                  </button>
                </div>
              </div>

              {/* Invoice Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d4a6b] p-8 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">HÓA ĐƠN HỌC PHÍ</h1>
                      <p className="text-blue-100">Learning Hub - Hệ thống quản lý đào tạo</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-blue-100 mb-1">Mã hóa đơn</p>
                      <p className="text-2xl font-bold font-mono">{invoice.id}</p>
                    </div>
                  </div>
                </div>

                {/* Student Info */}
                <div className="p-8 border-b border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 uppercase mb-4">Thông tin sinh viên</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Họ và tên</p>
                            <p className="font-semibold text-gray-900">{invoice.studentName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Tag className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Mã sinh viên</p>
                            <p className="font-semibold text-gray-900">{invoice.studentCode}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-semibold text-gray-900">{invoice.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Số điện thoại</p>
                            <p className="font-semibold text-gray-900">{invoice.phone}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 uppercase mb-4">Thông tin hóa đơn</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Học kỳ</p>
                            <p className="font-semibold text-gray-900">{invoice.semester}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Ngày tạo</p>
                            <p className="font-semibold text-gray-900">{invoice.createdDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Hạn đóng</p>
                            <p className="font-semibold text-red-600">{invoice.dueDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Trạng thái</p>
                            {invoice.status === 'paid' ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                                <CheckCircle className="w-3 h-3" />
                                Đã thanh toán
                              </span>
                            ) : invoice.status === 'pending' ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
                                Chờ thanh toán
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                                <XCircle className="w-3 h-3" />
                                Thất bại
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Items */}
                <div className="p-8 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-600 uppercase mb-4">Danh sách môn học</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                            Mã môn
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                            Tên môn học
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                            Số tín chỉ
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                            Đơn giá
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                            Thành tiền
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {invoice.courses.map((course) => (
                          <tr key={course.id}>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className="font-mono text-sm text-gray-900">{course.code}</span>
                            </td>
                            <td className="px-4 py-4">
                              <span className="text-sm text-gray-900">{course.name}</span>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <span className="text-sm text-gray-900">{course.credits}</span>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <span className="text-sm text-gray-900">
                                {course.pricePerCredit.toLocaleString('vi-VN')} VNĐ
                              </span>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <span className="text-sm font-semibold text-gray-900">
                                {course.total.toLocaleString('vi-VN')} VNĐ
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Summary */}
                <div className="p-8 bg-gray-50">
                  <div className="max-w-md ml-auto space-y-3">
                    <div className="flex items-center justify-between text-gray-700">
                      <span>Tổng tín chỉ:</span>
                      <span className="font-semibold">
                        {invoice.courses.reduce((sum, c) => sum + c.credits, 0)} tín chỉ
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-gray-700">
                      <span>Tạm tính:</span>
                      <span className="font-semibold">{subtotal.toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                    {invoice.discount > 0 && (
                      <div className="flex items-center justify-between text-green-600">
                        <span>Giảm giá:</span>
                        <span className="font-semibold">-{invoice.discount.toLocaleString('vi-VN')} VNĐ</span>
                      </div>
                    )}
                    <div className="border-t border-gray-300 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">Tổng cộng:</span>
                        <span className="text-2xl font-bold text-blue-600">
                          {finalAmount.toLocaleString('vi-VN')} VNĐ
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Note */}
                {invoice.note && (
                  <div className="p-8 bg-blue-50 border-t border-blue-100">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Ghi chú:</span> {invoice.note}
                    </p>
                  </div>
                )}

                {/* Payment Info (if paid) */}
                {invoice.status === 'paid' && invoice.paymentMethod && (
                  <div className="p-8 bg-green-50 border-t border-green-100">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Thông tin thanh toán</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Phương thức:</span>
                        <span className="ml-2 font-semibold text-gray-900">
                          {invoice.paymentMethod === 'cash' ? 'Tiền mặt' :
                           invoice.paymentMethod === 'transfer' ? 'Chuyển khoản' :
                           invoice.paymentMethod === 'card' ? 'Thẻ' : 'Ví điện tử'}
                        </span>
                      </div>
                      {invoice.transactionRef && (
                        <div>
                          <span className="text-gray-600">Mã GD:</span>
                          <span className="ml-2 font-mono font-semibold text-gray-900">{invoice.transactionRef}</span>
                        </div>
                      )}
                      {invoice.confirmedBy && (
                        <div>
                          <span className="text-gray-600">Người xác nhận:</span>
                          <span className="ml-2 font-semibold text-gray-900">{invoice.confirmedBy}</span>
                        </div>
                      )}
                      {invoice.confirmedAt && (
                        <div>
                          <span className="text-gray-600">Thời gian:</span>
                          <span className="ml-2 font-semibold text-gray-900">{invoice.confirmedAt}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Failure Info */}
                {invoice.status === 'failed' && invoice.failureReason && (
                  <div className="p-8 bg-red-50 border-t border-red-100">
                    <h3 className="text-sm font-semibold text-red-700 mb-2">Lý do thất bại</h3>
                    <p className="text-sm text-red-600">{invoice.failureReason}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              {invoice.status === 'pending' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 no-print">
                  <h3 className="font-semibold text-gray-900 mb-4">Thao tác</h3>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleConfirmPayment}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Xác nhận thanh toán
                    </button>
                    <button
                      onClick={handleRejectPayment}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      <XCircle className="w-5 h-5" />
                      Đánh dấu thất bại
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Payment Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Xác nhận thanh toán</h3>
            </div>

            <div className="space-y-4">
              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phương thức thanh toán <span className="text-red-500">*</span>
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="cash">Tiền mặt</option>
                  <option value="transfer">Chuyển khoản</option>
                  <option value="card">Thẻ</option>
                  <option value="ewallet">Ví điện tử</option>
                </select>
              </div>

              {/* Transaction Ref (only for non-cash) */}
              {paymentMethod !== 'cash' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã giao dịch {paymentMethod === 'transfer' && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder="VD: VCB20260422001"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              )}

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  Bạn đang xác nhận thanh toán <span className="font-semibold">{finalAmount.toLocaleString('vi-VN')} VNĐ</span> cho hóa đơn <span className="font-mono font-semibold">{invoice.id}</span>
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={confirmPaymentAction}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Payment Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Đánh dấu thất bại</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do thất bại <span className="text-red-500">*</span>
                </label>
                <select
                  value={failureReason}
                  onChange={(e) => setFailureReason(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">-- Chọn lý do --</option>
                  <option value="Số dư tài khoản không đủ">Số dư tài khoản không đủ</option>
                  <option value="Thông tin thẻ không hợp lệ">Thông tin thẻ không hợp lệ</option>
                  <option value="Giao dịch bị ngân hàng từ chối">Giao dịch bị ngân hàng từ chối</option>
                  <option value="Thẻ hết hạn">Thẻ hết hạn</option>
                  <option value="Vượt quá hạn mức giao dịch">Vượt quá hạn mức giao dịch</option>
                  <option value="Thông tin không chính xác">Thông tin không chính xác</option>
                  <option value="Lỗi hệ thống thanh toán">Lỗi hệ thống thanh toán</option>
                </select>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">
                  Bạn đang đánh dấu giao dịch <span className="font-mono font-semibold">{invoice.id}</span> là thất bại
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={rejectPaymentAction}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

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
        className="fixed bottom-8 right-8 w-16 h-16 hover:scale-110 transition-transform duration-200 z-50 no-print"
        aria-label="AI Assistant"
      >
        <AiAssistantButton />
      </button>
    </>
  );
}
