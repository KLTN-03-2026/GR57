// Types for Users

// Types for Roles
export type RoleItem = {
    id: string;
    maRole: string;
    moTa?: string;
    createdAt?: string;
};

// Types for Permissions
export type PermissionsItem = {
    id: string;
    maPermissions: string;
    moTa?: string;
};

// Types for UserRole (Assignment)
export type UserRoleItem = {
    id: string;
    usersId: string;
    roleId: string;
    createdAt: string;
    updatedAt?: string;
};

// Types for RolePermissions (Assignment)
export type RolePermissionsItem = {
    id: string;
    roleId: string;
    permissionsId: string;
};

// Auth Types
export type AuthRolePermission = {
    maRole: string;
    maPermissions?: string | null;
};

// School Types (existing)
export type SchoolItem = {
    id: string;
    maTruong: string;
    tenTruong: string;
    diaChi?: string;
    moTa?: string;
    nguoiDaiDien?: string;
    ngayThanhLap?: string;
    createdAt?: string;
    updatedAt?: string;
};

export type UsersItem = {
    id: string;
    userName: string;
    email: string;
    cccd: string;
    hoTen: string;
    diaChi?: string;
    gioiTinh?: 'NAM' | 'NU';
    ngaySinh?: string;
    soDienThoai?: string;
    trangThai: boolean;
    ghiChu?: string;
    createAt?: string;
    updateAt?: string;
};

export type CreateUserRequest = {
    userName: string;
    passWord: string;
    email: string;
    cccd: string;
    hoTen: string;
    diaChi?: string;
    gioiTinh?: 'NAM' | 'NU';
    ngaySinh?: string;
    soDienThoai?: string;
    trangThai: boolean;
    ghiChu?: string;
};

export type UpdateUserRequest = Partial<CreateUserRequest>;

export type UserRoleAssignment = {
    id: string;
    userId: string;
    roleId: string;
    userName: string;
    maRole: string;
    createdAt?: string;
    updatedAt?: string;
};
