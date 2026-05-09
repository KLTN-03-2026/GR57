import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { LoginForm } from '@/components/forms/LoginForm';
import { LoginIllustration } from '@/components/common/LoginIllustration';
import { ForgotPasswordForm } from '@/components/forms/ForgotPasswordForm';
import { EmailSentNotification } from '@/components/notification/EmailSentNotification';
import { ResetPasswordForm } from '@/components/forms/ResetPasswordForm';
import { PasswordResetSuccess } from '@/components/forms/PasswordResetSuccess';
import { GraduationCap } from 'lucide-react';
import { useAuth } from '@/hooks';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const hasNavigated = useRef(false);
  const [showForgotPassword, setShowForgotPassword]   = useState(false);
  const [showEmailSent, setShowEmailSent]             = useState(false);
  const [showResetPassword, setShowResetPassword]     = useState(false);
  const [showResetSuccess, setShowResetSuccess]       = useState(false);
  const [sentEmail, setSentEmail]                     = useState('');
  const [isRedirecting, setIsRedirecting]             = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      hasNavigated.current = false;
      setIsRedirecting(false);
    }
  }, [isAuthenticated]);

  // Redirect sau khi đăng nhập thành công dựa theo role
  useEffect(() => {
    if (location.pathname !== '/' && location.pathname !== '/login') return;

    if (isAuthenticated && user && !hasNavigated.current) {
      hasNavigated.current = true;
      setIsRedirecting(true);

      const redirectPath =
        user.role === 'student'     ? '/student/dashboard'    :
        user.role === 'lecture'  ? '/lecture/dashboard'    :
        user.role === 'admin'       ? '/admin/dashboard'      :
        user.role === 'accountant'  ? '/accountant/dashboard' :
        '/';

      const timer = setTimeout(() => navigate(redirectPath, { replace: true }), 100);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.role]);

  const handleForgotPasswordSuccess = (email: string) => {
    setSentEmail(email);
    setShowForgotPassword(false);
    setShowEmailSent(true);
  };

  const handleResetPasswordSuccess = () => {
    setShowResetPassword(false);
    setShowResetSuccess(true);
  };

  const handleResetPasswordCancel = () => {
    setShowResetPassword(false);
    setShowForgotPassword(false);
    setShowEmailSent(false);
    setSentEmail('');
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setShowEmailSent(false);
    setShowResetPassword(false);
    setShowResetSuccess(false);
    setSentEmail('');
  };

  return (
    <div className="size-full flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5">
        <LoginIllustration />
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-2xl shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Learning Hub
              </h1>
            </div>
          </div>

          {showResetSuccess ? (
            <PasswordResetSuccess onBackToLogin={handleBackToLogin} />
          ) : showResetPassword ? (
            <ResetPasswordForm
              onSuccess={handleResetPasswordSuccess}
              onCancel={handleResetPasswordCancel}
            />
          ) : showEmailSent ? (
            <EmailSentNotification email={sentEmail} onBackToLogin={handleBackToLogin} />
          ) : showForgotPassword ? (
            <ForgotPasswordForm
              onBack={handleBackToLogin}
              onSuccess={handleForgotPasswordSuccess}
            />
          ) : (
            <>
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h2>
                  <p className="text-gray-600">Chào mừng bạn trở lại với Learning Hub</p>
                </div>
                <LoginForm onForgotPassword={() => setShowForgotPassword(true)} />
              </div>

              <div className="mt-6 text-center text-sm text-gray-500">
                <p>© 2026 Learning Hub. All rights reserved.</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Redirecting Overlay */}
      {isRedirecting && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <div className="mb-4 inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent" />
            </div>
            <p className="text-gray-600 font-medium">Đang chuyển hướng...</p>
          </div>
        </div>
      )}
    </div>
  );
}
