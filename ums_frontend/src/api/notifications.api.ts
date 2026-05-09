import api from './api';

export type LoaiThongBaoEnum =
    | 'THONG_BAO_CHUNG'
    | 'THONG_BAO_SINH_VIEN'
    | 'THONG_BAO_GIANG_VIEN'
    | 'THONG_BAO_KHOA'
    | 'THONG_BAO_DAO_TAO'
    | 'THONG_BAO_HOC_PHI'
    | 'THONG_BAO_TUYEN_SINH'
    | 'THONG_BAO_SU_KIEN'
    | 'THONG_BAO_KHAC';

export const LOAI_THONG_BAO_LABEL: Record<LoaiThongBaoEnum, string> = {
    THONG_BAO_CHUNG: 'Thông báo chung',
    THONG_BAO_SINH_VIEN: 'Thông báo sinh viên',
    THONG_BAO_GIANG_VIEN: 'Thông báo giảng viên',
    THONG_BAO_KHOA: 'Thông báo khoa',
    THONG_BAO_DAO_TAO: 'Thông báo đào tạo',
    THONG_BAO_HOC_PHI: 'Thông báo học phí',
    THONG_BAO_TUYEN_SINH: 'Thông báo tuyển sinh',
    THONG_BAO_SU_KIEN: 'Thông báo sự kiện',
    THONG_BAO_KHAC: 'Thông báo khác',
};

export interface NotificationResponse {
    id: string;
    tieuDe: string;
    noiDung: string;
    loaiThongBao: LoaiThongBaoEnum;
    createdAt: string;
    daNhan: boolean;
    fileThongBao?: string;
}

export interface NotificationRequest {
    tieuDe: string;
    noiDung: string;
    loaiThongBao: LoaiThongBaoEnum;
    fileThongBao?: string;
    userIds: string[];
}

export const getMyNotifications = async (): Promise<NotificationResponse[]> => {
    const response = await api.get('/notifications/read');
    return response.data;
};

export const getUnreadNotifications = async (): Promise<NotificationResponse[]> => {
    const response = await api.get('/notifications/unread');
    return response.data;
};

export const sendAdminNotification = async (
    payload: NotificationRequest
): Promise<{ message: string }> => {
    const response = await api.post('/notifications/admin', payload);
    return response.data;
};

export const markNotificationAsRead = async (
    id: string
): Promise<{ message: string }> => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
};
