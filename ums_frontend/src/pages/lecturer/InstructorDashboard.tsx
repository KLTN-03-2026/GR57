import { InstructorSidebar } from '@/components/layouts/InstructorSidebar';
import { InstructorHeader } from '@/components/layouts/InstructorHeader';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks';
import { Clock, BookOpen, ClipboardList, Users, Calendar, MapPin, AlertCircle } from 'lucide-react';
import AiAssistantButton from '@/imports/AiAssistantButton';
import lecturerApi, { LecturerDashboardResponseDTO, LecturerScheduleDTO } from '@/api/lecturer.api';

export default function InstructorDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [dashboard, setDashboard] = useState<LecturerDashboardResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'lecture') {
      navigate('/');
      return;
    }
    lecturerApi.getDashboard(user.id)
      .then(setDashboard)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isAuthenticated, user, navigate]);

  const todaySchedule: LecturerScheduleDTO[] = dashboard?.todaySchedule ?? [];

  return (
    <div className="flex h-screen bg-gray-50">
      <InstructorSidebar />

      <div className="flex-1 ml-64 flex flex-col">
        <InstructorHeader title="Dashboard" />

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Xin chào, {user?.fullName || user?.username}!
              </h2>
              <p className="text-gray-600 mt-1">
                {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Lớp phụ trách</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? '...' : dashboard?.totalClasses ?? 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <ClipboardList className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bài tập chưa chấm</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? '...' : dashboard?.ungradedAssignments ?? 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tỷ lệ chuyên cần</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? '...' : `${((dashboard?.attendanceRate ?? 0) * 100).toFixed(0)}%`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Today schedule */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Lịch dạy hôm nay</h3>
              </div>

              {loading ? (
                <div className="p-8 text-center text-gray-500">Đang tải...</div>
              ) : todaySchedule.length === 0 ? (
                <div className="p-8 text-center">
                  <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">Không có lịch dạy hôm nay</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {todaySchedule.map((item) => (
                    <div key={item.lichId} className="p-5 flex items-center gap-5">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                        <Clock className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{item.tenMonHoc}</p>
                        <p className="text-sm text-gray-600">{item.maLopHocPhan}</p>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <p className="flex items-center gap-1 justify-end">
                          <Clock className="w-3.5 h-3.5" />
                          {item.gioBatDau} – {item.gioKetThuc}
                        </p>
                        <p className="flex items-center gap-1 justify-end mt-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {item.phong} – {item.toaNha}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Lớp học phần', path: '/lecture/classes', hoverClass: 'hover:border-blue-400' },
                { label: 'Điểm danh', path: '/lecture/attendance', hoverClass: 'hover:border-green-400' },
                { label: 'Quản lý điểm', path: '/lecture/grades', hoverClass: 'hover:border-purple-400' },
                { label: 'Thông báo', path: '/lecture/notifications', hoverClass: 'hover:border-orange-400' },
              ].map(({ label, path, hoverClass }) => (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`bg-white rounded-xl border border-gray-200 p-4 text-center ${hoverClass} hover:shadow-md transition-all`}
                >
                  <p className="font-medium text-gray-800 text-sm">{label}</p>
                </button>
              ))}
            </div>
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
