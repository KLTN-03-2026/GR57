import { InstructorSidebar } from '@/components/layouts/InstructorSidebar';
import { InstructorHeader } from '@/components/layouts/InstructorHeader';
import {
  File, FileText, Image as ImageIcon, Video, Archive,
  Edit, Trash2, Eye, ChevronDown, X, Check, AlertCircle, Plus, Link
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks';
import AiAssistantButton from '@/imports/AiAssistantButton';
import lecturerApi, {
  LecturerClassSummaryResponseDTO, DocumentResponseDTO, DocumentRequestDTO
} from '@/api/lecturer.api';

export default function DocumentManagement() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<LecturerClassSummaryResponseDTO[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [documents, setDocuments] = useState<DocumentResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);
  const [addData, setAddData] = useState<Partial<DocumentRequestDTO>>({});
  const [adding, setAdding] = useState(false);

  const [editDoc, setEditDoc] = useState<DocumentResponseDTO | null>(null);
  const [editData, setEditData] = useState<Partial<DocumentRequestDTO>>({});
  const [editing, setEditing] = useState(false);

  const [deleteDocId, setDeleteDocId] = useState<string | null>(null);
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
    setLoading(true);
    lecturerApi.getDocuments(selectedClassId, user.id)
      .then(setDocuments)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedClassId, user?.id]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !selectedClassId || !addData.tenTaiLieu || !addData.fileTaiLieuUrl) return;
    setAdding(true);
    try {
      const doc = await lecturerApi.createDocument(user.id, {
        lopHocPhanId: selectedClassId,
        tenTaiLieu: addData.tenTaiLieu,
        moTa: addData.moTa,
        fileTaiLieuUrl: addData.fileTaiLieuUrl,
        loaiTaiLieu: addData.loaiTaiLieu,
      });
      setDocuments(prev => [doc, ...prev]);
      setShowAddForm(false);
      setAddData({});
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const handleEdit = (doc: DocumentResponseDTO) => {
    setEditDoc(doc);
    setEditData({ tenTaiLieu: doc.tenTaiLieu, moTa: doc.moTa, fileTaiLieuUrl: doc.fileTaiLieuUrl, loaiTaiLieu: doc.loaiTaiLieu });
  };

  const confirmEdit = async () => {
    if (!editDoc || !user?.id || !editData.tenTaiLieu || !editData.fileTaiLieuUrl) return;
    setEditing(true);
    try {
      const updated = await lecturerApi.updateDocument(editDoc.id, user.id, {
        lopHocPhanId: editDoc.lopHocPhanId,
        tenTaiLieu: editData.tenTaiLieu,
        moTa: editData.moTa,
        fileTaiLieuUrl: editData.fileTaiLieuUrl,
        loaiTaiLieu: editData.loaiTaiLieu,
      });
      setDocuments(prev => prev.map(d => d.id === editDoc.id ? updated : d));
      setEditDoc(null);
    } catch (err) {
      console.error(err);
    } finally {
      setEditing(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteDocId || !user?.id) return;
    setDeleting(true);
    try {
      await lecturerApi.deleteDocument(deleteDocId, user.id);
      setDocuments(prev => prev.filter(d => d.id !== deleteDocId));
      setDeleteDocId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const getFileIcon = (loai: string) => {
    const t = (loai || '').toLowerCase();
    if (t.includes('pdf')) return <FileText className="w-8 h-8 text-red-500" />;
    if (t.includes('video') || t.includes('mp4')) return <Video className="w-8 h-8 text-pink-500" />;
    if (t.includes('image') || t.includes('jpg') || t.includes('png')) return <ImageIcon className="w-8 h-8 text-purple-500" />;
    if (t.includes('zip') || t.includes('rar')) return <Archive className="w-8 h-8 text-gray-500" />;
    return <File className="w-8 h-8 text-blue-400" />;
  };

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div className="flex h-screen bg-gray-50">
      <InstructorSidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <InstructorHeader title="Quản lý tài liệu" />
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Quản lý tài liệu học tập</h2>
                <p className="text-gray-600 mt-1">Upload và quản lý tài liệu cho các lớp học phần</p>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                disabled={!selectedClassId}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
              >
                <Plus className="w-5 h-5" />
                Thêm tài liệu
              </button>
            </div>

            {/* Class filter */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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

            {/* Documents list */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Danh sách tài liệu ({documents.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <tr>
                      {['Tên tài liệu', 'Loại', 'Ngày đăng', 'Thao tác'].map(h => (
                        <th key={h} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loading ? (
                      <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">Đang tải...</td></tr>
                    ) : documents.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center">
                          <File className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                          <p className="text-gray-500">Chưa có tài liệu nào</p>
                        </td>
                      </tr>
                    ) : documents.map(doc => (
                      <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {getFileIcon(doc.loaiTaiLieu)}
                            <div>
                              <p className="font-medium text-gray-900">{doc.tenTaiLieu}</p>
                              {doc.moTa && <p className="text-sm text-gray-500">{doc.moTa}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{doc.loaiTaiLieu || '–'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(doc.ngayDang)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <a
                              href={doc.fileTaiLieuUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Xem"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => handleEdit(doc)}
                              className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteDocId(doc.id)}
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
        </div>
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Thêm tài liệu mới</h3>
              <button onClick={() => { setShowAddForm(false); setAddData({}); }} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên tài liệu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addData.tenTaiLieu || ''}
                  onChange={e => setAddData(p => ({ ...p, tenTaiLieu: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL tài liệu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="url"
                    value={addData.fileTaiLieuUrl || ''}
                    onChange={e => setAddData(p => ({ ...p, fileTaiLieuUrl: e.target.value }))}
                    placeholder="https://..."
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại tài liệu</label>
                <input
                  type="text"
                  value={addData.loaiTaiLieu || ''}
                  onChange={e => setAddData(p => ({ ...p, loaiTaiLieu: e.target.value }))}
                  placeholder="VD: PDF, Video, Slide..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  value={addData.moTa || ''}
                  onChange={e => setAddData(p => ({ ...p, moTa: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => { setShowAddForm(false); setAddData({}); }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={adding}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  {adding ? 'Đang thêm...' : 'Thêm tài liệu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editDoc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Chỉnh sửa tài liệu</h3>
              <button onClick={() => setEditDoc(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên tài liệu</label>
                <input
                  type="text"
                  value={editData.tenTaiLieu || ''}
                  onChange={e => setEditData(p => ({ ...p, tenTaiLieu: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL tài liệu</label>
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="url"
                    value={editData.fileTaiLieuUrl || ''}
                    onChange={e => setEditData(p => ({ ...p, fileTaiLieuUrl: e.target.value }))}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại tài liệu</label>
                <input
                  type="text"
                  value={editData.loaiTaiLieu || ''}
                  onChange={e => setEditData(p => ({ ...p, loaiTaiLieu: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  value={editData.moTa || ''}
                  onChange={e => setEditData(p => ({ ...p, moTa: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-4">
              <button onClick={() => setEditDoc(null)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Hủy</button>
              <button
                onClick={confirmEdit}
                disabled={editing}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                {editing ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteDocId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Xác nhận xóa</h3>
            </div>
            <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn xóa tài liệu này?</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteDocId(null)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Hủy</button>
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
