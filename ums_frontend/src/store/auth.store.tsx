import React, { createContext, useState, useCallback, useEffect, useMemo } from 'react';
import { AuthContextType, User, UserRole } from '@/types';
import { storageUtils } from '@/utils/storage';
import { isTokenExpired, getErrorMessage } from '@/utils';
import authApi from '@/api/auth.api';
import usersApi from '@/api/users.api';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Backend trả về role dạng "ADMIN", "STUDENT", "LECTURER", "ACCOUNTING"
const mapBackendRole = (backendRole: string): UserRole => {
  switch (backendRole.toUpperCase()) {
    case 'ADMIN': return 'admin';
    case 'STUDENT': return 'student';
    case 'LECTURER':
    case 'LECTURE': return 'lecture';
    case 'ACCOUNTING': return 'accountant';
    default: return 'student';
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Khôi phục session từ localStorage khi app mount
  useEffect(() => {
    const storedUser = storageUtils.getUser();
    const storedToken = storageUtils.getAccessToken();

    if (storedUser && storedToken && !isTokenExpired(storedToken)) {
      setUser(storedUser);
      setAccessToken(storedToken);
    } else {
      storageUtils.clearAll();
    }
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await authApi.login({ username, password });

      // Map LoginResponseDTO → frontend User
      const backendRoles: string[] = res.drole ?? [];
      const mappedRoles = backendRoles.map(r => mapBackendRole(r || ''));

      // Fetch user roles & permissions (backend returns pairings)
      let permissions: string[] = [];
      try {
        const authPairs = await usersApi.getUserRolesAndPermissions(res.id);
        const permSet = new Set<string>();
        const roleSet = new Set<string>();
        authPairs.forEach((p) => {
          if (p.maPermissions) permSet.add(p.maPermissions);
          if (p.maRole) roleSet.add(p.maRole);
        });
        permissions = Array.from(permSet);
        // Merge roles từ authPairs vào mappedRoles nếu chưa có
        roleSet.forEach(r => {
          if (!backendRoles.includes(r)) {
            backendRoles.push(r);
            const mapped = mapBackendRole(r);
            if (!mappedRoles.includes(mapped)) mappedRoles.push(mapped);
          }
        });
      } catch (e) {
        // ignore — permissions may be empty if endpoint not accessible
      }

      const userData: User = {
        id: res.id,
        username: res.userName,
        fullName: res.fullName,
        role: mappedRoles[0] ?? 'student',
        roles: mappedRoles,
        permissions,
      };

      storageUtils.setUser(userData);
      storageUtils.setAccessToken(res.accessToken);
      storageUtils.setRefreshToken(res.refreshToken);

      setUser(userData);
      setAccessToken(res.accessToken);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = storageUtils.getRefreshToken();
    try {
      if (refreshToken) {
        await authApi.logout({ refreshToken });
      }
    } catch {
      // Bỏ qua lỗi logout — vẫn clear session phía client
    } finally {
      storageUtils.clearAll();
      setUser(null);
      setAccessToken(null);
      setError(null);
    }
  }, []);

  const refreshAccessToken = useCallback(async () => {
    const refreshToken = storageUtils.getRefreshToken();
    if (!refreshToken) {
      storageUtils.clearAll();
      setUser(null);
      setAccessToken(null);
      return;
    }

    try {
      const res = await authApi.refreshToken({ refreshToken });
      storageUtils.setAccessToken(res.accessToken);
      storageUtils.setRefreshToken(res.refreshToken);
      setAccessToken(res.accessToken);
    } catch (err) {
      storageUtils.clearAll();
      setUser(null);
      setAccessToken(null);
      throw err;
    }
  }, []);

  const value = useMemo<AuthContextType>(() => ({
    user,
    accessToken,
    isLoading,
    error,
    isAuthenticated: !!user && !!accessToken,
    login,
    logout,
    refreshAccessToken,
  }), [user, accessToken, isLoading, error, login, logout, refreshAccessToken]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
