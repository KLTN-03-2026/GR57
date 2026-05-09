import { AdminSidebar } from '@/components/layouts/AdminSidebar';
import { AdminHeader } from '@/components/layouts/AdminHeader';
import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, Search, Home, AlertCircle, CheckCircle, ChevronDown } from 'lucide-react';
import AiAssistantButton from '@/imports/AiAssistantButton-4-13343';
import type { SchoolItem } from '@/types';
import * as schoolApi from '@/api/school.api';

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
}

export default function AdminSchoolsPage() {
    const [schools, setSchools] = useState<SchoolItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [toasts, setToasts] = useState<Toast[]>([]);

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selected, setSelected] = useState<SchoolItem | null>(null);

    const [form, setForm] = useState({
        maTruong: '',
        tenTruong: '',
        diaChi: '',
        moTa: '',
        nguoiDaiDien: '',
        ngayThanhLap: ''
    });

    const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    const fetch = async () => {
        try {
            setLoading(true);
            const data = await schoolApi.getSchools();
            setSchools(data || []);
        } catch (err) {
            console.error(err);
            addToast('Lỗi khi tải dữ liệu trường', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetch(); }, []);

    const filtered = schools.filter(s =>
        s.maTruong?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tenTruong?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openAdd = () => {
        setForm({ maTruong: '', tenTruong: '', diaChi: '', moTa: '', nguoiDaiDien: '', ngayThanhLap: '' });
        setIsAddOpen(true);
    };

    const openEdit = (item: SchoolItem) => {
        setSelected(item);
        setForm({
            maTruong: item.maTruong,
            tenTruong: item.tenTruong || '',
            diaChi: item.diaChi || '',
            moTa: item.moTa || '',
            nguoiDaiDien: item.nguoiDaiDien || '',
            ngayThanhLap: item.ngayThanhLap || ''
        });
        setIsEditOpen(true);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.maTruong.trim() || !form.tenTruong.trim()) {
            addToast('Vui lòng nhập mã trường và tên trường', 'error');
            return;
        }
        try {
            setIsSubmitting(true);
            await schoolApi.createSchool(form);
            addToast('Thêm trường thành công!', 'success');
            setIsAddOpen(false);
            await fetch();
        } catch (err) {
            console.error(err);
            addToast('Lỗi khi thêm trường', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selected) return;
        if (!form.maTruong.trim() || !form.tenTruong.trim()) {
            addToast('Vui lòng nhập mã trường và tên trường', 'error');
            return;
        }
        try {
            setIsSubmitting(true);
            await schoolApi.updateSchool(selected.id, form);
            addToast('Cập nhật trường thành công!', 'success');
            setIsEditOpen(false);
            setSelected(null);
            await fetch();
        } catch (err) {
            console.error(err);
            addToast('Lỗi khi cập nhật trường', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa trường này? Hành động này không thể hoàn tác.')) return;
        try {
            await schoolApi.deleteSchool(id);
            addToast('Xóa trường thành công!', 'success');
            await fetch();
        } catch (err) {
            console.error(err);
            addToast('Lỗi khi xóa trường', 'error');
        }
    };

    return (
        <div className="flex h-screen bg-slate-50">
            <AdminSidebar activeMenu="schools" />
            <div className="flex-1 ml-64 flex flex-col overflow-hidden">
                <AdminHeader title="Quản lý Trường" />
                <div className="flex-1 overflow-auto">
                    <div className="p-6 max-w-7xl mx-auto space-y-6">
                        {/* Search and Add Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="relative flex-1 max-w-md w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Tìm kiếm mã hoặc tên trường..."
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <button
                                onClick={openAdd}
                                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium whitespace-nowrap"
                            >
                                <Plus className="w-5 h-5" /> Thêm Trường
                            </button>
                        </div>

                        {/* Table Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            {loading ? (
                                <div className="flex items-center justify-center h-96">
                                    <div className="text-center">
                                        <div className="inline-block mb-4">
                                            <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                                        </div>
                                        <p className="text-slate-600 font-medium">Đang tải dữ liệu...</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-sm font-semibold">Mã trường</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold">Tên trường</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold">Địa chỉ</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold">Người đại diện</th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200">
                                            {filtered.map((s) => (
                                                <tr key={s.id} className="hover:bg-blue-50 transition-colors">
                                                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{s.maTruong}</td>
                                                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{s.tenTruong}</td>
                                                    <td className="px-6 py-4 text-sm text-slate-600">{s.diaChi || '-'}</td>
                                                    <td className="px-6 py-4 text-sm text-slate-600">{s.nguoiDaiDien || '-'}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={() => openEdit(s)}
                                                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                                title="Chỉnh sửa"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(s.id)}
                                                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                                title="Xóa"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {!loading && filtered.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-16">
                                                        <div className="flex flex-col items-center gap-3">
                                                            <div className="rounded-full bg-slate-100 p-4">
                                                                <Home className="w-8 h-8 text-slate-400" />
                                                            </div>
                                                            <p className="text-lg font-semibold text-slate-900">
                                                                {searchQuery ? 'Không tìm thấy trường' : 'Chưa có trường nào'}
                                                            </p>
                                                            <p className="text-sm text-slate-500">
                                                                {searchQuery ? 'Thử tìm kiếm với từ khóa khác' : 'Thêm trường mới để bắt đầu'}
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Stats Footer */}
                        {!loading && schools.length > 0 && (
                            <div className="flex items-center justify-between px-6 py-3 bg-slate-50 rounded-lg border border-slate-200">
                                <p className="text-sm text-slate-600">
                                    Hiển thị <span className="font-semibold text-slate-900">{filtered.length}</span> / <span className="font-semibold text-slate-900">{schools.length}</span> trường
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Modal */}
            {isAddOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                            <h2 className="text-xl font-bold flex items-center gap-2"><Plus className="w-6 h-6" /> Thêm Trường Mới</h2>
                            <button
                                onClick={() => setIsAddOpen(false)}
                                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form className="p-6 space-y-4" onSubmit={handleCreate}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                                        Mã trường <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        required
                                        value={form.maTruong}
                                        onChange={(e) => setForm({ ...form, maTruong: e.target.value })}
                                        placeholder="VD: TH001"
                                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                                        Tên trường <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        required
                                        value={form.tenTruong}
                                        onChange={(e) => setForm({ ...form, tenTruong: e.target.value })}
                                        placeholder="VD: Trường Tiểu học Nguyễn Huệ"
                                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">Địa chỉ</label>
                                <input
                                    value={form.diaChi}
                                    onChange={(e) => setForm({ ...form, diaChi: e.target.value })}
                                    placeholder="VD: 123 Đường Lý Thái Tổ, Quận Hoàn Kiếm, Hà Nội"
                                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 mb-2">Người đại diện</label>
                                    <input
                                        value={form.nguoiDaiDien}
                                        onChange={(e) => setForm({ ...form, nguoiDaiDien: e.target.value })}
                                        placeholder="VD: Thầy Nguyễn Văn A"
                                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 mb-2">Ngày thành lập</label>
                                    <input
                                        type="date"
                                        value={form.ngayThanhLap}
                                        onChange={(e) => setForm({ ...form, ngayThanhLap: e.target.value })}
                                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">Mô tả</label>
                                <textarea
                                    value={form.moTa}
                                    onChange={(e) => setForm({ ...form, moTa: e.target.value })}
                                    placeholder="Nhập mô tả về trường..."
                                    rows={4}
                                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-slate-200">
                                <button
                                    type="button"
                                    onClick={() => setIsAddOpen(false)}
                                    className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium text-slate-700"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Đang thêm...' : 'Thêm Trường'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditOpen && selected && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                            <h2 className="text-xl font-bold flex items-center gap-2"><Edit className="w-6 h-6" /> Chỉnh Sửa Trường</h2>
                            <button
                                onClick={() => setIsEditOpen(false)}
                                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form className="p-6 space-y-4" onSubmit={handleUpdate}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                                        Mã trường <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        required
                                        value={form.maTruong}
                                        onChange={(e) => setForm({ ...form, maTruong: e.target.value })}
                                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                                        Tên trường <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        required
                                        value={form.tenTruong}
                                        onChange={(e) => setForm({ ...form, tenTruong: e.target.value })}
                                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">Địa chỉ</label>
                                <input
                                    value={form.diaChi}
                                    onChange={(e) => setForm({ ...form, diaChi: e.target.value })}
                                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 mb-2">Người đại diện</label>
                                    <input
                                        value={form.nguoiDaiDien}
                                        onChange={(e) => setForm({ ...form, nguoiDaiDien: e.target.value })}
                                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 mb-2">Ngày thành lập</label>
                                    <input
                                        type="date"
                                        value={form.ngayThanhLap}
                                        onChange={(e) => setForm({ ...form, ngayThanhLap: e.target.value })}
                                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">Mô tả</label>
                                <textarea
                                    value={form.moTa}
                                    onChange={(e) => setForm({ ...form, moTa: e.target.value })}
                                    rows={4}
                                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-slate-200">
                                <button
                                    type="button"
                                    onClick={() => setIsEditOpen(false)}
                                    className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium text-slate-700"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Toast Notifications */}
            <div className="fixed bottom-24 right-8 space-y-3 z-40">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white font-medium ${
                            toast.type === 'success' ? 'bg-green-500' :
                            toast.type === 'error' ? 'bg-red-500' :
                            'bg-blue-500'
                        }`}
                    >
                        {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
                        {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
                        {toast.message}
                    </div>
                ))}
            </div>

            {/* AI Assistant Button */}
            <button
                className="fixed bottom-8 right-8 w-16 h-16 z-50 hover:scale-110 transition-transform"
                aria-label="AI Assistant"
            >
                <AiAssistantButton />
            </button>
        </div>
    );
}