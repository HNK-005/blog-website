import { AuthLayout } from '@/components/layouts';
import { SignUpForm } from '@/features/auth/components/sign-up-form';
const RegisterRoute = () => {
  return (
    <AuthLayout title="Join us today">
      <SignUpForm />
    </AuthLayout>
  );
};

export default RegisterRoute;
