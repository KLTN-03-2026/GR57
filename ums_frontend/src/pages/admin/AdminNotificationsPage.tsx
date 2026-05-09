import { useMemo, useState } from 'react';
import {
    Bell,
    Search,
    Send,
    X,
    CheckCircle,
    AlertCircle,
    Paperclip,
} from 'lucide-react';

import { AdminSidebar } from '@/components/layouts/AdminSidebar';
import { AdminHeader } from '@/components/layouts/AdminHeader';

import { useFetch, useSubmit } from '@/hooks/useFetch';

import * as notificationsApi from '@/api/notifications.api';
import * as usersApi from '@/api/users.api';

import type {
    NotificationResponse,
    NotificationRequest,
    LoaiThongBaoEnum,
} from '@/api/notifications.api';

import type { UsersItem } from '@/api/types';

import { LOAI_THONG_BAO_LABEL } from '@/api/notifications.api';

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error';
}

const LOAI_OPTIONS: LoaiThongBaoEnum[] = [
    'THONG_BAO_CHUNG',
    'THONG_BAO_SINH_VIEN',
    'THONG_BAO_GIANG_VIEN',
    'THONG_BAO_KHOA',
    'THONG_BAO_DAO_TAO',
    'THONG_BAO_HOC_PHI',
    'THONG_BAO_TUYEN_SINH',
    'THONG_BAO_SU_KIEN',
    'THONG_BAO_KHAC',
];

const initialForm = {
    tieuDe: '',
    noiDung: '',
    loaiThongBao: 'THONG_BAO_CHUNG' as LoaiThongBaoEnum,
    fileThongBao: '',
};

