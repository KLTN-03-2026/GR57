import { AdminSidebar } from '@/components/layouts/AdminSidebar';
import { AdminHeader } from '@/components/layouts/AdminHeader';
import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, Search, Home, AlertCircle } from 'lucide-react';
import AiAssistantButton from '@/imports/AiAssistantButton-4-13343';
import type { RoomItem } from '@/types';
import * as phongApi from '@/api/phong.api';

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
}

export default function AdminRoomsPage() {
    const [rooms, setRooms] = useState<RoomItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [toasts, setToasts] = useState<Toast[]>([]);

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selected, setSelected] = useState<RoomItem | null>(null);

    const [form, setForm] = useState({
        maPhong: '',
        tenPhong: '',
        tinhTrang: '',
        toaNha: '',
        tang: '',
        moTa: '',
    });

    const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        const id = Date.now().toString();
        setToasts((p) => [...p, { id, message, type }]);
        setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
    };

    const fetch = async () => {
        try {
            setLoading(true);
            const data = await phongApi.getAllPhong();
            setRooms(data || []);
        } catch (err) {
            console.error(err);
            addToast('Lỗi khi tải danh sách phòng', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetch(); }, []);

    const filtered = rooms.filter(r =>
        r.maPhong?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.tenPhong?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openAdd = () => {
        setForm({ maPhong: '', tenPhong: '', tinhTrang: '', toaNha: '', tang: '', moTa: '' });
        setIsAddOpen(true);
    };

    const openEdit = (item: RoomItem) => {
        setSelected(item);
        setForm({
            maPhong: item.maPhong,
            tenPhong: item.tenPhong || '',
            tinhTrang: item.tinhTrang || '',
            toaNha: item.toaNha || '',
            tang: item.tang ? String(item.tang) : '',
            moTa: item.moTa || '',
        });
        setIsEditOpen(true);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.maPhong.trim()) { addToast('Vui lòng nhập mã phòng', 'error'); return; }
        try {
            setIsSubmitting(true);
            await phongApi.createPhong({
                maPhong: form.maPhong,
                tenPhong: form.tenPhong,
                tinhTrang: form.tinhTrang,
                toaNha: form.toaNha,
                tang: form.tang ? Number(form.tang) : undefined,
                moTa: form.moTa,
            });
            addToast('Thêm phòng thành công', 'success');
            setIsAddOpen(false);
            await fetch();
        } catch (err) {
            console.error(err);
            addToast('Lỗi khi thêm phòng', 'error');
        } finally { setIsSubmitting(false); }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selected) return;
        try {
            setIsSubmitting(true);
            await phongApi.updatePhong(selected.id, {
                maPhong: form.maPhong,
                tenPhong: form.tenPhong,
                tinhTrang: form.tinhTrang,
                toaNha: form.toaNha,
                tang: form.tang ? Number(form.tang) : undefined,
                moTa: form.moTa,
            });
            addToast('Cập nhật phòng thành công', 'success');
            setIsEditOpen(false);
            setSelected(null);
            await fetch();
        } catch (err) {
            console.error(err);
            addToast('Lỗi khi cập nhật phòng', 'error');
        } finally { setIsSubmitting(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa phòng này?')) return;
        try {
            await phongApi.deletePhong(id);
            addToast('Xóa phòng thành công', 'success');
            await fetch();
        } catch (err) {
            console.error(err);
            addToast('Lỗi khi xóa phòng', 'error');
        }
    };

    return (
        <div className="flex h-screen bg-slate-50">
            <AdminSidebar activeMenu="rooms" />
            <div className="flex-1 ml-64 flex flex-col overflow-hidden">
                <AdminHeader title="Quản lý Phòng" />
                <div className="flex-1 overflow-auto">
                    <div className="p-6 max-w-7xl mx-auto space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="relative flex-1 max-w-md w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Tìm mã hoặc tên phòng..." className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all">
                                <Plus className="w-5 h-5" /> Thêm Phòng
                            </button>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            {loading ? (
                                <div className="flex items-center justify-center h-64"><p className="text-slate-600">Đang tải dữ liệu...</p></div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-sm font-semibold">Mã phòng</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold">Tên phòng</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold">Tình trạng</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold">Tòa nhà</th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200">
                                            {filtered.map((r) => (
                                                <tr key={r.id} className="hover:bg-blue-50 transition-colors">
                                                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{r.maPhong}</td>
                                                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{r.tenPhong || '-'}</td>
                                                    <td className="px-6 py-4 text-sm text-slate-600">{r.tinhTrang || '-'}</td>
                                                    <td className="px-6 py-4 text-sm text-slate-600">{r.toaNha || '-'}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button onClick={() => openEdit(r)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"><Edit className="w-4 h-4" /></button>
                                                            <button onClick={() => handleDelete(r.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {!loading && filtered.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-16">
                                                        <div className="flex flex-col items-center gap-3">
                                                            <div className="rounded-full bg-slate-100 p-4"><Home className="w-8 h-8 text-slate-400" /></div>
                                                            <p className="text-lg font-semibold text-slate-900">{searchQuery ? 'Không tìm thấy phòng' : 'Chưa có phòng nào'}</p>
                                                            <p className="text-sm text-slate-500">{searchQuery ? 'Thử từ khóa khác' : 'Thêm phòng để bắt đầu'}</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
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
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold flex items-center gap-2"><Plus className="w-6 h-6" /> Thêm Phòng mới</h2>
                            <button onClick={() => setIsAddOpen(false)} className="p-1 hover:bg-white/20 rounded-lg"><X className="w-6 h-6" /></button>
                        </div>
                        <form className="p-6 space-y-4" onSubmit={handleCreate}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Mã phòng <span className="text-red-500">*</span></label>
                                    <input required value={form.maPhong} onChange={(e) => setForm({ ...form, maPhong: e.target.value })} className="w-full px-3 py-2.5 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Tên phòng</label>
                                    <input value={form.tenPhong} onChange={(e) => setForm({ ...form, tenPhong: e.target.value })} className="w-full px-3 py-2.5 border rounded-lg" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Tình trạng</label>
                                    <select value={form.tinhTrang} onChange={(e) => setForm({ ...form, tinhTrang: e.target.value })} className="w-full px-3 py-2.5 border rounded-lg">
                                        <option value="">Chọn tình trạng</option>
                                        <option value="DANG_SU_DUNG">Đang sử dụng</option>
                                        <option value="CHUA_SU_DUNG">Chưa sử dụng</option>
                                        <option value="DANG_SUA_CHUA">Đang sửa chữa</option>
                                        <option value="KHONG_SU_DUNG_NUA">Không sử dụng nữa</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Tòa nhà</label>
                                    <input value={form.toaNha} onChange={(e) => setForm({ ...form, toaNha: e.target.value })} className="w-full px-3 py-2.5 border rounded-lg" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">Tầng</label>
                                <input type="number" value={form.tang} onChange={(e) => setForm({ ...form, tang: e.target.value })} className="w-full px-3 py-2.5 border rounded-lg" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">Ghi chú</label>
                                <textarea value={form.moTa} onChange={(e) => setForm({ ...form, moTa: e.target.value })} rows={4} className="w-full px-3 py-2.5 border rounded-lg" />
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-slate-200">
                                <button type="button" onClick={() => setIsAddOpen(false)} className="flex-1 px-4 py-2.5 border rounded-lg">Hủy</button>
                                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg">{isSubmitting ? 'Đang thêm...' : 'Thêm Phòng'}</button>
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
                            <h2 className="text-xl font-bold flex items-center gap-2"><Edit className="w-6 h-6" /> Chỉnh sửa Phòng</h2>
                            <button onClick={() => setIsEditOpen(false)} className="p-1 hover:bg-white/20 rounded-lg"><X className="w-6 h-6" /></button>
                        </div>
                        <form className="p-6 space-y-4" onSubmit={handleUpdate}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Mã phòng</label>
                                    <input required value={form.maPhong} onChange={(e) => setForm({ ...form, maPhong: e.target.value })} className="w-full px-3 py-2.5 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Tên phòng</label>
                                    <input value={form.tenPhong} onChange={(e) => setForm({ ...form, tenPhong: e.target.value })} className="w-full px-3 py-2.5 border rounded-lg" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Tình trạng</label>
                                    <select value={form.tinhTrang} onChange={(e) => setForm({ ...form, tinhTrang: e.target.value })} className="w-full px-3 py-2.5 border rounded-lg">
                                        <option value="">Chọn tình trạng</option>
                                        <option value="DANG_SU_DUNG">Đang sử dụng</option>
                                        <option value="CHUA_SU_DUNG">Chưa sử dụng</option>
                                        <option value="DANG_SUA_CHUA">Đang sửa chữa</option>
                                        <option value="KHONG_SU_DUNG_NUA">Không sử dụng nữa</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Tòa nhà</label>
                                    <input value={form.toaNha} onChange={(e) => setForm({ ...form, toaNha: e.target.value })} className="w-full px-3 py-2.5 border rounded-lg" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">Tầng</label>
                                <input type="number" value={form.tang} onChange={(e) => setForm({ ...form, tang: e.target.value })} className="w-full px-3 py-2.5 border rounded-lg" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">Ghi chú</label>
                                <textarea value={form.moTa} onChange={(e) => setForm({ ...form, moTa: e.target.value })} rows={4} className="w-full px-3 py-2.5 border rounded-lg" />
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

            {/* Toasts */}
            <div className="fixed top-6 right-6 space-y-2 z-50">
                {toasts.map(t => (
                    <div key={t.id} className={`px-4 py-2 rounded-lg text-sm ${t.type === 'success' ? 'bg-emerald-600 text-white' : t.type === 'error' ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-900'}`}>
                        {t.message}
                    </div>
                ))}
            </div>

        </div>
    );
}
