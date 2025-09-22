import { AuthLayout } from '@/components/layouts';
import { paths } from '@/config/paths';
import { RegisterForm } from '@/features/auth/components/register-form';
import { useNavigate } from 'react-router';

const RegisterRoot = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate(paths.app.auth.verifyEmail.path, {
      state: { email: 'abc@gmail.com' },
      replace: true,
    });
  };

  return (
    <AuthLayout title="Join us today">
      <RegisterForm onSuccess={handleSuccess} />
    </AuthLayout>
  );
};

export default RegisterRoot;
