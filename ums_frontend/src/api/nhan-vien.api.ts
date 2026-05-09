import apiClient from '@/api/axiosClient';

export type NhanVienResponse = {
    id: string;
    maNhanVien: string;
    tenNhanVien: string;
    gioiTinh: 'NAM' | 'NU' | null;
    ngayNhanViec: string | null;
    ngayNghiViec: string | null;
    usersId: string | null;
};

export type NhanVienUserDetails = {
    userName: string;
    passWord: string;
    email: string;
    cccd: string;
    hoTen: string;
    diaChi?: string;
    gioiTinh: 'NAM' | 'NU';
    ngaySinh?: string;
    soDienThoai?: string;
    trangThai: boolean;
    ghiChu?: string;
};

export type NhanVienDetails = {
    maNhanVien: string;
    ngayNhanViec?: string;
    ngayNghiViec?: string;
    usersId?: string;
};

export type CreateNhanVienRequest = {
    userDetails: NhanVienUserDetails;
    nhanVienDetails: NhanVienDetails;
};

export type UpdateNhanVienRequest = {
    maNhanVien: string;
    ngayNhanViec?: string;
    ngayNghiViec?: string;
    usersId?: string;
};

export async function getAllNhanVien(): Promise<NhanVienResponse[]> {
    return (await apiClient.get('/admin/nhan-vien/all')).data;
}

export async function getNhanVienById(id: string): Promise<NhanVienResponse> {
    return (await apiClient.get(`/admin/nhan-vien/${id}`)).data;
}

export async function createNhanVien(data: CreateNhanVienRequest): Promise<NhanVienResponse> {
    return (await apiClient.post('/admin/nhan-vien', data)).data;
}

export async function updateNhanVien(id: string, data: UpdateNhanVienRequest): Promise<NhanVienResponse> {
    return (await apiClient.put(`/admin/nhan-vien/${id}`, data)).data;
}

export async function deleteNhanVien(id: string): Promise<void> {
    await apiClient.delete(`/admin/nhan-vien/${id}`);
}

export async function deleteNhanVienList(ids: string[]): Promise<void> {
    await apiClient.delete('/admin/nhan-vien/delete-list', { data: ids });
}

export async function importNhanVienExcel(file: File): Promise<{ success: number; failed: number }> {
    const form = new FormData();
    form.append('file', file);
    return (await apiClient.post('/admin/nhan-vien/import-excel', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })).data;
}
