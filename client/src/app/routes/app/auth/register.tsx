import { AuthLayout } from 'src/components/layouts';
import { RegisterForm } from 'src/features/auth/components';
import { useNavigate, useSearchParams } from 'react-router';
import { paths } from 'src/config/paths';
import toast from 'react-hot-toast';

const RegisterRoot = () => {
  const [searchParams] = useSearchParams();

  const redirectTo = searchParams.get('redirectTo');
  const navigate = useNavigate();

  const handleRegisterSuccess = () => {
    toast.success(
      'We sent an email verification to your email. Please check your mail',
      {
        duration: 5000,
      },
    );
    navigate(redirectTo || paths.app.auth.login.getHref(), { replace: true });
  };

  return (
    <AuthLayout title="Join us today">
      <RegisterForm onSuccess={handleRegisterSuccess} />
    </AuthLayout>
  );
};

export default RegisterRoot;
