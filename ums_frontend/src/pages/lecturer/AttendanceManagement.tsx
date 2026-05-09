import { InstructorSidebar } from '@/components/layouts/InstructorSidebar';
import { InstructorHeader } from '@/components/layouts/InstructorHeader';
import {
  ChevronDown, Save, Calendar, Users, CheckCircle, XCircle,
  Search, Clock, AlertCircle, CheckCheck, X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks';
import AiAssistantButton from '@/imports/AiAssistantButton';
import lecturerApi, {
  LecturerClassSummaryResponseDTO, AttendanceStudentResponseDTO
} from '@/api/lecturer.api';

interface StudentAttendance extends AttendanceStudentResponseDTO {
  isPresent: boolean;
}

export default function AttendanceManagement() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<LecturerClassSummaryResponseDTO[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [students, setStudents] = useState<StudentAttendance[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    lecturerApi.getClasses(user.id).then((data) => {
      setClasses(data);
      if (data.length > 0) setSelectedClassId(data[0].lopHocPhanId);
    }).catch(console.error);
  }, [user?.id]);

  useEffect(() => {
    if (!selectedClassId || !user?.id) return;
    setLoadingStudents(true);
    lecturerApi.getAttendance(selectedClassId, user.id)
      .then((data) => {
        setStudents(data.students.map(s => ({ ...s, isPresent: s.trangThai })));
        setHasUnsavedChanges(false);
      })
      .catch(console.error)
      .finally(() => setLoadingStudents(false));
  }, [selectedClassId, user?.id]);

  const filtered = students.filter(s =>
    s.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.maHocVien.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const presentCount = students.filter(s => s.isPresent).length;
  const absentCount = students.length - presentCount;
  const attendanceRate = students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0;

  const toggleAttendance = (id: string) => {
    setStudents(prev => prev.map(s => s.hocVienId === id ? { ...s, isPresent: !s.isPresent } : s));
    setHasUnsavedChanges(true);
  };

  const markAll = (present: boolean) => {
    setStudents(prev => prev.map(s => ({ ...s, isPresent: present })));
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    if (!user?.id || !selectedClassId) return;
    setSaving(true);
    try {
      await lecturerApi.updateAttendance(user.id, {
        lopHocPhanId: selectedClassId,
        ngayDiemDanh: selectedDate,
        entries: students.map(s => ({ hocVienId: s.hocVienId, trangThai: s.isPresent })),
      });
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name: string) => name.split(' ').pop()?.charAt(0).toUpperCase() ?? '?';

  const selectedClass = classes.find(c => c.lopHocPhanId === selectedClassId);

  return (
    <div className="flex h-screen bg-gray-50">
      <InstructorSidebar />

      <div className="flex-1 ml-64 flex flex-col">
        <InstructorHeader title="Điểm danh sinh viên" />

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Điểm danh sinh viên</h2>
                <p className="text-gray-600 mt-1">Ghi nhận sự có mặt của sinh viên</p>
              </div>
              <div className="flex items-center gap-3">
                {hasUnsavedChanges && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium">
                    <AlertCircle className="w-4 h-4" />Chưa lưu
                  </span>
                )}
                <button
                  onClick={handleSave}
                  disabled={!hasUnsavedChanges || saving}
                  className={`inline-flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                    hasUnsavedChanges && !saving
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Save className="w-5 h-5" />
                  {saving ? 'Đang lưu...' : 'Lưu điểm danh'}
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-6">
              {(() => {
                const rateBg = attendanceRate >= 80 ? 'bg-green-100' : attendanceRate >= 60 ? 'bg-yellow-100' : 'bg-red-100';
                const rateText = attendanceRate >= 80 ? 'text-green-600' : attendanceRate >= 60 ? 'text-yellow-600' : 'text-red-600';
                return [
                  { label: 'Tổng SV', value: students.length, icon: Users, bg: 'bg-blue-100', text: 'text-blue-600' },
                  { label: 'Có mặt', value: presentCount, icon: CheckCircle, bg: 'bg-green-100', text: 'text-green-600' },
                  { label: 'Vắng mặt', value: absentCount, icon: XCircle, bg: 'bg-red-100', text: 'text-red-600' },
                  { label: 'Tỷ lệ', value: `${attendanceRate}%`, icon: Clock, bg: rateBg, text: rateText },
                ];
              })().map(({ label, value, icon: Icon, bg, text }) => (
                <div key={label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${bg} rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${text}`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{label}</p>
                      <p className={`text-2xl font-bold ${text}`}>{value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Class selection */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chọn lớp học phần</label>
                  <div className="relative">
                    <select
                      value={selectedClassId}
                      onChange={(e) => setSelectedClassId(e.target.value)}
                      className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                      <Clock className="w-3 h-3" />
                      {selectedClass.phong} – {selectedClass.toaNha}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày điểm danh</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Search + quick actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sinh viên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => markAll(true)}
                  className="inline-flex items-center gap-2 px-4 py-3 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors font-medium">
                  <CheckCheck className="w-5 h-5" />Điểm danh tất cả
                </button>
                <button onClick={() => markAll(false)}
                  className="inline-flex items-center gap-2 px-4 py-3 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium">
                  <X className="w-5 h-5" />Bỏ chọn tất cả
                </button>
              </div>
            </div>

            {/* Students list */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
                <h3 className="font-semibold text-white text-lg">
                  Danh sách sinh viên ({filtered.length})
                </h3>
              </div>

              {loadingStudents ? (
                <div className="p-8 text-center text-gray-500">Đang tải...</div>
              ) : filtered.length === 0 ? (
                <div className="p-12 text-center">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">Không có sinh viên</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filtered.map((student) => (
                    <div key={student.hocVienId}
                      className={`p-5 transition-all ${student.isPresent ? 'bg-white hover:bg-green-50' : 'bg-gray-50 hover:bg-red-50'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                            student.isPresent ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-gray-400 to-gray-500'
                          }`}>
                            {getInitials(student.hoTen)}
                          </div>
                          <div className="flex-1">
                            <p className={`font-semibold ${student.isPresent ? 'text-gray-900' : 'text-gray-500'}`}>
                              {student.hoTen}
                            </p>
                            <p className="text-sm text-gray-600">{student.maHocVien}</p>
                          </div>
                          <div className="hidden md:block">
                            {student.isPresent ? (
                              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 text-green-700 font-medium">
                                <CheckCircle className="w-4 h-4" />Có mặt
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 text-red-700 font-medium">
                                <XCircle className="w-4 h-4" />Vắng mặt
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => toggleAttendance(student.hocVienId)}
                          className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors focus:outline-none ml-4 ${
                            student.isPresent ? 'bg-green-600' : 'bg-gray-300'
                          }`}
                        >
                          <span className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-lg transition-transform ${
                            student.isPresent ? 'translate-x-11' : 'translate-x-1'
                          }`} />
                          <span className={`absolute text-xs font-semibold ${student.isPresent ? 'left-2 text-white' : 'right-2 text-gray-600'}`}>
                            {student.isPresent ? '✓' : '✗'}
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
