import apiClient from '@/api/axiosClient';

export type RolePermissionRequest = {
    roleId: string;
    permissionsId: string;
};

export async function createRolePermission(dto: RolePermissionRequest) {
    return (await apiClient.post('/admin/role-permissions', dto)).data;
}

export async function getPermissionsByRole(roleId: string) {
    return (await apiClient.get(`/admin/role-permissions/by-roleId?roleId=${encodeURIComponent(roleId)}`)).data;
}

export async function deleteRolePermissionByRequest(dto: RolePermissionRequest) {
    return await apiClient.delete('/admin/role-permissions/delete-dto', { data: dto });
}

export async function deleteRolePermissionById(id: string) {
    return await apiClient.delete(`/admin/role-permissions/${id}`);
}

export default { createRolePermission, getPermissionsByRole, deleteRolePermissionByRequest, deleteRolePermissionById };
