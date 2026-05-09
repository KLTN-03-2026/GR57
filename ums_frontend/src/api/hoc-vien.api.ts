import apiClient from '@/api/axiosClient';

export type HocVienResponse = {
    id: string;
    maHocVien: string;
    ngayNhapHoc: string | null;
    ngayTotNghiep: string | null;
    nganhId: string | null;
};

export type HocVienUserDetails = {
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

export type HocVienDetails = {
    maHocVien: string;
    ngayNhapHoc?: string;
    ngayTotNghiep?: string;
    maNganh: string;
};

export type CreateHocVienRequest = {
    userDetails: HocVienUserDetails;
    hocVienDetails: HocVienDetails;
};

export type UpdateHocVienRequest = {
    maHocVien: string;
    ngayNhapHoc?: string;
    ngayTotNghiep?: string;
    maNganh: string;
};

export async function getAllHocVien(): Promise<HocVienResponse[]> {
    return (await apiClient.get('/admin/hoc-vien')).data;
}

export async function getHocVienById(id: string): Promise<HocVienResponse> {
    return (await apiClient.get(`/admin/hoc-vien/${id}`)).data;
}

export async function createHocVien(data: CreateHocVienRequest): Promise<HocVienResponse> {
    return (await apiClient.post('/admin/hoc-vien', data)).data;
}

export async function updateHocVien(id: string, data: UpdateHocVienRequest): Promise<HocVienResponse> {
    return (await apiClient.put(`/admin/hoc-vien/${id}`, data)).data;
}

export async function deleteHocVien(id: string): Promise<void> {
    await apiClient.delete(`/admin/hoc-vien/${id}`);
}
