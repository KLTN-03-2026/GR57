import apiClient from '@/api/axiosClient';

export type RolePermissionsItem = {
    id: string;
    roleId: string;
    permissionsId: string;
};

export type RolePermissionsAdminRequestDTO = {
    roleId: string;
    permissionsId: string;
};

export async function getRolePermissions(): Promise<RolePermissionsItem[]> {
    return (await apiClient.get('/admin/role-permissions')).data;
}

export async function getRolePermissionsByRole(roleId: string) {
    return (await apiClient.get(`/admin/role-permissions/by-roleId?roleId=${encodeURIComponent(roleId)}`)).data as RolePermissionsItem[];
}

export async function assignRolePermission(data: RolePermissionsAdminRequestDTO) {
    return (await apiClient.post('/admin/role-permissions', data)).data as RolePermissionsItem;
}

export async function removeRolePermission(id: string) {
    return (await apiClient.delete(`/admin/role-permissions/${id}`)).data;
}

export async function removeRolePermissionByRequest(data: RolePermissionsAdminRequestDTO) {
    return (await apiClient.delete('/admin/role-permissions/delete-dto', { data })).data;
}

export default {
    getRolePermissions,
    getRolePermissionsByRole,
    assignRolePermission,
    removeRolePermission,
    removeRolePermissionByRequest
};
