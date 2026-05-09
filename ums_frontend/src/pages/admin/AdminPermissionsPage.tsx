import { AdminSidebar } from '@/components/layouts/AdminSidebar';
import { AdminHeader } from '@/components/layouts/AdminHeader';
import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, Search, Lock, AlertCircle, CheckCircle, Upload } from 'lucide-react';
import AiAssistantButton from '@/imports/AiAssistantButton-4-13343';
import type { PermissionsItem } from '@/api/permissions.api';
import * as permissionsApi from '@/api/permissions.api';

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
}

export default function AdminPermissionsPage() {
    const [permissions, setPermissions] = useState<PermissionsItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [toasts, setToasts] = useState<Toast[]>([]);

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selected, setSelected] = useState<PermissionsItem | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const [form, setForm] = useState({
        maPermissions: '',
        moTa: ''
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
            const data = await permissionsApi.getAllPermissions();
            setPermissions(data || []);
        } catch (err) {
            console.error(err);
            addToast('Lỗi khi tải dữ liệu quyền hạn', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetch(); }, []);

    const filtered = permissions.filter(p =>
        p.maPermissions?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.moTa?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openAdd = () => {
        setForm({ maPermissions: '', moTa: '' });
        setIsAddOpen(true);
    };

    const openEdit = (item: PermissionsItem) => {
        setSelected(item);
        setForm({
            maPermissions: item.maPermissions,
            moTa: item.moTa || ''
        });
        setIsEditOpen(true);
    };

    const validateForm = () => {
        if (!form.maPermissions.trim()) {
            addToast('Vui lòng nhập mã quyền', 'error');
            return false;
        }
        return true;
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setIsSubmitting(true);
            await permissionsApi.createPermission(form);
            addToast('Thêm quyền hạn thành công!', 'success');
            setIsAddOpen(false);
            await fetch();
        } catch (err) {
            console.error(err);
            addToast('Lỗi khi thêm quyền hạn', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selected) return;
        if (!validateForm()) return;

        try {
            setIsSubmitting(true);
            await permissionsApi.updatePermission(selected.id, form);
            addToast('Cập nhật quyền hạn thành công!', 'success');
            setIsEditOpen(false);
            setSelected(null);
            await fetch();
        } catch (err) {
            console.error(err);
            addToast('Lỗi khi cập nhật quyền hạn', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa quyền hạn này? Hành động này không thể hoàn tác.')) return;
        try {
            await permissionsApi.deletePermission(id);
            addToast('Xóa quyền hạn thành công!', 'success');
            await fetch();
        } catch (err) {
            console.error(err);
            addToast('Lỗi khi xóa quyền hạn', 'error');
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith('.xlsx')) {
            addToast('Vui lòng chọn file Excel (.xlsx)', 'error');
            return;
        }

        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append('file', file);
            await permissionsApi.importFromExcel(formData);
            addToast('Import dữ liệu từ Excel thành công!', 'success');
            await fetch();
        } catch (err) {
            console.error(err);
            addToast('Lỗi khi import dữ liệu từ Excel', 'error');
        } finally {
            setIsUploading(false);
            e.target.value = '';
        }
    };

    return (
        <div className="flex h-screen bg-slate-50">
            <AdminSidebar activeMenu="permissions" />
            <div className="flex-1 ml-64 flex flex-col overflow-hidden">
                <AdminHeader title="Quản lý Quyền Hạn" />
                <div className="flex-1 overflow-auto">
                    <div className="p-6 max-w-7xl mx-auto space-y-6">
                        {/* Search and Add Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="relative flex-1 max-w-md w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Tìm kiếm mã hoặc tên quyền..."
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <div className="flex gap-2">
                                <label className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 bg-white text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-medium cursor-pointer whitespace-nowrap">
                                    <Upload className="w-5 h-5" /> Import Excel
                                    <input
                                        type="file"
                                        accept=".xlsx"
                                        onChange={handleFileUpload}
                                        disabled={isUploading}
                                        className="hidden"
                                    />
                                </label>
                                <button
                                    onClick={openAdd}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium whitespace-nowrap"
                                >
                                    <Plus className="w-5 h-5" /> Thêm Quyền
                                </button>
                            </div>
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
                                                <th className="px-6 py-4 text-left text-sm font-semibold">Mã Quyền</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold">Mô Tả</th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold">Thao Tác</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200">
                                            {filtered.map((p) => (
                                                <tr key={p.id} className="hover:bg-blue-50 transition-colors">
                                                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                                                        <div className="flex items-center gap-2">
                                                            <Lock className="w-4 h-4 text-blue-600" />
                                                            {p.maPermissions}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-600">{p.moTa || '-'}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={() => openEdit(p)}
                                                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                                title="Chỉnh sửa"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(p.id)}
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
                                                    <td colSpan={3} className="px-6 py-16">
                                                        <div className="flex flex-col items-center gap-3">
                                                            <div className="rounded-full bg-slate-100 p-4">
                                                                <Lock className="w-8 h-8 text-slate-400" />
                                                            </div>
                                                            <p className="text-lg font-semibold text-slate-900">
                                                                {searchQuery ? 'Không tìm thấy quyền hạn' : 'Chưa có quyền hạn nào'}
                                                            </p>
                                                            <p className="text-sm text-slate-500">
                                                                {searchQuery ? 'Thử tìm kiếm với từ khóa khác' : 'Thêm quyền hạn mới để bắt đầu'}
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
                        {!loading && permissions.length > 0 && (
                            <div className="flex items-center justify-between px-6 py-3 bg-slate-50 rounded-lg border border-slate-200">
                                <p className="text-sm text-slate-600">
                                    Hiển thị <span className="font-semibold text-slate-900">{filtered.length}</span> / <span className="font-semibold text-slate-900">{permissions.length}</span> quyền hạn
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Modal */}
            {isAddOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold flex items-center gap-2"><Plus className="w-6 h-6" /> Thêm Quyền Hạn</h2>
                            <button
                                onClick={() => setIsAddOpen(false)}
                                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form className="p-6 space-y-4" onSubmit={handleCreate}>
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">
                                    Mã quyền <span className="text-red-500">*</span>
                                </label>
                                <input
                                    required
                                    value={form.maPermissions}
                                    onChange={(e) => setForm({ ...form, maPermissions: e.target.value })}
                                    placeholder="VD: CREATE_USER, EDIT_ROLE, DELETE_PERMISSION"
                                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">Mô tả</label>
                                <textarea
                                    value={form.moTa}
                                    onChange={(e) => setForm({ ...form, moTa: e.target.value })}
                                    placeholder="Nhập mô tả về quyền hạn..."
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
                                    {isSubmitting ? 'Đang thêm...' : 'Thêm Quyền'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditOpen && selected && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold flex items-center gap-2"><Edit className="w-6 h-6" /> Chỉnh Sửa Quyền Hạn</h2>
                            <button
                                onClick={() => setIsEditOpen(false)}
                                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form className="p-6 space-y-4" onSubmit={handleUpdate}>
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">
                                    Mã quyền <span className="text-red-500">*</span>
                                </label>
                                <input
                                    disabled
                                    value={form.maPermissions}
                                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg bg-slate-100 text-slate-600 cursor-not-allowed"
                                />
                                <p className="text-xs text-slate-500 mt-1">Không thể thay đổi mã quyền</p>
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
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white font-medium ${toast.type === 'success' ? 'bg-green-500' :
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
