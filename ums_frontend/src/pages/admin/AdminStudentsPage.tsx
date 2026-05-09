import { useState } from 'react';
import { AdminSidebar } from '@/components/layouts/AdminSidebar';
import { AdminHeader } from '@/components/layouts/AdminHeader';
import { GraduationCap, Plus, Search, Edit, Trash2, X, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import AiAssistantButton from '@/imports/AiAssistantButton-4-13343';
import { useFetch } from '@/hooks/useFetch';
import * as hocVienApi from '@/api/hoc-vien.api';
import * as nganhApi from '@/api/nganh.api';
import type { HocVienResponse, CreateHocVienRequest, UpdateHocVienRequest } from '@/api/hoc-vien.api';

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error';
}

const EMPTY_USER = {
    userName: '', passWord: '', email: '', cccd: '', hoTen: '',
    diaChi: '', gioiTinh: 'NAM' as const, ngaySinh: '', soDienThoai: '',
    trangThai: true, ghiChu: '',
};

const EMPTY_HOCVIEN = { maHocVien: '', ngayNhapHoc: '', ngayTotNghiep: '', maNganh: '' };

export default function AdminStudentsPage() {
    const [search, setSearch] = useState('');
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selected, setSelected] = useState<HocVienResponse | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [userForm, setUserForm] = useState(EMPTY_USER);
    const [hvForm, setHvForm] = useState(EMPTY_HOCVIEN);

    const addToast = (message: string, type: 'success' | 'error' = 'success') => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
    };

    const { data: students, loading, refetch } = useFetch<HocVienResponse[]>(
        () => hocVienApi.getAllHocVien(),
        { onError: () => addToast('Lỗi khi tải danh sách học viên', 'error') }
    );

    const { data: nganhList } = useFetch<{ id: string; maNganh: string; tenNganh: string }[]>(
        () => nganhApi.getAllNganh(),
        {}
    );

    const filtered = (students ?? []).filter(s =>
        s.maHocVien.toLowerCase().includes(search.toLowerCase())
    );

    const openAdd = () => {
        setUserForm(EMPTY_USER);
        setHvForm(EMPTY_HOCVIEN);
        setShowPassword(false);
        setIsAddOpen(true);
    };

    const openEdit = (s: HocVienResponse) => {
        setSelected(s);
        setHvForm({
            maHocVien: s.maHocVien,
            ngayNhapHoc: s.ngayNhapHoc ?? '',
            ngayTotNghiep: s.ngayTotNghiep ?? '',
            maNganh: '',
        });
        setIsEditOpen(true);
    };

    const openDelete = (s: HocVienResponse) => {
        setSelected(s);
        setIsDeleteOpen(true);
    };

    const handleAdd = async () => {
        if (!userForm.userName || !userForm.passWord || !userForm.cccd || !userForm.hoTen || !hvForm.maHocVien || !hvForm.maNganh) {
            addToast('Vui lòng điền đầy đủ các trường bắt buộc', 'error');
            return;
        }
        setIsSubmitting(true);
        try {
            const payload: CreateHocVienRequest = {
                userDetails: {
                    ...userForm,
                    ngaySinh: userForm.ngaySinh || undefined,
                    diaChi: userForm.diaChi || undefined,
                    soDienThoai: userForm.soDienThoai || undefined,
                    ghiChu: userForm.ghiChu || undefined,
                },
                hocVienDetails: {
                    maHocVien: hvForm.maHocVien,
                    maNganh: hvForm.maNganh,
                    ngayNhapHoc: hvForm.ngayNhapHoc || undefined,
                    ngayTotNghiep: hvForm.ngayTotNghiep || undefined,
                },
            };
            await hocVienApi.createHocVien(payload);
            addToast('Thêm học viên thành công!');
            setIsAddOpen(false);
            await refetch();
        } catch {
            addToast('Lỗi khi thêm học viên', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = async () => {
        if (!selected || !hvForm.maHocVien || !hvForm.maNganh) {
            addToast('Vui lòng điền đầy đủ thông tin', 'error');
            return;
        }
        setIsSubmitting(true);
        try {
            const payload: UpdateHocVienRequest = {
                maHocVien: hvForm.maHocVien,
                maNganh: hvForm.maNganh,
                ngayNhapHoc: hvForm.ngayNhapHoc || undefined,
                ngayTotNghiep: hvForm.ngayTotNghiep || undefined,
            };
            await hocVienApi.updateHocVien(selected.id, payload);
            addToast('Cập nhật học viên thành công!');
            setIsEditOpen(false);
            await refetch();
        } catch {
            addToast('Lỗi khi cập nhật học viên', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!selected) return;
        setIsSubmitting(true);
        try {
            await hocVienApi.deleteHocVien(selected.id);
            addToast('Xóa học viên thành công!');
            setIsDeleteOpen(false);
            await refetch();
        } catch {
            addToast('Lỗi khi xóa học viên', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getNganhName = (nganhId: string | null) => {
        if (!nganhId || !nganhList) return '-';
        const n = nganhList.find(ng => ng.id === nganhId || ng.maNganh === nganhId);
        return n ? `${n.maNganh} - ${n.tenNganh}` : nganhId;
    };

    return (
        <div className="flex h-screen bg-slate-50">
            <AdminSidebar activeMenu="students" />
            <div className="flex-1 ml-64 flex flex-col overflow-hidden">
                <AdminHeader title="Quản Lý Học Viên" />
                <div className="flex-1 overflow-auto">
                    <div className="p-6 max-w-7xl mx-auto space-y-6">

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-xl">
                                    <GraduationCap className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Tổng học viên</p>
                                    <p className="text-2xl font-bold text-slate-900">{(students ?? []).length}</p>
                                </div>
                            </div>
                            <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4">
                                <div className="p-3 bg-green-100 rounded-xl">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Kết quả tìm kiếm</p>
                                    <p className="text-2xl font-bold text-slate-900">{filtered.length}</p>
                                </div>
                            </div>
                        </div>

                        {/* Search & Add */}
                        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="relative flex-1 max-w-md w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Tìm theo mã học viên..."
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <button
                                onClick={openAdd}
                                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all font-medium whitespace-nowrap"
                            >
                                <Plus className="w-5 h-5" /> Thêm học viên
                            </button>
                        </div>

                        {/* Table */}
                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                            {loading ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                                </div>
                            ) : filtered.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 gap-3">
                                    <div className="p-4 bg-slate-100 rounded-full">
                                        <GraduationCap className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <p className="text-slate-500">{search ? 'Không tìm thấy học viên' : 'Chưa có học viên nào'}</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-slate-50 border-b border-slate-200">
                                            <tr>
                                                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Mã HV</th>
                                                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Ngành</th>
                                                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Ngày nhập học</th>
                                                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Ngày tốt nghiệp</th>
                                                <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filtered.map(s => (
                                                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-5 py-4 text-sm font-semibold text-slate-900">{s.maHocVien}</td>
                                                    <td className="px-5 py-4 text-sm text-slate-600">{getNganhName(s.nganhId)}</td>
                                                    <td className="px-5 py-4 text-sm text-slate-600">{s.ngayNhapHoc ?? '-'}</td>
                                                    <td className="px-5 py-4 text-sm text-slate-600">{s.ngayTotNghiep ?? '-'}</td>
                                                    <td className="px-5 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button onClick={() => openEdit(s)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={() => openDelete(s)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
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
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between flex-shrink-0 rounded-t-xl">
                            <h2 className="text-xl font-bold flex items-center gap-2"><Plus className="w-5 h-5" /> Thêm học viên mới</h2>
                            <button onClick={() => setIsAddOpen(false)} className="p-1 hover:bg-white/20 rounded-lg transition-colors"><X className="w-6 h-6" /></button>
                        </div>
                        <div className="p-6 overflow-y-auto space-y-5">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Thông tin tài khoản</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: 'Tên đăng nhập *', key: 'userName' },
                                        { label: 'Email', key: 'email' },
                                        { label: 'CCCD *', key: 'cccd' },
                                        { label: 'Họ tên *', key: 'hoTen' },
                                        { label: 'Địa chỉ', key: 'diaChi' },
                                        { label: 'Số điện thoại', key: 'soDienThoai' },
                                        { label: 'Ngày sinh (dd/MM/yyyy)', key: 'ngaySinh' },
                                        { label: 'Ghi chú', key: 'ghiChu' },
                                    ].map(({ label, key }) => (
                                        <div key={key}>
                                            <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
                                            <input
                                                value={userForm[key as keyof typeof userForm] as string}
                                                onChange={(e) => setUserForm({ ...userForm, [key]: e.target.value })}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    ))}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1">Mật khẩu *</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={userForm.passWord}
                                                onChange={(e) => setUserForm({ ...userForm, passWord: e.target.value })}
                                                className="w-full px-3 py-2 pr-10 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1">Giới tính</label>
                                        <select
                                            value={userForm.gioiTinh}
                                            onChange={(e) => setUserForm({ ...userForm, gioiTinh: e.target.value as 'NAM' | 'NU' })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="NAM">Nam</option>
                                            <option value="NU">Nữ</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-2 col-span-2">
                                        <input type="checkbox" checked={userForm.trangThai} onChange={(e) => setUserForm({ ...userForm, trangThai: e.target.checked })} className="accent-blue-600" />
                                        <label className="text-sm text-slate-700">Tài khoản hoạt động</label>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Thông tin học viên</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1">Mã học viên *</label>
                                        <input
                                            value={hvForm.maHocVien}
                                            onChange={(e) => setHvForm({ ...hvForm, maHocVien: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1">Ngành *</label>
                                        <select
                                            value={hvForm.maNganh}
                                            onChange={(e) => setHvForm({ ...hvForm, maNganh: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">-- Chọn ngành --</option>
                                            {(nganhList ?? []).map(n => (
                                                <option key={n.id} value={n.maNganh}>{n.maNganh} - {n.tenNganh}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1">Ngày nhập học (dd/MM/yyyy)</label>
                                        <input
                                            value={hvForm.ngayNhapHoc}
                                            onChange={(e) => setHvForm({ ...hvForm, ngayNhapHoc: e.target.value })}
                                            placeholder="dd/MM/yyyy"
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1">Ngày tốt nghiệp (dd/MM/yyyy)</label>
                                        <input
                                            value={hvForm.ngayTotNghiep}
                                            onChange={(e) => setHvForm({ ...hvForm, ngayTotNghiep: e.target.value })}
                                            placeholder="dd/MM/yyyy"
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 px-6 py-4 border-t border-slate-200 flex-shrink-0">
                            <button onClick={() => setIsAddOpen(false)} className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium text-slate-700">Hủy</button>
                            <button onClick={() => { void handleAdd(); }} disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50">
                                {isSubmitting ? 'Đang thêm...' : 'Thêm học viên'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditOpen && selected && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
                        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
                            <h2 className="text-xl font-bold flex items-center gap-2"><Edit className="w-5 h-5" /> Cập nhật học viên</h2>
                            <button onClick={() => setIsEditOpen(false)} className="p-1 hover:bg-white/20 rounded-lg"><X className="w-6 h-6" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Mã học viên *</label>
                                    <input value={hvForm.maHocVien} onChange={(e) => setHvForm({ ...hvForm, maHocVien: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Ngành *</label>
                                    <select value={hvForm.maNganh} onChange={(e) => setHvForm({ ...hvForm, maNganh: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                                        <option value="">-- Chọn ngành --</option>
                                        {(nganhList ?? []).map(n => <option key={n.id} value={n.maNganh}>{n.maNganh} - {n.tenNganh}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Ngày nhập học</label>
                                    <input value={hvForm.ngayNhapHoc} onChange={(e) => setHvForm({ ...hvForm, ngayNhapHoc: e.target.value })} placeholder="dd/MM/yyyy" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Ngày tốt nghiệp</label>
                                    <input value={hvForm.ngayTotNghiep} onChange={(e) => setHvForm({ ...hvForm, ngayTotNghiep: e.target.value })} placeholder="dd/MM/yyyy" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 px-6 py-4 border-t">
                            <button onClick={() => setIsEditOpen(false)} className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 font-medium text-slate-700">Hủy</button>
                            <button onClick={() => { void handleEdit(); }} disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-medium disabled:opacity-50">
                                {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {isDeleteOpen && selected && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 text-center">
                        <div className="p-4 bg-red-100 rounded-full w-fit mx-auto mb-4"><Trash2 className="w-8 h-8 text-red-600" /></div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Xóa học viên</h3>
                        <p className="text-slate-500 text-sm mb-6">Bạn có chắc muốn xóa học viên <strong>{selected.maHocVien}</strong>? Hành động này không thể hoàn tác.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setIsDeleteOpen(false)} className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 font-medium text-slate-700">Hủy</button>
                            <button onClick={() => { void handleDelete(); }} disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50">
                                {isSubmitting ? 'Đang xóa...' : 'Xóa'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toasts */}
            <div className="fixed bottom-24 right-8 space-y-3 z-40">
                {toasts.map(t => (
                    <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white font-medium ${t.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {t.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        {t.message}
                    </div>
                ))}
            </div>

            <button className="fixed bottom-8 right-8 w-16 h-16 z-50 hover:scale-110 transition-transform" aria-label="AI Assistant">
                <AiAssistantButton />
            </button>
        </div>
    );
}
