import { AdminSidebar } from '@/components/layouts/AdminSidebar';
import { AdminHeader } from '@/components/layouts/AdminHeader';
import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, Search } from 'lucide-react';
import AiAssistantButton from '@/imports/AiAssistantButton-4-13343';
import type { SemesterItem } from '@/types';
import * as hocKiApi from '@/api/hocki.api';

interface Toast { id: string; message: string; type: 'success' | 'error' | 'info'; }

function parseBackendDateToInput(dateStr?: string) {
    if (!dateStr) return '';
    const parts = dateStr.split(' ');
    const datePart = parts[0]; // dd/MM/yyyy or ISO
    if (datePart.includes('/')) {
        const [d, m, y] = datePart.split('/');
        return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    }
    const dt = new Date(dateStr);
    if (!isNaN(dt.getTime())) {
        const y = dt.getFullYear();
        const m = String(dt.getMonth() + 1).padStart(2, '0');
        const d = String(dt.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }
    return '';
}

function formatToBackendDateTimeFromDateInput(value: string) {
    if (!value) return '';
    const [y, m, d] = value.split('-');
    return `${d}/${m}/${y} 00:00:00`;
}

export default function AdminSemestersPage() {
    const [items, setItems] = useState<SemesterItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [toasts, setToasts] = useState<Toast[]>([]);

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selected, setSelected] = useState<SemesterItem | null>(null);

    const [form, setForm] = useState({ maHocKi: '', tenHocKi: '', ngayBatDau: '', ngayKetThuc: '' });

    const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        const id = Date.now().toString();
        setToasts(p => [...p, { id, message, type }]);
        setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3200);
    };

    const fetch = async () => {
        try {
            setLoading(true);
            const data = await hocKiApi.getAllHocKi();
            setItems(data || []);
        } catch (err) {
            console.error(err);
            addToast('Lỗi khi tải học kỳ', 'error');
        } finally { setLoading(false); }
    };

    useEffect(() => { fetch(); }, []);

    const filtered = items.filter(i => i.maHocKi?.toLowerCase().includes(searchQuery.toLowerCase()) || i.tenHocKi?.toLowerCase().includes(searchQuery.toLowerCase()));

    const openAdd = () => { setForm({ maHocKi: '', tenHocKi: '', ngayBatDau: '', ngayKetThuc: '' }); setIsAddOpen(true); };
    const openEdit = (item: SemesterItem) => {
        setSelected(item);
        setForm({ maHocKi: item.maHocKi, tenHocKi: item.tenHocKi, ngayBatDau: parseBackendDateToInput(item.ngayBatDau), ngayKetThuc: parseBackendDateToInput(item.ngayKetThuc) });
        setIsEditOpen(true);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.maHocKi.trim() || !form.tenHocKi.trim()) { addToast('Vui lòng nhập mã và tên học kỳ', 'error'); return; }
        try {
            setIsSubmitting(true);
            await hocKiApi.createHocKi({ maHocKi: form.maHocKi, tenHocKi: form.tenHocKi, ngayBatDau: formatToBackendDateTimeFromDateInput(form.ngayBatDau), ngayKetThuc: formatToBackendDateTimeFromDateInput(form.ngayKetThuc) });
            addToast('Thêm học kỳ thành công', 'success');
            setIsAddOpen(false);
            await fetch();
        } catch (err) { console.error(err); addToast('Lỗi khi thêm học kỳ', 'error'); } finally { setIsSubmitting(false); }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selected) return;
        try {
            setIsSubmitting(true);
            await hocKiApi.updateHocKi(selected.id, { maHocKi: form.maHocKi, tenHocKi: form.tenHocKi, ngayBatDau: formatToBackendDateTimeFromDateInput(form.ngayBatDau), ngayKetThuc: formatToBackendDateTimeFromDateInput(form.ngayKetThuc) });
            addToast('Cập nhật học kỳ thành công', 'success');
            setIsEditOpen(false);
            setSelected(null);
            await fetch();
        } catch (err) { console.error(err); addToast('Lỗi khi cập nhật học kỳ', 'error'); } finally { setIsSubmitting(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa học kỳ này?')) return;
        try { await hocKiApi.deleteHocKi(id); addToast('Xóa học kỳ thành công', 'success'); await fetch(); } catch (err) { console.error(err); addToast('Lỗi khi xóa học kỳ', 'error'); }
    };

    return (
        <div className="flex h-screen bg-slate-50">
            <AdminSidebar activeMenu="semesters" />
            <div className="flex-1 ml-64 flex flex-col overflow-hidden">
                <AdminHeader title="Quản lý Học kỳ" />
                <div className="flex-1 overflow-auto">
                    <div className="p-6 max-w-7xl mx-auto space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="relative flex-1 max-w-md w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Tìm mã hoặc tên học kỳ..." className="w-full pl-10 pr-4 py-2.5 border rounded-lg" />
                            </div>
                            <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg"><Plus className="w-5 h-5" /> Thêm Học kỳ</button>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">Mã</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">Tên</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">Bắt đầu</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">Kết thúc</th>
                                            <th className="px-6 py-4 text-center text-sm font-semibold">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {filtered.map(i => (
                                            <tr key={i.id} className="hover:bg-slate-50">
                                                <td className="px-6 py-4 font-medium">{i.maHocKi}</td>
                                                <td className="px-6 py-4">{i.tenHocKi}</td>
                                                <td className="px-6 py-4">{i.ngayBatDau || '-'}</td>
                                                <td className="px-6 py-4">{i.ngayKetThuc || '-'}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button onClick={() => openEdit(i)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                                                        <button onClick={() => handleDelete(i.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {!loading && filtered.length === 0 && (
                                            <tr><td colSpan={5} className="px-6 py-16 text-center text-slate-500">Chưa có học kỳ nào</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Modal */}
            {isAddOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold"><Plus className="w-6 h-6 inline-block mr-2" /> Thêm Học kỳ</h2>
                            <button onClick={() => setIsAddOpen(false)} className="p-1 hover:bg-white/20 rounded-lg"><X className="w-6 h-6" /></button>
                        </div>
                        <form className="p-6 space-y-4" onSubmit={handleCreate}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Mã học kỳ <span className="text-red-500">*</span></label>
                                    <input required value={form.maHocKi} onChange={e => setForm({ ...form, maHocKi: e.target.value })} className="w-full px-3 py-2.5 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Tên học kỳ <span className="text-red-500">*</span></label>
                                    <input required value={form.tenHocKi} onChange={e => setForm({ ...form, tenHocKi: e.target.value })} className="w-full px-3 py-2.5 border rounded-lg" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Ngày bắt đầu</label>
                                    <input type="date" value={form.ngayBatDau} onChange={e => setForm({ ...form, ngayBatDau: e.target.value })} className="w-full px-3 py-2.5 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Ngày kết thúc</label>
                                    <input type="date" value={form.ngayKetThuc} onChange={e => setForm({ ...form, ngayKetThuc: e.target.value })} className="w-full px-3 py-2.5 border rounded-lg" />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4 border-t border-slate-200">
                                <button type="button" onClick={() => setIsAddOpen(false)} className="flex-1 px-4 py-2.5 border rounded-lg">Hủy</button>
                                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg">{isSubmitting ? 'Đang thêm...' : 'Thêm'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditOpen && selected && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold"><Edit className="w-6 h-6 inline-block mr-2" /> Chỉnh sửa Học kỳ</h2>
                            <button onClick={() => setIsEditOpen(false)} className="p-1 hover:bg-white/20 rounded-lg"><X className="w-6 h-6" /></button>
                        </div>
                        <form className="p-6 space-y-4" onSubmit={handleUpdate}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Mã học kỳ</label>
                                    <input required value={form.maHocKi} onChange={e => setForm({ ...form, maHocKi: e.target.value })} className="w-full px-3 py-2.5 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Tên học kỳ</label>
                                    <input required value={form.tenHocKi} onChange={e => setForm({ ...form, tenHocKi: e.target.value })} className="w-full px-3 py-2.5 border rounded-lg" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Ngày bắt đầu</label>
                                    <input type="date" value={form.ngayBatDau} onChange={e => setForm({ ...form, ngayBatDau: e.target.value })} className="w-full px-3 py-2.5 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Ngày kết thúc</label>
                                    <input type="date" value={form.ngayKetThuc} onChange={e => setForm({ ...form, ngayKetThuc: e.target.value })} className="w-full px-3 py-2.5 border rounded-lg" />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4 border-t border-slate-200">
                                <button type="button" onClick={() => setIsEditOpen(false)} className="flex-1 px-4 py-2.5 border rounded-lg">Hủy</button>
                                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg">{isSubmitting ? 'Đang lưu...' : 'Lưu'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <button className="fixed bottom-8 right-8 w-16 h-16 z-50 hover:scale-110 transition-transform" aria-label="AI Assistant"><AiAssistantButton /></button>

            <div className="fixed top-6 right-6 space-y-2 z-50">
                {toasts.map(t => (<div key={t.id} className={`px-4 py-2 rounded-lg text-sm ${t.type === 'success' ? 'bg-emerald-600 text-white' : t.type === 'error' ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-900'}`}>{t.message}</div>))}
            </div>
        </div>
    );
}
