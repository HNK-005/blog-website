import { AuthLayout } from '@/components/layouts';
import { RegisterForm } from '@/features/auth/components/register-form';
import toast from 'react-hot-toast';

const RegisterRoot = () => {
  const handleSuccess = () => {
    toast.success('Register success');
  };
  return (
    <AuthLayout title="Join us today">
      <RegisterForm onSuccess={handleSuccess} />
    </AuthLayout>
  );
};

export default RegisterRoot;
