import { InstructorSidebar } from '@/components/layouts/InstructorSidebar';
import { InstructorHeader } from '@/components/layouts/InstructorHeader';
import { Search, BookOpen, Users, ChevronRight, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks';
import AiAssistantButton from '@/imports/AiAssistantButton';
import lecturerApi, { LecturerClassSummaryResponseDTO } from '@/api/lecturer.api';

export default function ClassManagement() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [classes, setClasses] = useState<LecturerClassSummaryResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    lecturerApi.getClasses(user.id)
      .then(setClasses)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id]);

  const filtered = classes.filter(c =>
    c.tenMonHoc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.maLopHocPhan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div className="flex h-screen bg-gray-50">
      <InstructorSidebar />

      <div className="flex-1 ml-64 flex flex-col">
        <InstructorHeader title="Lớp học phần" />

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Lớp học phần phụ trách</h2>
                <p className="text-gray-600 mt-1">Quản lý các lớp học phần bạn đang giảng dạy</p>
              </div>
              <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                {classes.length} lớp
              </span>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm theo tên môn học hoặc mã lớp..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-500">Đang tải...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">Không tìm thấy lớp nào</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.map((cls) => (
                  <div
                    key={cls.lopHocPhanId}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
                    onClick={() => navigate(`/lecture/classes/${cls.lopHocPhanId}`)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                            {cls.maLopHocPhan}
                          </p>
                          <h3 className="font-bold text-gray-900 text-lg leading-tight">
                            {cls.tenMonHoc}
                          </h3>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 mt-1" />
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>{cls.phong} – {cls.toaNha}</span>
                      </div>
                      {cls.ngayBatDau && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">📅</span>
                          <span>{fmtDate(cls.ngayBatDau)} – {fmtDate(cls.ngayKetThuc)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
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
