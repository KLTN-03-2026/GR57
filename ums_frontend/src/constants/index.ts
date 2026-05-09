// Constants for the application
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://learning-hub-lhmp.onrender.com/api';
export const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT ? parseInt(import.meta.env.VITE_API_TIMEOUT) : 10000;
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';
export const DEBUG_LOGS = import.meta.env.VITE_ENABLE_DEBUG_LOGS === 'true';

export const API_ENDPOINTS = {
  // Auth  — POST /api/auth/*
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',

  // Tuition
  TUITION: '/tuitions',
  TUITION_BY_ID: (id: string) => `/tuitions/${id}`,
  TUITION_BY_STATUS: (status: string) => `/tuitions?status=${status}`,
  TUITION_STATS: '/tuitions/stats',
};

export const TOKEN_STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  REMEMBER_ME: 'rememberMe',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

export const USER_ROLES = {
  ADMIN: 'admin',
  STUDENT: 'student',
  INSTRUCTOR: 'instructor',
  ACCOUNTANT: 'accountant',
} as const;

export const DEMO_USERS = [
  {
    email: 'locloclock41@gmail.com',
    password: 'Nvl2004@@@',
    role: 'admin' as const,
  },
  {
    email: 'student@learninghub.com',
    password: 'student123',
    role: 'student' as const,
  },
  {
    email: 'teacher@learninghub.com',
    password: 'teacher123',
    role: 'instructor' as const,
  },
];
