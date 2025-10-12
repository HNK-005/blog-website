import { useNavigate, useSearchParams } from 'react-router';
import { AuthLayout } from 'src/components/layouts';
import { paths } from 'src/config/paths';
import { LoginForm } from 'src/features/auth/components/login-form';
import { useAuthStore } from 'src/features/auth/store/auth-store';
import type { AuthResponse } from 'src/types/api';

const RegisterRoot = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const { setUser } = useAuthStore.getState();

  const redirectTo = searchParams.get('redirectTo');
  const handleLoginSuccess = (data: AuthResponse) => {
    close();
    setUser(data.user);
    navigate(redirectTo || paths.app.home.getHref(), { replace: true });
  };

  return (
    <AuthLayout title="Welcome Back">
      <LoginForm onSuccess={handleLoginSuccess} />
    </AuthLayout>
  );
};

export default RegisterRoot;
