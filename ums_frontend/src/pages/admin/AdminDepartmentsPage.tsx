import { AdminSidebar } from '@/components/layouts/AdminSidebar';
import { AdminHeader } from '@/components/layouts/AdminHeader';
import { useState, useEffect, FormEvent } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  X,
  BookOpen,
  GraduationCap,
  BookMarked,
  AlertCircle,
  Search,
} from 'lucide-react';
import AiAssistantButton from '@/imports/AiAssistantButton-4-13343';
import apiClient from '@/api/axiosClient';
import * as khoaApi from '@/api/khoa.api';
import * as nganhApi from '@/api/nganh.api';
import * as schoolApi from '@/api/school.api';
import * as monHocApi from '@/api/monhoc.api';
import type { DepartmentItem, MajorItem, SubjectItem, SchoolItem } from '@/types';
import { Toast } from '@/components/notification/Toast';

type TabType = 'departments' | 'majors' | 'subjects';

type ItemType = DepartmentItem | MajorItem | SubjectItem;

export default function AdminDepartmentsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('departments');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [majors, setMajors] = useState<MajorItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [schools, setSchools] = useState<SchoolItem[]>([]);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [subjectForm, setSubjectForm] = useState({ maMonHoc: '', tenMonHoc: '', soTinChi: 3, moTa: '' });

  const [khoaForm, setKhoaForm] = useState({ maKhoa: '', tenKhoa: '', diaChi: '', moTa: '', maTruong: '' });
  const [nganhForm, setNganhForm] = useState({ maNganh: '', tenNganh: '', moTa: '', danhGia: '', maKhoa: '' });

  // Fetch live data from backend and map DTOs to frontend types
  const fetchAll = async () => {
    try {
      const [khoaResp, nganhResp, monHocResp, truongResp] = await Promise.all([
        apiClient.get('/admin/khoa'),
        apiClient.get('/admin/nganh'),
        apiClient.get('/admin/mon-hoc/all'),
        apiClient.get('/admin/truong'),
      ]);

      const depts: DepartmentItem[] = (khoaResp.data || []).map((k: any) => ({
        id: String(k.id),
        code: k.maKhoa || k.code || '',
        name: k.tenKhoa || k.name || '',
        headOfDepartment: k.truongId ? k.tenTruong || undefined : undefined,
        truongId: k.truongId ? String(k.truongId) : undefined,
        truongName: k.tenTruong || undefined,
        diaChi: k.diaChi || undefined,
        moTa: k.moTa || undefined,
      }));

      const mjs: MajorItem[] = (nganhResp.data || []).map((n: any) => ({
        id: String(n.id),
        code: n.maNganh || n.code || '',
        name: n.tenNganh || n.name || '',
        departmentId: n.khoaId || n.departmentId || '',
        departmentName: n.tenKhoa || n.tenTruong || '',
      }));

      const subs: SubjectItem[] = (monHocResp.data || []).map((s: any) => ({
        id: String(s.id),
        code: s.maMonHoc || s.code || '',
        name: s.tenMonHoc || s.name || '',
        credits: s.soTinChi ?? s.credits ?? 0,
        majorId: s.nganhId || s.majorId || '',
        majorName: s.tenNganh || s.majorName || '',
      }));

      const schoolsList: SchoolItem[] = (truongResp.data || []).map((t: any) => ({
        id: String(t.id),
        maTruong: t.maTruong || t.code || '',
        tenTruong: t.tenTruong || t.name || '',
        diaChi: t.diaChi || undefined,
        moTa: t.moTa || undefined,
        nguoiDaiDien: t.nguoiDaiDien || undefined,
        ngayThanhLap: t.ngayThanhLap || undefined,
      }));

      setDepartments(depts);
      setMajors(mjs);
      setSubjects(subs);
      setSchools(schoolsList);
    } catch (err) {
      console.error('Failed to load admin lists', err);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const openAddModal = () => {
    if (activeTab === 'departments') {
      setKhoaForm({ maKhoa: '', tenKhoa: '', diaChi: '', moTa: '', maTruong: schools[0]?.maTruong || '' });
    } else if (activeTab === 'majors') {
      setNganhForm({ maNganh: '', tenNganh: '', moTa: '', danhGia: '', maKhoa: departments[0]?.code || '' });
    } else if (activeTab === 'subjects') {
      setSubjectForm({ maMonHoc: '', tenMonHoc: '', soTinChi: 3, moTa: '' });
    }
    setIsAddModalOpen(true);
  };

  const handleEdit = (item: ItemType) => {
    setSelectedItem(item);
    if (activeTab === 'departments') {
      const dept = item as DepartmentItem;
      const maTruong = schools.find(s => s.id === dept.truongId)?.maTruong || '';
      setKhoaForm({ maKhoa: dept.code, tenKhoa: dept.name, diaChi: dept.diaChi || '', moTa: dept.moTa || '', maTruong });
    } else if (activeTab === 'majors') {
      const mj = item as MajorItem;
      const dept = departments.find(d => d.id === mj.departmentId);
      setNganhForm({ maNganh: mj.code, tenNganh: mj.name, moTa: '', danhGia: '', maKhoa: dept?.code || '' });
    } else if (activeTab === 'subjects') {
      const s = item as SubjectItem;
      setSubjectForm({ maMonHoc: s.code, tenMonHoc: s.name, soTinChi: s.credits || 0, moTa: '' });
    }
    setIsEditModalOpen(true);
  };

  const handleDelete = (item: ItemType) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleCreateKhoa = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await khoaApi.createKhoa(khoaForm);
      setIsAddModalOpen(false);
      setToast({ type: 'success', message: 'Thêm khoa thành công' });
      await fetchAll();
    } catch (err: any) {
      console.error('Create Khoa failed', err);
      const msg = err?.response?.data?.message || err?.message || 'Thêm khoa thất bại';
      setToast({ type: 'error', message: String(msg) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateKhoa = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    setIsSubmitting(true);
    try {
      await khoaApi.updateKhoa((selectedItem as DepartmentItem).id, khoaForm);
      setIsEditModalOpen(false);
      setSelectedItem(null);
      setToast({ type: 'success', message: 'Cập nhật khoa thành công' });
      await fetchAll();
    } catch (err: any) {
      console.error('Update Khoa failed', err);
      const msg = err?.response?.data?.message || err?.message || 'Cập nhật khoa thất bại';
      setToast({ type: 'error', message: String(msg) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateNganh = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await nganhApi.createNganh(nganhForm);
      setIsAddModalOpen(false);
      setToast({ type: 'success', message: 'Thêm ngành thành công' });
      await fetchAll();
    } catch (err: any) {
      console.error('Create Nganh failed', err);
      const msg = err?.response?.data?.message || err?.message || 'Thêm ngành thất bại';
      setToast({ type: 'error', message: String(msg) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateMonHoc = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // backend expects MonHocAdminRequestDTO fields
      await monHocApi.createMonHoc({ maMonHoc: subjectForm.maMonHoc, tenMonHoc: subjectForm.tenMonHoc, soTinChi: subjectForm.soTinChi, moTa: subjectForm.moTa });
      setIsAddModalOpen(false);
      setToast({ type: 'success', message: 'Thêm môn học thành công' });
      await fetchAll();
    } catch (err: any) {
      console.error('Create MonHoc failed', err);
      const msg = err?.response?.data?.message || err?.message || 'Thêm môn học thất bại';
      setToast({ type: 'error', message: String(msg) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateNganh = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    setIsSubmitting(true);
    try {
      await nganhApi.updateNganh((selectedItem as MajorItem).id, nganhForm);
      setIsEditModalOpen(false);
      setSelectedItem(null);
      setToast({ type: 'success', message: 'Cập nhật ngành thành công' });
      await fetchAll();
    } catch (err: any) {
      console.error('Update Nganh failed', err);
      const msg = err?.response?.data?.message || err?.message || 'Cập nhật ngành thất bại';
      setToast({ type: 'error', message: String(msg) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateMonHoc = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    setIsSubmitting(true);
    try {
      await monHocApi.updateMonHoc((selectedItem as SubjectItem).id, { maMonHoc: subjectForm.maMonHoc, tenMonHoc: subjectForm.tenMonHoc, soTinChi: subjectForm.soTinChi, moTa: subjectForm.moTa });
      setIsEditModalOpen(false);
      setSelectedItem(null);
      setToast({ type: 'success', message: 'Cập nhật môn học thành công' });
      await fetchAll();
    } catch (err: any) {
      console.error('Update MonHoc failed', err);
      const msg = err?.response?.data?.message || err?.message || 'Cập nhật môn học thất bại';
      setToast({ type: 'error', message: String(msg) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedItem) return;
    setIsDeleting(true);
    try {
      if (activeTab === 'departments') {
        await khoaApi.deleteKhoa((selectedItem as DepartmentItem).id);
        setToast({ type: 'success', message: 'Xóa khoa thành công' });
      } else if (activeTab === 'majors') {
        await nganhApi.deleteNganh((selectedItem as MajorItem).id);
        setToast({ type: 'success', message: 'Xóa ngành thành công' });
      } else {
        await monHocApi.deleteMonHoc((selectedItem as SubjectItem).id);
        setToast({ type: 'success', message: 'Xóa môn học thành công' });
      }
      await fetchAll();
    } catch (err: any) {
      console.error('Delete failed', err);
      const msg = err?.response?.data?.message || err?.message || 'Xóa thất bại';
      setToast({ type: 'error', message: String(msg) });
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
      setIsDeleting(false);
    }
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'departments':
        return departments.filter(d =>
          d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.code.toLowerCase().includes(searchQuery.toLowerCase())
        );
      case 'majors':
        return majors.filter(m =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.code.toLowerCase().includes(searchQuery.toLowerCase())
        );
      case 'subjects':
        return subjects.filter(s =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.code.toLowerCase().includes(searchQuery.toLowerCase())
        );
      default:
        return [];
    }
  };

  const getTabConfig = () => {
    switch (activeTab) {
      case 'departments':
        return {
          title: 'Quản lý Khoa',
          icon: <BookOpen className="w-5 h-5" />,
          addButtonText: 'Thêm Khoa',
          emptyText: 'Chưa có khoa nào'
        };
      case 'majors':
        return {
          title: 'Quản lý Ngành',
          icon: <GraduationCap className="w-5 h-5" />,
          addButtonText: 'Thêm Ngành',
          emptyText: 'Chưa có ngành nào'
        };
      case 'subjects':
        return {
          title: 'Quản lý Môn học',
          icon: <BookMarked className="w-5 h-5" />,
          addButtonText: 'Thêm Môn học',
          emptyText: 'Chưa có môn học nào'
        };
    }
  };


  const tabConfig = getTabConfig();
  const currentData = getCurrentData();

  return (
    <div className="flex h-screen bg-[#f1f5f9]">
      <AdminSidebar activeMenu="departments" />

      <div className="flex-1 ml-64 flex flex-col">
        <AdminHeader title="Quản lý Danh mục" />

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Tabs Navigation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setActiveTab('departments');
                    setSearchQuery('');
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === 'departments'
                    ? 'bg-gradient-to-r from-[#1e3a5f] to-[#2d4a6b] text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <BookOpen className="w-5 h-5" />
                  Khoa
                  <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'departments' ? 'bg-white/20' : 'bg-gray-200'
                    }`}>
                    {departments.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('majors');
                    setSearchQuery('');
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === 'majors'
                    ? 'bg-gradient-to-r from-[#1e3a5f] to-[#2d4a6b] text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <GraduationCap className="w-5 h-5" />
                  Ngành
                  <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'majors' ? 'bg-white/20' : 'bg-gray-200'
                    }`}>
                    {majors.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('subjects');
                    setSearchQuery('');
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === 'subjects'
                    ? 'bg-gradient-to-r from-[#1e3a5f] to-[#2d4a6b] text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <BookMarked className="w-5 h-5" />
                  Môn học
                  <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'subjects' ? 'bg-white/20' : 'bg-gray-200'
                    }`}>
                    {subjects.length}
                  </span>
                </button>
              </div>
            </div>

            {/* Header Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo mã hoặc tên..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Add Button */}
                <button
                  onClick={openAddModal}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1e3a5f] to-[#2d4a6b] text-white rounded-lg hover:shadow-lg transition-all"
                >
                  <Plus className="w-5 h-5" />
                  {tabConfig.addButtonText}
                </button>
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-[#1e3a5f] to-[#2d4a6b] text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Mã</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Tên</th>
                      {activeTab === 'departments' && (
                        <th className="px-6 py-4 text-left text-sm font-semibold">Trưởng khoa</th>
                      )}
                      {activeTab === 'majors' && (
                        <th className="px-6 py-4 text-left text-sm font-semibold">Thuộc khoa</th>
                      )}
                      {activeTab === 'subjects' && (
                        <>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Số tín chỉ</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Thuộc ngành</th>
                        </>
                      )}
                      <th className="px-6 py-4 text-center text-sm font-semibold">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentData.length > 0 ? (
                      currentData.map((item: any, index) => (
                        <tr
                          key={item.id}
                          className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            }`}
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {item.code}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                            {item.name}
                          </td>
                          {activeTab === 'departments' && (
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {(item as DepartmentItem).headOfDepartment || '-'}
                            </td>
                          )}
                          {activeTab === 'majors' && (
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {(item as MajorItem).departmentName}
                            </td>
                          )}
                          {activeTab === 'subjects' && (
                            <>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-medium">
                                  {(item as SubjectItem).credits} tín chỉ
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {(item as SubjectItem).majorName}
                              </td>
                            </>
                          )}
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEdit(item)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Chỉnh sửa"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(item)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Xóa"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={activeTab === 'subjects' ? 5 : activeTab === 'departments' || activeTab === 'majors' ? 4 : 3} className="px-6 py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center gap-2">
                            {tabConfig.icon}
                            <p className="text-lg font-medium">{tabConfig.emptyText}</p>
                            <p className="text-sm">Hãy thêm mới để bắt đầu</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              {currentData.length > 0 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Hiển thị <span className="font-medium">{currentData.length}</span> kết quả
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal - Departments */}
      {isAddModalOpen && activeTab === 'departments' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
            <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d4a6b] text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                Thêm Khoa mới
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form className="p-6 space-y-4" onSubmit={handleCreateKhoa}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã khoa <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  value={khoaForm.maKhoa}
                  onChange={(e) => setKhoaForm({ ...khoaForm, maKhoa: e.target.value })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: CNTT"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên khoa <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  value={khoaForm.tenKhoa}
                  onChange={(e) => setKhoaForm({ ...khoaForm, tenKhoa: e.target.value })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: Công nghệ Thông tin"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                <input
                  value={khoaForm.diaChi}
                  onChange={(e) => setKhoaForm({ ...khoaForm, diaChi: e.target.value })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thuộc trường <span className="text-red-500">*</span></label>
                <select
                  required
                  value={khoaForm.maTruong}
                  onChange={(e) => setKhoaForm({ ...khoaForm, maTruong: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn trường</option>
                  {schools.map((s) => (
                    <option key={s.id} value={s.maTruong}>{s.tenTruong}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 px-4 py-2 bg-gradient-to-r from-[#1e3a5f] to-[#2d4a6b] text-white rounded-lg hover:shadow-lg transition-all ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Đang thêm...' : 'Thêm khoa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Modal - Majors */}
      {isAddModalOpen && activeTab === 'majors' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
            <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d4a6b] text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <GraduationCap className="w-6 h-6" />
                Thêm Ngành mới
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form className="p-6 space-y-4" onSubmit={handleCreateNganh}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã ngành <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  value={nganhForm.maNganh}
                  onChange={(e) => setNganhForm({ ...nganhForm, maNganh: e.target.value })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: CNTT-K01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên ngành <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  value={nganhForm.tenNganh}
                  onChange={(e) => setNganhForm({ ...nganhForm, tenNganh: e.target.value })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: Công nghệ Phần mềm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thuộc khoa <span className="text-red-500">*</span></label>
                <select
                  required
                  value={nganhForm.maKhoa}
                  onChange={(e) => setNganhForm({ ...nganhForm, maKhoa: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn khoa</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.code}>{dept.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 px-4 py-2 bg-gradient-to-r from-[#1e3a5f] to-[#2d4a6b] text-white rounded-lg hover:shadow-lg transition-all ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Đang thêm...' : 'Thêm ngành'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Modal - Subjects */}
      {isAddModalOpen && activeTab === 'subjects' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
            <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d4a6b] text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <BookMarked className="w-6 h-6" />
                Thêm Môn học mới
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form className="p-6 space-y-4" onSubmit={handleCreateMonHoc}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mã môn học <span className="text-red-500">*</span></label>
                <input
                  required
                  value={subjectForm.maMonHoc}
                  onChange={(e) => setSubjectForm({ ...subjectForm, maMonHoc: e.target.value })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: CS101"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên môn học <span className="text-red-500">*</span></label>
                <input
                  required
                  value={subjectForm.tenMonHoc}
                  onChange={(e) => setSubjectForm({ ...subjectForm, tenMonHoc: e.target.value })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: Lập trình Cơ bản"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số tín chỉ <span className="text-red-500">*</span></label>
                <input
                  required
                  value={subjectForm.soTinChi}
                  onChange={(e) => setSubjectForm({ ...subjectForm, soTinChi: Number(e.target.value) || 0 })}
                  type="number"
                  min={0}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: 3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                <textarea
                  value={subjectForm.moTa}
                  onChange={(e) => setSubjectForm({ ...subjectForm, moTa: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Hủy</button>
                <button type="submit" disabled={isSubmitting} className={`flex-1 px-4 py-2 bg-gradient-to-r from-[#1e3a5f] to-[#2d4a6b] text-white rounded-lg hover:shadow-lg transition-all ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}>{isSubmitting ? 'Đang thêm...' : 'Thêm môn học'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal - Departments / Majors / Subjects */}
      {isEditModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
            <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d4a6b] text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Edit className="w-6 h-6" />
                Chỉnh sửa {activeTab === 'departments' ? 'Khoa' : activeTab === 'majors' ? 'Ngành' : 'Môn học'}
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'departments' && (
                <form className="space-y-4" onSubmit={handleUpdateKhoa}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mã khoa</label>
                    <input
                      required
                      value={khoaForm.maKhoa}
                      onChange={(e) => setKhoaForm({ ...khoaForm, maKhoa: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên khoa</label>
                    <input
                      required
                      value={khoaForm.tenKhoa}
                      onChange={(e) => setKhoaForm({ ...khoaForm, tenKhoa: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thuộc trường</label>
                    <select
                      value={khoaForm.maTruong}
                      onChange={(e) => setKhoaForm({ ...khoaForm, maTruong: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Chọn trường</option>
                      {schools.map((s) => (
                        <option key={s.id} value={s.maTruong}>{s.tenTruong}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg">Hủy</button>
                    <button type="submit" disabled={isSubmitting} className={`flex-1 px-4 py-2 bg-gradient-to-r from-[#1e3a5f] to-[#2d4a6b] text-white rounded-lg ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}>{isSubmitting ? 'Đang lưu...' : 'Lưu'}</button>
                  </div>
                </form>
              )}

              {activeTab === 'majors' && (
                <form className="space-y-4" onSubmit={handleUpdateNganh}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mã ngành</label>
                    <input
                      required
                      value={nganhForm.maNganh}
                      onChange={(e) => setNganhForm({ ...nganhForm, maNganh: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên ngành</label>
                    <input
                      required
                      value={nganhForm.tenNganh}
                      onChange={(e) => setNganhForm({ ...nganhForm, tenNganh: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thuộc khoa</label>
                    <select
                      value={nganhForm.maKhoa}
                      onChange={(e) => setNganhForm({ ...nganhForm, maKhoa: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Chọn khoa</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.code}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg">Hủy</button>
                    <button type="submit" disabled={isSubmitting} className={`flex-1 px-4 py-2 bg-gradient-to-r from-[#1e3a5f] to-[#2d4a6b] text-white rounded-lg ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}>{isSubmitting ? 'Đang lưu...' : 'Lưu'}</button>
                  </div>
                </form>
              )}

              {activeTab === 'subjects' && (
                <form className="space-y-4" onSubmit={handleUpdateMonHoc}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mã môn học</label>
                    <input
                      required
                      value={subjectForm.maMonHoc}
                      onChange={(e) => setSubjectForm({ ...subjectForm, maMonHoc: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên môn học</label>
                    <input
                      required
                      value={subjectForm.tenMonHoc}
                      onChange={(e) => setSubjectForm({ ...subjectForm, tenMonHoc: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Số tín chỉ</label>
                    <input
                      value={subjectForm.soTinChi}
                      onChange={(e) => setSubjectForm({ ...subjectForm, soTinChi: Number(e.target.value) || 0 })}
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                    <textarea
                      value={subjectForm.moTa}
                      onChange={(e) => setSubjectForm({ ...subjectForm, moTa: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg">Hủy</button>
                    <button type="submit" disabled={isSubmitting} className={`flex-1 px-4 py-2 bg-gradient-to-r from-[#1e3a5f] to-[#2d4a6b] text-white rounded-lg ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}>{isSubmitting ? 'Đang lưu...' : 'Lưu'}</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                Xác nhận xóa
              </h3>

              <p className="text-gray-600 text-center mb-4">
                Bạn có chắc chắn muốn xóa <span className="font-bold">{(selectedItem as any).name}</span>?
              </p>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Hành động này không thể hoàn tác. Dữ liệu sẽ bị xóa vĩnh viễn.</span>
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className={`flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ${isDeleting ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {isDeleting ? 'Đang xóa...' : 'Xóa'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Assistant Button */}
      <button
        className="fixed bottom-8 right-8 w-16 h-16 z-50 hover:scale-110 transition-transform cursor-pointer"
        aria-label="AI Assistant"
      >
        <AiAssistantButton />
      </button>

      {/* Toast Notification */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
