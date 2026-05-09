import { InstructorSidebar } from '@/components/layouts/InstructorSidebar';
import { InstructorHeader } from '@/components/layouts/InstructorHeader';
import {
  ChevronDown, Send, Bell, Users, Clock, CheckCircle, X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks';
import AiAssistantButton from '@/imports/AiAssistantButton';
import lecturerApi, {
  LecturerClassSummaryResponseDTO, NotificationResponseDTO
} from '@/api/lecturer.api';

export default function NotificationManagement() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<LecturerClassSummaryResponseDTO[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<NotificationResponseDTO[]>([]);

  useEffect(() => {
    if (!user?.id) return;
    lecturerApi.getClasses(user.id).then((data) => {
      setClasses(data);
      if (data.length > 0) setSelectedClassId(data[0].lopHocPhanId);
    }).catch(console.error);
  }, [user?.id]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !selectedClassId || !user?.id) return;
    setSending(true);
    try {
      const res = await lecturerApi.sendNotification(user.id, {
        lopHocPhanId: selectedClassId,
        tieuDe: title.trim(),
        noiDung: content.trim(),
      });
      setSent(prev => [res, ...prev]);
      setTitle('');
      setContent('');
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'Vừa xong';
    if (m < 60) return `${m} phút trước`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} giờ trước`;
    return `${Math.floor(h / 24)} ngày trước`;
  };

  const selectedClass = classes.find(c => c.lopHocPhanId === selectedClassId);

  return (
    <div className="flex h-screen bg-gray-50">
      <InstructorSidebar />

      <div className="flex-1 ml-64 flex flex-col">
        <InstructorHeader title="Gửi thông báo" />

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">

            <div>
              <h2 className="text-2xl font-bold text-gray-900">Gửi thông báo</h2>
              <p className="text-gray-600 mt-1">Gửi thông báo nhanh đến sinh viên lớp học</p>
            </div>

            {/* Compose form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
                <h3 className="font-semibold text-white text-lg flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Soạn thông báo mới
                </h3>
              </div>

              <form onSubmit={handleSend} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gửi đến lớp <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={selectedClassId}
                      onChange={(e) => setSelectedClassId(e.target.value)}
                      className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      required
                    >
                      {classes.map(c => (
                        <option key={c.lopHocPhanId} value={c.lopHocPhanId}>
                          {c.maLopHocPhan} – {c.tenMonHoc}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  {selectedClass && (
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {selectedClass.phong} – {selectedClass.toaNha}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="VD: Thông báo thay đổi lịch học..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Nhập nội dung thông báo..."
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">{content.length} ký tự</p>
                </div>

                <div className="flex gap-3 pt-2 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={sending}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                    {sending ? 'Đang gửi...' : 'Gửi thông báo'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setTitle(''); setContent(''); }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Sent list */}
            {sent.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <h3 className="font-semibold text-gray-900">Đã gửi trong phiên này ({sent.length})</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {sent.map((n) => (
                    <div key={n.id} className="p-5 flex items-start gap-4 hover:bg-gray-50">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                        <Bell className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <p className="font-semibold text-gray-900">{n.tieuDe}</p>
                          <span className="text-xs text-gray-400 shrink-0 ml-2">{timeAgo(n.createdAt)}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{n.noiDung}</p>
                        <span className="inline-flex items-center gap-1 text-xs text-green-600 mt-2">
                          <CheckCircle className="w-3.5 h-3.5" />Đã gửi thành công
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        className="fixed bottom-8 right-8 w-16 h-16 hover:scale-110 transition-transform duration-200 z-50"
        aria-label="AI Assistant"
      >
        <AiAssistantButton />
      </button>
    </div>
  );
}
