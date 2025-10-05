import { useNavigate } from 'react-router';
import { AuthLayout } from 'src/components/layouts';
import { paths } from 'src/config/paths';
import { LoginForm } from 'src/features/auth/components/login-form';

const RegisterRoot = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate(paths.app.home.getHref());
  };

  return (
    <AuthLayout title="Welcome Back">
      <LoginForm onSuccess={handleLoginSuccess} />
    </AuthLayout>
  );
};

export default RegisterRoot;
