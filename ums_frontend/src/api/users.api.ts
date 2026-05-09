import apiClient from '@/api/axiosClient';
import { UsersItem, CreateUserRequest, UpdateUserRequest, AuthRolePermission, RoleItem, UserRoleAssignment } from '@/api/types';

export async function getUsers(): Promise<UsersItem[]> {
    return (await apiClient.get('/admin/users')).data;
}

/**
 * Lấy user theo ID
 */
export async function getUserById(
    id: string
): Promise<UsersItem> {
    return (
        await apiClient.get(`/admin/users/${id}`)
    ).data;
}

/**
 * Tìm kiếm user
 */
export async function searchUsers(
    keyword: string
): Promise<UsersItem[]> {
    return (
        await apiClient.get(
            `/admin/users/search?keyword=${encodeURIComponent(keyword)}`
        )
    ).data;
}

/**
 * Tạo user
 */
export async function createUser(
    data: CreateUserRequest
): Promise<UsersItem> {
    return (
        await apiClient.post('/admin/users', data)
    ).data;
}

/**
 * Cập nhật user
 */
export async function updateUser(
    id: string,
    data: UpdateUserRequest
): Promise<UsersItem> {
    return (
        await apiClient.put(`/admin/users/${id}`, data)
    ).data;
}

/**
 * Xóa user
 */
export async function deleteUser(id: string) {
    return (
        await apiClient.delete(`/admin/users/${id}`)
    ).data;
}

/**
 * =========================
 * ROLE & PERMISSION API
 * =========================
 */

/**
 * Lấy role và permission của user
 */
export async function getUserRolesAndPermissions(
    userId: string
): Promise<AuthRolePermission[]> {
    return (
        await apiClient.get(
            `/admin/users/list-role?userId=${encodeURIComponent(userId)}`
        )
    ).data;
}

/**
 * Alias ngắn gọn
 */
export const getUserRoles = getUserRolesAndPermissions;

/**
 * =========================
 * USER-ROLE ASSIGNMENT API
 * =========================
 */

export async function getUserRoleAssignments(userId: string): Promise<UserRoleAssignment[]> {
    const res = await apiClient.get(`/admin/user-role/user/${userId}`);
    const data = res.data;
    return Array.isArray(data) ? data : data ? [data] : [];
}

export async function assignRoleToUser(usersId: string, roleId: string): Promise<UserRoleAssignment> {
    return (await apiClient.post('/admin/user-role', { usersId, roleId })).data;
}

export async function removeUserRole(id: string): Promise<void> {
    await apiClient.delete(`/admin/user-role/${id}`);
}

export async function getAllRoles(): Promise<RoleItem[]> {
    return (await apiClient.get('/admin/role')).data;
}

/**
 * =========================
 * EXPORT DEFAULT
 * =========================
 */

export default {
    getUsers,
    getUserById,
    searchUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserRolesAndPermissions,
    getUserRoles,
    getUserRoleAssignments,
    assignRoleToUser,
    removeUserRole,
    getAllRoles,
};