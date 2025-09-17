import { AuthLayout } from '@/components/layouts';
import { SignUpForm } from '@/features/auth/components/sign-up-form';
const RegisterRoute = () => {
  return (
    <AuthLayout title="Join us today">
      <SignUpForm onSuccess={() => console.log('Sign Up Complete')} />
    </AuthLayout>
  );
};

export default RegisterRoute;
