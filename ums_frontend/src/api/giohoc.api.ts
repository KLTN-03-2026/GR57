import apiClient from '@/api/axiosClient';

export type GioHocRequest = {
    maGioHoc: string;
    tenGioHoc: string;
    thoiGianBatDau?: string; // HH:mm:ss
    thoiGianKetThuc?: string; // HH:mm:ss
};

export async function getAllGioHoc() {
    return (await apiClient.get('/admin/gio-hoc')).data;
}

export async function getGioHocById(id: string) {
    return (await apiClient.get(`/admin/gio-hoc/${id}`)).data;
}

export async function createGioHoc(dto: GioHocRequest) {
    return (await apiClient.post('/admin/gio-hoc', dto)).data;
}

export async function updateGioHoc(id: string, dto: GioHocRequest) {
    return (await apiClient.put(`/admin/gio-hoc/${id}`, dto)).data;
}

export async function deleteGioHoc(id: string) {
    return await apiClient.delete(`/admin/gio-hoc/${id}`);
}

export async function searchGioHocByName(keyword: string) {
    return (await apiClient.get(`/admin/gio-hoc/search-name?keyword=${encodeURIComponent(keyword)}`)).data;
}

export default {
    getAllGioHoc,
    getGioHocById,
    createGioHoc,
    updateGioHoc,
    deleteGioHoc,
    searchGioHocByName,
};