export default function AdminNotificationsPage() {
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [form, setForm] = useState(initialForm);

    const addToast = (message: string, type: 'success' | 'error') => {
        const id = Date.now().toString();

        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 3000);
    };

    const {
        data: notifications,
        loading: loadingNotifications,
        refetch: refetchNotifications,
    } = useFetch<NotificationResponse[]>(
        () => notificationsApi.getMyNotifications(),
        {
            onError: () => addToast('Không thể tải danh sách thông báo', 'error'),
        }
    );

    const {
        data: users,
        loading: loadingUsers,
    } = useFetch<UsersItem[]>(
        () => usersApi.getUsers(),
        {
            onError: () => addToast('Không thể tải danh sách người dùng', 'error'),
        }
    );

    const filteredNotifications = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        if (!keyword) {
            return notifications ?? [];
        }

        return (notifications ?? []).filter((item) => {
            return (
                item.tieuDe.toLowerCase().includes(keyword) ||
                item.noiDung.toLowerCase().includes(keyword)
            );
        });
    }, [notifications, search]);

    const unreadCount = useMemo(() => {
        return (notifications ?? []).filter((item) => !item.daNhan).length;
    }, [notifications]);

    const { submit: sendNotification, isSubmitting: isSending } =
        useSubmit<NotificationRequest>(
            async (payload) => {
                await notificationsApi.sendAdminNotification(payload);

                addToast('Gửi thông báo thành công', 'success');

                setForm(initialForm);
                setIsModalOpen(false);

                await refetchNotifications();
            },
            {
                onError: () => addToast('Gửi thông báo thất bại', 'error'),
            }
        );

    const handleSendNotification = async () => {
        const tieuDe = form.tieuDe.trim();
        const noiDung = form.noiDung.trim();
        const fileThongBao = form.fileThongBao.trim();

        if (!tieuDe || !noiDung) {
            addToast('Vui lòng nhập tiêu đề và nội dung', 'error');
            return;
        }

        const userIds = (users ?? []).map((user) => user.id);

        if (userIds.length === 0) {
            addToast('Không có người dùng để gửi thông báo', 'error');
            return;
        }

        await sendNotification({
            tieuDe,
            noiDung,
            loaiThongBao: form.loaiThongBao,
            fileThongBao: fileThongBao || undefined,
            userIds,
        });
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await notificationsApi.markNotificationAsRead(id);
            addToast('Đã đánh dấu thông báo là đã đọc', 'success');
            await refetchNotifications();
        } catch {
            addToast('Đánh dấu đã đọc thất bại', 'error');
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <AdminSidebar activeMenu="notifications" />

            <div className="ml-64 flex flex-1 flex-col">
                <AdminHeader title="Thông báo hệ thống" />

                <main className="flex-1 p-6">
                    <div className="mx-auto max-w-6xl space-y-6">

                        {/* Thống kê */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="rounded-lg border bg-white p-5 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-full bg-blue-100 p-3">
                                        <Bell className="h-6 w-6 text-blue-600" />
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Tổng thông báo
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {(notifications ?? []).length}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg border bg-white p-5 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-full bg-orange-100 p-3">
                                        <AlertCircle className="h-6 w-6 text-orange-600" />
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Chưa đọc
                                        </p>
                                        <p className="text-2xl font-bold text-orange-600">
                                            {unreadCount}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg border bg-white p-5 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-full bg-green-100 p-3">
                                        <Send className="h-6 w-6 text-green-600" />
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Người dùng nhận
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {(users ?? []).length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tìm kiếm + nút gửi */}
                        <div className="rounded-lg border bg-white p-4 shadow-sm">
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div className="relative w-full md:max-w-md">
                                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                                    <input
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                        placeholder="Tìm theo tiêu đề hoặc nội dung..."
                                        className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(true)}
                                    className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                                    disabled={loadingUsers}
                                >
                                    <Send className="h-4 w-4" />
                                    Gửi thông báo
                                </button>
                            </div>
                        </div>

                        {/* Danh sách thông báo */}
                        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                            <div className="border-b px-5 py-4">
                                <h2 className="font-semibold text-gray-900">
                                    Danh sách thông báo
                                </h2>
                            </div>

                            {loadingNotifications ? (
                                <div className="flex h-60 items-center justify-center">
                                    <p className="text-gray-500">
                                        Đang tải thông báo...
                                    </p>
                                </div>
                            ) : filteredNotifications.length === 0 ? (
                                <div className="flex h-60 flex-col items-center justify-center gap-2">
                                    <Bell className="h-10 w-10 text-gray-300" />
                                    <p className="text-gray-500">
                                        {search
                                            ? 'Không tìm thấy thông báo phù hợp'
                                            : 'Chưa có thông báo nào'}
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {filteredNotifications.map((item) => (
                                        <div
                                            key={item.id}
                                            className={`p-5 ${!item.daNhan
                                                    ? 'bg-blue-50/50'
                                                    : 'bg-white'
                                                }`}
                                        >
                                            <div className="flex gap-4">
                                                <div
                                                    className={`mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${item.daNhan
                                                            ? 'bg-gray-100'
                                                            : 'bg-blue-100'
                                                        }`}
                                                >
                                                    <Bell
                                                        className={`h-5 w-5 ${item.daNhan
                                                                ? 'text-gray-500'
                                                                : 'text-blue-600'
                                                            }`}
                                                    />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
                                                        <h3 className="font-semibold text-gray-900">
                                                            {item.tieuDe}
                                                        </h3>

                                                        <span className="text-xs text-gray-400">
                                                            {new Date(item.createdAt).toLocaleString('vi-VN')}
                                                        </span>
                                                    </div>

                                                    <p className="mt-2 whitespace-pre-line text-sm text-gray-600">
                                                        {item.noiDung}
                                                    </p>

                                                    <div className="mt-3 flex flex-wrap items-center gap-2">
                                                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                                                            {LOAI_THONG_BAO_LABEL[item.loaiThongBao] ??
                                                                item.loaiThongBao}
                                                        </span>

                                                        {item.fileThongBao && (
                                                            <a
                                                                href={item.fileThongBao}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 hover:bg-purple-100"
                                                            >
                                                                <Paperclip className="h-3 w-3" />
                                                                File đính kèm
                                                            </a>
                                                        )}

                                                        {item.daNhan ? (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                                                                <CheckCircle className="h-3 w-3" />
                                                                Đã đọc
                                                            </span>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleMarkAsRead(item.id)}
                                                                className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700 hover:bg-orange-100"
                                                            >
                                                                Đánh dấu đã đọc
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Modal gửi thông báo */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b px-5 py-4">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Gửi thông báo
                            </h2>

                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form
                            className="space-y-4 p-5"
                            onSubmit={(event) => {
                                event.preventDefault();
                                void handleSendNotification();
                            }}
                        >
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Tiêu đề <span className="text-red-500">*</span>
                                </label>

                                <input
                                    value={form.tieuDe}
                                    onChange={(event) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            tieuDe: event.target.value,
                                        }))
                                    }
                                    maxLength={50}
                                    placeholder="Nhập tiêu đề..."
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />

                                <p className="mt-1 text-right text-xs text-gray-400">
                                    {form.tieuDe.length}/50
                                </p>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Nội dung <span className="text-red-500">*</span>
                                </label>

                                <textarea
                                    value={form.noiDung}
                                    onChange={(event) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            noiDung: event.target.value,
                                        }))
                                    }
                                    rows={5}
                                    placeholder="Nhập nội dung thông báo..."
                                    className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Loại thông báo <span className="text-red-500">*</span>
                                </label>

                                <select
                                    value={form.loaiThongBao}
                                    onChange={(event) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            loaiThongBao: event.target.value as LoaiThongBaoEnum,
                                        }))
                                    }
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                >
                                    {LOAI_OPTIONS.map((item) => (
                                        <option key={item} value={item}>
                                            {LOAI_THONG_BAO_LABEL[item] ?? item}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    File thông báo URL
                                </label>

                                <input
                                    value={form.fileThongBao}
                                    onChange={(event) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            fileThongBao: event.target.value,
                                        }))
                                    }
                                    placeholder="[example.com](https://example.com/file.pdf)"
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>

                            <div className="rounded-md bg-blue-50 px-4 py-3 text-sm text-blue-700">
                                Thông báo sẽ được gửi đến{' '}
                                <strong>{(users ?? []).length}</strong>{' '}
                                người dùng.
                            </div>

                            <div className="flex justify-end gap-3 border-t pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Hủy
                                </button>

                                <button
                                    type="submit"
                                    disabled={isSending || loadingUsers}
                                    className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Send className="h-4 w-4" />
                                    {isSending ? 'Đang gửi...' : 'Gửi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Toast */}
            <div className="fixed bottom-6 right-6 z-[60] space-y-3">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`flex items-center gap-2 rounded-md px-4 py-3 text-sm font-medium text-white shadow-lg ${toast.type === 'success'
                                ? 'bg-green-600'
                                : 'bg-red-600'
                            }`}
                    >
                        {toast.type === 'success' ? (
                            <CheckCircle className="h-5 w-5" />
                        ) : (
                            <AlertCircle className="h-5 w-5" />
                        )}

                        {toast.message}
                    </div>
                ))}
            </div>
        </div>
    );
}
