import { AccountantSidebar } from '@/components/layouts/AccountantSidebar';
import { AccountantHeader } from '@/components/layouts/AccountantHeader';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks';
import {
  Bell,
  Mail,
  Send,
  Users,
  CheckSquare,
  Clock,
  AlertCircle
} from 'lucide-react';
import { mockTuitionRecords } from '@/data/mockTuition';
import AiAssistantButton from '@/imports/AiAssistantButton-4-13343';
import { Toast } from '@/components/notification/Toast';

interface User {
  email: string;
  name?: string;
  role: string;
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [emailTemplate, setEmailTemplate] = useState('default');

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

  const unpaidStudents = mockTuitionRecords.filter(r => r.status === 'pending' || r.status === 'failed');

  const overdueStudents = unpaidStudents.filter(r => {
    const dueDate = new Date(r.dueDate.split('/').reverse().join('-'));
    return dueDate < new Date();
  });

  const handleToggleStudent = (id: string) => {
    setSelectedStudents(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === unpaidStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(unpaidStudents.map(s => s.id));
    }
  };

  const handleSendReminder = () => {
    if (selectedStudents.length === 0) {
      setToast({ type: 'error', message: 'Vui lòng chọn ít nhất 1 sinh viên!' });
      return;
    }
    setToast({
      type: 'success',
      message: `Đã gửi email nhắc nợ đến ${selectedStudents.length} sinh viên`
    });
    setSelectedStudents([]);
  };

  const handleSendToOverdue = () => {
    const overdueIds = overdueStudents.map(s => s.id);
    setSelectedStudents(overdueIds);
    setToast({
      type: 'success',
      message: `Đã gửi email nhắc nợ đến ${overdueIds.length} sinh viên quá hạn`
    });
    setTimeout(() => setSelectedStudents([]), 2000);
  };

  const emailTemplates = [
    { id: 'default', name: 'Nhắc nhở thanh toán' },
    { id: 'urgent', name: 'Nhắc nhở khẩn cấp (quá hạn)' },
    { id: 'final', name: 'Thông báo lần cuối' },
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-stone-50">
      <AccountantSidebar />

      <div className="flex-1 ml-64 flex flex-col">
        <AccountantHeader title="Thông báo / Nhắc nợ" />

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "'Sora', sans-serif" }}>
                  Thông báo / Nhắc nợ
                </h2>
                <p className="text-slate-600 mt-1">Gửi email nhắc nhở sinh viên chưa đóng học phí</p>
              </div>
              <button
                onClick={handleSendReminder}
                disabled={selectedStudents.length === 0}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium shadow-lg transition-colors ${
                  selectedStudents.length === 0
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/30'
                }`}
              >
                <Send className="w-5 h-5" />
                Gửi nhắc nợ ({selectedStudents.length})
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Chưa thanh toán</p>
                    <p className="text-2xl font-bold text-amber-600" style={{ fontFamily: "'Sora', sans-serif" }}>
                      {unpaidStudents.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Quá hạn</p>
                    <p className="text-2xl font-bold text-red-600" style={{ fontFamily: "'Sora', sans-serif" }}>
                      {overdueStudents.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <CheckSquare className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Đã chọn</p>
                    <p className="text-2xl font-bold text-emerald-600" style={{ fontFamily: "'Sora', sans-serif" }}>
                      {selectedStudents.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4" style={{ fontFamily: "'Sora', sans-serif" }}>
                Thao tác nhanh
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={handleSelectAll}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                >
                  <CheckSquare className="w-5 h-5" />
                  {selectedStudents.length === unpaidStudents.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                </button>
                <button
                  onClick={handleSendToOverdue}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                >
                  <AlertCircle className="w-5 h-5" />
                  Gửi cho SV quá hạn ({overdueStudents.length})
                </button>
              </div>
            </div>

            {/* Email Template Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4" style={{ fontFamily: "'Sora', sans-serif" }}>
                Mẫu email
              </h3>
              <div className="flex gap-2">
                {emailTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setEmailTemplate(template.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      emailTemplate === template.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Students List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: "'Sora', sans-serif" }}>
                  Danh sách sinh viên ({unpaidStudents.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedStudents.length === unpaidStudents.length && unpaidStudents.length > 0}
                          onChange={handleSelectAll}
                          className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Sinh viên
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Học kỳ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Số tiền nợ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Hạn đóng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {unpaidStudents.map((student) => {
                      const isOverdue = new Date(student.dueDate.split('/').reverse().join('-')) < new Date();
                      return (
                        <tr
                          key={student.id}
                          className={`hover:bg-slate-50 transition-colors ${
                            selectedStudents.includes(student.id) ? 'bg-emerald-50' : ''
                          }`}
                        >
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedStudents.includes(student.id)}
                              onChange={() => handleToggleStudent(student.id)}
                              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <p className="font-semibold text-slate-900">{student.studentName}</p>
                              <p className="text-sm text-slate-500">{student.studentCode}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-sm text-slate-700">
                              <Mail className="w-4 h-4 text-slate-400" />
                              {student.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                            {student.semester}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-semibold text-slate-900">
                              {student.amount.toLocaleString('vi-VN')} VNĐ
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                            {student.dueDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {isOverdue ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                                <AlertCircle className="w-3 h-3" />
                                Quá hạn
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                                <Clock className="w-3 h-3" />
                                Chưa đóng
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
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
