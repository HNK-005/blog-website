import { AuthLayout } from 'src/components/layouts';
import { LoginForm } from 'src/features/auth/components/login-form';

const RegisterRoot = () => {
  const handleLoginSuccess = () => {};

  return (
    <AuthLayout title="Welcome Back">
      <LoginForm onSuccess={handleLoginSuccess} />
    </AuthLayout>
  );
};

export default RegisterRoot;
