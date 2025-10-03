import { AuthLayout } from 'src/components/layouts';
import { paths } from 'src/config/paths';
import { RegisterForm } from 'src/features/auth/components/register-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

const RegisterRoot = () => {
  const navigate = useNavigate();

  const handleSuccess = (email?: string) => {
    if (!email) {
      return toast.error('ERROR');
    }
    navigate(paths.app.auth.verifyEmail.path, {
      state: { email },
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
