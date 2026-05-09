import { useState } from 'react';
import { AdminSidebar } from '@/components/layouts/AdminSidebar';
import { AdminHeader } from '@/components/layouts/AdminHeader';
import { Users, Search, Plus, Trash2, X, AlertCircle, CheckCircle, Eye, Clock, MapPin } from 'lucide-react';
import AiAssistantButton from '@/imports/AiAssistantButton-4-13343';
import { useFetch, useSubmit } from '@/hooks/useFetch';
import * as lopHocPhanApi from '@/api/lop-hoc-phan.api';
import * as lichApi from '@/api/lich.api';
import type { LopHocPhanItem, CreateLopHocPhanRequest } from '@/api/lop-hoc-phan.api';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
export default function AdminClassesPage() {
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState<LopHocPhanItem | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [form, setForm] = useState({
    maLopHocPhan: '',
    soLuongToiDa: 30,
    trangThai: 'OPEN' as LopHocPhanItem['trangThai'],
    hanDangKy: '',
    hanHuy: '',
    hocKiId: '',
    monHocId: ''
  });

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Fetch lớp học phần
  const { data: classes = [], loading, refetch: refetchClasses } = useFetch(
    () => lopHocPhanApi.getLopHocPhan(),
    { onError: (msg) => addToast(msg, 'error') }
  );

  // Fetch lịch học của lớp được chọn
  const { data: schedules } = useFetch(
    () => selectedClass ? lichApi.getLichByLopHocPhan(selectedClass.id) : Promise.resolve([]),
    { onError: (msg) => addToast(msg, 'error') }
  );

  const filtered = classes.filter(item =>
    item.maLopHocPhan.toLowerCase().includes(search.toLowerCase()) ||
    item.tenMonHoc.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    if (status === 'FULL' || status === 'DA_KET_THUC') return 'bg-red-100 text-red-800';
    if (status === 'CLOSED') return 'bg-gray-100 text-gray-800';
    if (status === 'CANCELLED') return 'bg-orange-100 text-orange-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusLabel = (status: string) => {
    if (status === 'FULL' || status === 'DA_KET_THUC') return 'Đủ sĩ số / Đã kết thúc';
    if (status === 'CLOSED') return 'Đóng';
    if (status === 'CANCELLED') return 'Hủy';
    if (status === 'DANG_HOC') return 'Đang học';
    return 'Mở đăng ký';
  };

  const calculateFillPercentage = (enrolled: number, capacity: number) => {
    return Math.round((enrolled / capacity) * 100);
  };

  const { submit: submitCreate, isSubmitting: isCreating } = useSubmit<CreateLopHocPhanRequest>(
    async (data) => {
      await lopHocPhanApi.createLopHocPhan(data);
      addToast('Tạo lớp học phần thành công!', 'success');
      setIsAddOpen(false);
      await refetchClasses();
    },
    { onError: (msg) => addToast(msg, 'error') }
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.maLopHocPhan.trim()) {
      addToast('Vui lòng nhập mã lớp học phần', 'error');
      return;
    }
    await submitCreate(form);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa lớp học phần này?')) return;
    try {
      await lopHocPhanApi.deleteLopHocPhan(id);
      addToast('Xóa thành công!', 'success');
      await refetchClasses();
    } catch (err: any) {
      addToast(err?.response?.data?.message || 'Lỗi khi xóa', 'error');
    }
  };

  const handleViewDetail = (item: LopHocPhanItem) => {
    setSelectedClass(item);
    setIsDetailOpen(true);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar activeMenu="classes" />
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        <AdminHeader title="Lớp học phần & Lịch học" />
        <div className="flex-1 overflow-auto">
          <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <p className="text-sm text-slate-500">Lớp đang mở</p>
                <p className="text-2xl font-bold text-blue-600">
                  {classes.filter(c => c.trangThai === 'OPEN').length}
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <p className="text-sm text-slate-500">Lớp đủ sĩ số</p>
                <p className="text-2xl font-bold text-red-600">
                  {classes.filter(c => c.trangThai === 'FULL').length}
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <p className="text-sm text-slate-500">Tổng sĩ số đăng ký</p>
                <p className="text-2xl font-bold text-green-600">
                  {classes.reduce((sum, c) => sum + c.soLuongDaDangKy, 0)}
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <p className="text-sm text-slate-500">Tổng sĩ số tối đa</p>
                <p className="text-2xl font-bold text-slate-600">
                  {classes.reduce((sum, c) => sum + c.soLuongToiDa, 0)}
                </p>
              </div>
            </div>

            {/* Search & Add */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 flex gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm mã lớp, môn học..."
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => setIsAddOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-5 h-5" /> Tạo lớp
              </button>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Đang tải dữ liệu...</p>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-blue-600 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Mã lớp</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Môn học</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Sĩ số</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Lấp đầy</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Hạn ĐK</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Trạng thái</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filtered.map((item) => {
                        const fillPercent = calculateFillPercentage(item.soLuongDaDangKy, item.soLuongToiDa);
                        return (
                          <tr key={item.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 font-semibold text-blue-600">{item.maLopHocPhan}</td>
                            <td className="px-6 py-4">
                              <div className="font-medium text-slate-900">{item.tenMonHoc}</div>
                              <div className="text-xs text-slate-500">{item.soTinChi} tín chỉ</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4 text-slate-500" />
                                <span className="text-sm">{item.soLuongDaDangKy}/{item.soLuongToiDa}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="w-full bg-slate-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all ${fillPercent >= 100 ? 'bg-red-500' : fillPercent >= 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                  style={{ width: `${Math.min(fillPercent, 100)}%` }}
                                />
                              </div>
                              <span className="text-xs text-slate-500 mt-1">{fillPercent}%</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              {new Date(item.hanDangKy).toLocaleDateString('vi-VN')}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.trangThai)}`}>
                                {getStatusLabel(item.trangThai)}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleViewDetail(item)}
                                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                  title="Xem chi tiết"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                  title="Xóa"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
            <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Tạo lớp học phần</h2>
              <button onClick={() => setIsAddOpen(false)} className="p-1 hover:bg-white/20 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form className="p-6 space-y-4" onSubmit={handleCreate}>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Mã lớp <span className="text-red-500">*</span></label>
                <input
                  required
                  value={form.maLopHocPhan}
                  onChange={(e) => setForm({ ...form, maLopHocPhan: e.target.value })}
                  placeholder="VD: SE001"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Sĩ số tối đa <span className="text-red-500">*</span></label>
                <input
                  required
                  type="number"
                  min="1"
                  value={form.soLuongToiDa}
                  onChange={(e) => setForm({ ...form, soLuongToiDa: parseInt(e.target.value) })}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Hạn đăng ký <span className="text-red-500">*</span></label>
                  <input
                    required
                    type="datetime-local"
                    value={form.hanDangKy}
                    onChange={(e) => setForm({ ...form, hanDangKy: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Hạn hủy <span className="text-red-500">*</span></label>
                  <input
                    required
                    type="datetime-local"
                    value={form.hanHuy}
                    onChange={(e) => setForm({ ...form, hanHuy: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">ID Học kỳ <span className="text-red-500">*</span></label>
                <input
                  required
                  value={form.hocKiId}
                  onChange={(e) => setForm({ ...form, hocKiId: e.target.value })}
                  placeholder="ID học kỳ"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">ID Môn học <span className="text-red-500">*</span></label>
                <input
                  required
                  value={form.monHocId}
                  onChange={(e) => setForm({ ...form, monHocId: e.target.value })}
                  placeholder="ID môn học"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button type="button" onClick={() => setIsAddOpen(false)} className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50">Hủy</button>
                <button type="submit" disabled={isCreating} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                  {isCreating ? 'Đang tạo...' : 'Tạo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {isDetailOpen && selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
              <h2 className="text-xl font-bold">{selectedClass.maLopHocPhan} — {selectedClass.tenMonHoc}</h2>
              <button onClick={() => setIsDetailOpen(false)} className="p-1 hover:bg-white/20 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-auto space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-slate-500">Môn học:</span> <span className="font-medium">{selectedClass.tenMonHoc} ({selectedClass.maMonHoc})</span></div>
                <div><span className="text-slate-500">Tín chỉ:</span> <span className="font-medium">{selectedClass.soTinChi}</span></div>
                <div><span className="text-slate-500">Học kỳ:</span> <span className="font-medium">{selectedClass.tenHocKi}</span></div>
                <div><span className="text-slate-500">Sĩ số:</span> <span className="font-medium">{selectedClass.soLuongDaDangKy}/{selectedClass.soLuongToiDa}</span></div>
                <div><span className="text-slate-500">Hạn đăng ký:</span> <span className="font-medium">{new Date(selectedClass.hanDangKy).toLocaleDateString('vi-VN')}</span></div>
                <div><span className="text-slate-500">Hạn hủy:</span> <span className="font-medium">{new Date(selectedClass.hanHuy).toLocaleDateString('vi-VN')}</span></div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Lịch học</h3>
                {(schedules ?? []).length === 0 ? (
                  <p className="text-slate-500 text-sm">Chưa có lịch học.</p>
                ) : (
                  <div className="space-y-2">
                    {(schedules ?? []).map(s => (
                      <div key={s.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg text-sm">
                        <div className="flex items-center gap-1 text-slate-600">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(s.ngayHoc).toLocaleDateString('vi-VN')}</span>
                          {s.gioHocData && <span>— {s.gioHocData.gioTheBat} → {s.gioHocData.gioKetThuc}</span>}
                        </div>
                        {s.phongData && (
                          <div className="flex items-center gap-1 text-slate-600">
                            <MapPin className="w-4 h-4" />
                            <span>{s.phongData.maPhong} {s.phongData.tenPhong && `(${s.phongData.tenPhong})`}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed bottom-24 right-8 space-y-3 z-40">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white font-medium ${toast.type === 'success' ? 'bg-green-500' : toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}
          >
            {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
            {toast.message}
          </div>
        ))}
      </div>

      <button className="fixed bottom-8 right-8 w-16 h-16 z-50 hover:scale-110 transition-transform" aria-label="AI Assistant">
        <AiAssistantButton />
      </button>
    </div>
  );
}