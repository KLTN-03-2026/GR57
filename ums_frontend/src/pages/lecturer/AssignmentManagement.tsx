import { InstructorSidebar } from '@/components/layouts/InstructorSidebar';
import { InstructorHeader } from '@/components/layouts/InstructorHeader';
import {
  Plus, ClipboardList, FileText, ChevronDown, Eye, Trash2,
  AlertCircle, Search, Link
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks';
import AiAssistantButton from '@/imports/AiAssistantButton';
import lecturerApi, {
  LecturerClassSummaryResponseDTO, AssignmentResponseDTO
} from '@/api/lecturer.api';

export default function AssignmentManagement() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [classes, setClasses] = useState<LecturerClassSummaryResponseDTO[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [assignments, setAssignments] = useState<AssignmentResponseDTO[]>([]);
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingAssignments, setLoadingAssignments] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [creating, setCreating] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    lecturerApi.getClasses(user.id).then(data => {
      setClasses(data);
      if (data.length > 0) setSelectedClassId(data[0].lopHocPhanId);
    }).catch(console.error);
  }, [user?.id]);

  useEffect(() => {
    if (!selectedClassId || !user?.id) return;
    setLoadingAssignments(true);
    lecturerApi.getAssignments(selectedClassId, user.id)
      .then(setAssignments)
      .catch(console.error)
      .finally(() => setLoadingAssignments(false));
  }, [selectedClassId, user?.id]);

  const filtered = assignments.filter(a =>
    a.tieuDe.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.moTa || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !selectedClassId || !title.trim() || !fileUrl.trim()) return;
    setCreating(true);
    try {
      const res = await lecturerApi.createAssignment(user.id, {
        lopHocPhanId: selectedClassId,
        tieuDe: title.trim(),
        moTa: description.trim() || undefined,
        fileExerciseUrl: fileUrl.trim(),
      });
      setAssignments(prev => [res, ...prev]);
      setTitle('');
      setDescription('');
      setFileUrl('');
      setActiveTab('list');
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId || !user?.id) return;
    setDeleting(true);
    try {
      await lecturerApi.deleteAssignment(deleteId, user.id);
      setAssignments(prev => prev.filter(a => a.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div className="flex h-screen bg-gray-50">
      <InstructorSidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <InstructorHeader title="Quản lý bài tập" />
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Quản lý bài tập</h2>
                <p className="text-gray-600 mt-1">Tạo và theo dõi bài tập của sinh viên</p>
              </div>
              <div className="bg-white rounded-xl px-4 py-3 border border-gray-200 shadow-sm">
                <p className="text-sm text-gray-600">Tổng bài tập</p>
                <p className="text-2xl font-bold text-blue-600">{assignments.length}</p>
              </div>
            </div>

            {/* Tab */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 flex gap-2">
              {[
                { key: 'list', label: 'Danh sách bài tập', Icon: ClipboardList },
                { key: 'create', label: 'Tạo bài mới', Icon: Plus },
              ].map(({ key, label, Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as 'list' | 'create')}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    activeTab === key ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </button>
              ))}
            </div>

            {activeTab === 'list' ? (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Chọn lớp học phần</label>
                      <div className="relative">
                        <select
                          value={selectedClassId}
                          onChange={e => setSelectedClassId(e.target.value)}
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Tìm theo tên bài tập..."
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                        <tr>
                          {['Tiêu đề', 'Mô tả', 'Bài nộp', 'Ngày tạo', 'Thao tác'].map(h => (
                            <th key={h} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {loadingAssignments ? (
                          <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">Đang tải...</td></tr>
                        ) : filtered.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center">
                              <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                              <p className="text-gray-500">Chưa có bài tập nào</p>
                            </td>
                          </tr>
                        ) : filtered.map(a => (
                          <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-semibold text-gray-900">{a.tieuDe}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{a.moTa || '–'}</td>
                            <td className="px-6 py-4 text-gray-700">{a.submissionCount}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{formatDate(a.createdAt)}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => navigate(`/lecture/assignments/${a.id}/submissions?classId=${selectedClassId}`)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Xem bài nộp"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                {a.fileExerciseUrl && (
                                  <a
                                    href={a.fileExerciseUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                    title="Xem file đề"
                                  >
                                    <FileText className="w-4 h-4" />
                                  </a>
                                )}
                                <button
                                  onClick={() => setDeleteId(a.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Xóa"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <form onSubmit={handleCreate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chọn lớp học phần <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={selectedClassId}
                        onChange={e => setSelectedClassId(e.target.value)}
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiêu đề <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="VD: Bài tập tuần 5 - React Hooks"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                    <textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Nhập mô tả chi tiết về bài tập..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL file bài tập <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="url"
                        value={fileUrl}
                        onChange={e => setFileUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Nhập URL Google Drive, OneDrive, hoặc link trực tiếp đến file đề bài</p>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={creating}
                      className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                    >
                      {creating ? 'Đang tạo...' : 'Tạo bài tập'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setTitle(''); setDescription(''); setFileUrl(''); }}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Xóa form
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Xác nhận xóa</h3>
            </div>
            <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn xóa bài tập này?</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Hủy</button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        className="fixed bottom-8 right-8 w-16 h-16 hover:scale-110 transition-transform duration-200 z-50"
        aria-label="AI Assistant"
      >
        <AiAssistantButton />
      </button>
    </div>
  );
}
