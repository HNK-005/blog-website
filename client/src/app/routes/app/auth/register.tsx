import { AuthLayout } from 'src/components/layouts';
import { RegisterForm } from 'src/features/auth/components/register-form';
import { useNavigate, useSearchParams } from 'react-router';
import { paths } from 'src/config/paths';

const RegisterRoot = () => {
  const [searchParams] = useSearchParams();

  const redirectTo = searchParams.get('redirectTo');
  const navigate = useNavigate();

  const handleRegisterSuccess = () => {
    navigate(redirectTo || paths.app.auth.login.getHref(), { replace: true });
  };

  return (
    <AuthLayout title="Join us today">
      <RegisterForm onSuccess={handleRegisterSuccess} />
    </AuthLayout>
  );
};

export default RegisterRoot;
