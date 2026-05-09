import apiClient from '@/api/axiosClient';

export type PhongRequest = {
    maPhong: string;
    tenPhong?: string;
    tinhTrang?: string;
    toaNha?: string;
    tang?: number;
    moTa?: string;
};

export async function getAllPhong() {
    return (await apiClient.get('/admin/phong')).data;
}

export async function getPhongById(id: string) {
    return (await apiClient.get(`/admin/phong/${id}`)).data;
}

export async function createPhong(dto: PhongRequest) {
    return (await apiClient.post('/admin/phong', dto)).data;
}

export async function updatePhong(id: string, dto: PhongRequest) {
    return (await apiClient.put(`/admin/phong/${id}`, dto)).data;
}

export async function deletePhong(id: string) {
    return await apiClient.delete(`/admin/phong/${id}`);
}

export default {
    getAllPhong,
    getPhongById,
    createPhong,
    updatePhong,
    deletePhong,
};
