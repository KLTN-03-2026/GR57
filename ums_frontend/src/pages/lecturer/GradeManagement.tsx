import { InstructorSidebar } from '@/components/layouts/InstructorSidebar';
import { InstructorHeader } from '@/components/layouts/InstructorHeader';
import {
  ChevronDown, Save, Search, AlertCircle, Calculator, TrendingUp, Users, Award
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks';
import AiAssistantButton from '@/imports/AiAssistantButton';
import lecturerApi, { LecturerClassSummaryResponseDTO, GradeStudentResponseDTO } from '@/api/lecturer.api';

interface StudentGrade extends GradeStudentResponseDTO {
  editedGrade: string;
}

export default function GradeManagement() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<LecturerClassSummaryResponseDTO[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [students, setStudents] = useState<StudentGrade[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);
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
    lecturerApi.getGrades(selectedClassId, user.id)
      .then((data) => {
        setStudents(data.students.map(s => ({
          ...s,
          editedGrade: s.diemTrungBinh != null ? String(s.diemTrungBinh) : '',
        })));
        setHasUnsavedChanges(false);
      })
      .catch(console.error)
      .finally(() => setLoadingStudents(false));
  }, [selectedClassId, user?.id]);

  const filtered = students.filter(s =>
    s.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.maHocVien.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validate = (v: string) => v === '' || (!isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 10);

  const handleGradeChange = (id: string, value: string) => {
    setStudents(prev => prev.map(s => s.hocVienId === id ? { ...s, editedGrade: value } : s));
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    if (!user?.id || !selectedClassId) return;
    const invalid = students.some(s => !validate(s.editedGrade));
    if (invalid) { alert('Vui lòng kiểm tra lại điểm (0-10)!'); return; }

    setSaving(true);
    try {
      const studentGrades: Record<string, number> = {};
      students.forEach(s => {
        if (s.editedGrade !== '') studentGrades[s.hocVienId] = Number(s.editedGrade);
      });
      await lecturerApi.updateGrades(user.id, { lopHocPhanId: selectedClassId, studentGrades });
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const getGradeColor = (v: string) => {
    const n = Number(v);
    if (!v || isNaN(n)) return '';
    if (n >= 8.5) return 'text-green-600 font-bold';
    if (n >= 7.0) return 'text-blue-600 font-semibold';
    if (n >= 5.5) return 'text-yellow-600 font-semibold';
    if (n >= 4.0) return 'text-orange-600 font-semibold';
    return 'text-red-600 font-bold';
  };

  const getGradeRank = (v: string) => {
    const n = Number(v);
    if (!v || isNaN(n)) return '–';
    if (n >= 8.5) return 'Giỏi';
    if (n >= 7.0) return 'Khá';
    if (n >= 5.5) return 'TB Khá';
    if (n >= 4.0) return 'Trung bình';
    return 'Yếu';
  };

  const valids = students.map(s => Number(s.editedGrade)).filter(n => !isNaN(n) && n >= 0);
  const classAvg = valids.length ? (valids.reduce((a, b) => a + b, 0) / valids.length).toFixed(1) : '–';
  const excellentCount = valids.filter(n => n >= 8.5).length;
  const goodCount = valids.filter(n => n >= 7.0 && n < 8.5).length;
  const failCount = valids.filter(n => n < 5.5).length;

  return (
    <div className="flex h-screen bg-gray-50">
      <InstructorSidebar />

      <div className="flex-1 ml-64 flex flex-col">
        <InstructorHeader title="Quản lý điểm" />

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Quản lý điểm số</h2>
                <p className="text-gray-600 mt-1">Nhập và theo dõi điểm sinh viên</p>
              </div>
              <div className="flex items-center gap-3">
                {hasUnsavedChanges && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium">
                    <AlertCircle className="w-4 h-4" />Có thay đổi chưa lưu
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
                  {saving ? 'Đang lưu...' : 'Lưu tất cả'}
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-6">
              {[
                { label: 'Điểm TB lớp', value: classAvg, icon: Calculator, bg: 'bg-blue-100', text: 'text-blue-600' },
                { label: 'Giỏi (≥8.5)', value: excellentCount, icon: Award, bg: 'bg-green-100', text: 'text-green-600' },
                { label: 'Khá (≥7.0)', value: goodCount, icon: TrendingUp, bg: 'bg-indigo-100', text: 'text-indigo-600' },
                { label: 'Yếu/Kém', value: failCount, icon: Users, bg: 'bg-red-100', text: 'text-red-600' },
              ].map(({ label, value, icon: Icon, bg, text }) => (
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

            {/* Filters */}
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
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm sinh viên</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm theo tên hoặc mã SV..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <tr>
                      {['STT', 'Mã SV', 'Họ và tên', 'Điểm', 'Xếp loại'].map(h => (
                        <th key={h} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loadingStudents ? (
                      <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">Đang tải...</td></tr>
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                          <p className="text-gray-500">Không có sinh viên</p>
                        </td>
                      </tr>
                    ) : filtered.map((s, i) => (
                      <tr key={s.hocVienId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-gray-700 font-medium">{i + 1}</td>
                        <td className="px-6 py-4 text-gray-900 font-medium">{s.maHocVien}</td>
                        <td className="px-6 py-4 text-gray-900 font-medium">{s.hoTen}</td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={s.editedGrade}
                            onChange={(e) => handleGradeChange(s.hocVienId, e.target.value)}
                            className={`w-24 px-3 py-2 border rounded-lg text-center focus:outline-none focus:ring-2 transition-all ${
                              !validate(s.editedGrade)
                                ? 'border-red-500 bg-red-50 text-red-700 focus:ring-red-500'
                                : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            placeholder="0–10"
                          />
                        </td>
                        <td className="px-6 py-4">
                          {s.editedGrade !== '' && validate(s.editedGrade) ? (
                            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                              Number(s.editedGrade) >= 8.5 ? 'bg-green-100 text-green-700' :
                              Number(s.editedGrade) >= 7.0 ? 'bg-blue-100 text-blue-700' :
                              Number(s.editedGrade) >= 5.5 ? 'bg-yellow-100 text-yellow-700' :
                              Number(s.editedGrade) >= 4.0 ? 'bg-orange-100 text-orange-700' :
                              'bg-red-100 text-red-700'
                            } ${getGradeColor(s.editedGrade)}`}>
                              {getGradeRank(s.editedGrade)}
                            </span>
                          ) : <span className="text-gray-400">–</span>}
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

      <button
        className="fixed bottom-8 right-8 w-16 h-16 hover:scale-110 transition-transform duration-200 z-50"
        aria-label="AI Assistant"
      >
        <AiAssistantButton />
      </button>
    </div>
  );
}
