import { useAuth } from '@/hooks';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermission?: string | string[];
}

export function ProtectedRoute({ children, requiredRole, requiredPermission }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  // derive unauthorized by role or missing permission
  const isUnauthorized = (() => {
    if (requiredRole && user?.role !== requiredRole) return true;
    if (!requiredPermission) return false;
    const required = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission];
    const userPerms = user?.permissions ?? [];
    // if none of required permissions exist on user → unauthorized
    const hasAny = required.some(r => userPerms.includes(r));
    return !hasAny;
  })();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    if (isUnauthorized) {
      navigate('/');
    }
  }, [isAuthenticated, isUnauthorized, navigate]);

  if (!isAuthenticated || isUnauthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
