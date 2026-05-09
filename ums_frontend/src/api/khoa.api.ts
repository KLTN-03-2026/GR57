import apiClient from '@/api/axiosClient';

export type KhoaRequest = {
    maKhoa: string;
    tenKhoa: string;
    diaChi?: string;
    moTa?: string;
    maTruong: string; // school code
};

export async function getAllKhoa() {
    return (await apiClient.get('/admin/khoa')).data;
}

export async function getKhoaById(id: string) {
    return (await apiClient.get(`/admin/khoa/${id}`)).data;
}

export async function createKhoa(dto: KhoaRequest) {
    return (await apiClient.post('/admin/khoa', dto)).data;
}

export async function createKhoaList(dtos: KhoaRequest[]) {
    return (await apiClient.post('/admin/khoa/list', dtos)).data;
}

export async function updateKhoa(id: string, dto: KhoaRequest) {
    return (await apiClient.put(`/admin/khoa/${id}`, dto)).data;
}

export async function deleteKhoa(id: string) {
    return await apiClient.delete(`/admin/khoa/${id}`);
}

export async function deleteKhoaList(ids: string[]) {
    return await apiClient.delete('/admin/khoa/delete/by-list', { data: ids });
}

export default {
    getAllKhoa,
    getKhoaById,
    createKhoa,
    createKhoaList,
    updateKhoa,
    deleteKhoa,
    deleteKhoaList,
};
