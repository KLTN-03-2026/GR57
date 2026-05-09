import { InstructorSidebar } from '@/components/layouts/InstructorSidebar';
import { InstructorHeader } from '@/components/layouts/InstructorHeader';
import { ArrowLeft, Search, Users, BookOpen, MapPin, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '@/hooks';
import AiAssistantButton from '@/imports/AiAssistantButton';
import lecturerApi, { LecturerClassDetailResponseDTO } from '@/api/lecturer.api';

export default function ClassDetail() {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [detail, setDetail] = useState<LecturerClassDetailResponseDTO | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!classId || !user?.id) return;
    lecturerApi.getClassDetail(classId, user.id)
      .then(setDetail)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [classId, user?.id]);

  const filtered = (detail?.hocViens ?? []).filter(s =>
    s.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.maHocVien.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => name.split(' ').pop()?.charAt(0).toUpperCase() ?? '?';

  return (
    <div className="flex h-screen bg-gray-50">
      <InstructorSidebar />

      <div className="flex-1 ml-64 flex flex-col">
        <InstructorHeader title="Chi tiết lớp học phần" />

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">

            <button
              onClick={() => navigate('/lecture/classes')}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Quay lại danh sách lớp
            </button>

            {loading ? (
              <div className="text-center py-12 text-gray-500">Đang tải...</div>
            ) : !detail ? (
              <div className="text-center py-12">
                <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">Không tìm thấy thông tin lớp</p>
              </div>
            ) : (
              <>
                {/* Class info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start gap-5">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-1">
                        {detail.maLopHocPhan}
                      </p>
                      <h2 className="text-2xl font-bold text-gray-900 mb-3">{detail.tenMonHoc}</h2>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {detail.phong} – {detail.toaNha}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-gray-400" />
                          {detail.hocViens.length} sinh viên
                        </span>
                        {detail.lichMoTa && (
                          <span>📅 {detail.lichMoTa}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Tài liệu', path: '/lecture/documents' },
                    { label: 'Bài tập', path: '/lecture/assignments' },
                    { label: 'Điểm danh', path: '/lecture/attendance' },
                  ].map(({ label, path }) => (
                    <button
                      key={path}
                      onClick={() => navigate(path)}
                      className="bg-white border border-gray-200 text-gray-700 rounded-xl p-4 font-medium hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Students */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">
                      Danh sách sinh viên ({detail.hocViens.length})
                    </h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Tìm sinh viên..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {filtered.length === 0 ? (
                    <div className="p-10 text-center">
                      <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">Không tìm thấy sinh viên</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {filtered.map((s, i) => (
                        <div key={s.hocVienId} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                          <span className="w-8 text-sm text-gray-500 text-right">{i + 1}</span>
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
                            {s.avatarUrl
                              ? <img src={s.avatarUrl} alt={s.hoTen} className="w-full h-full object-cover" />
                              : getInitials(s.hoTen)}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{s.hoTen}</p>
                            <p className="text-sm text-gray-500">{s.maHocVien}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
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
