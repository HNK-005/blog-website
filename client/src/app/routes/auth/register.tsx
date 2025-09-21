import { AuthLayout } from '@/components/layouts';
import { RegisterForm } from '@/features/auth/components/register-form';

const RegisterRoot = () => {
  return (
    <AuthLayout title="Join us today">
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterRoot;
