import { AuthLayout } from '@/components/layouts';
import { SignInForm } from '@/features/auth/components/sign-in-form';

const SignInRoute = () => {
  return (
    <AuthLayout title="Welcome back">
      <SignInForm onSuccess={() => console.log('Sign In Complete')} />
    </AuthLayout>
  );
};

export default SignInRoute;
