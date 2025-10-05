import { Dialog } from '@mui/material';
import type { AxiosError } from 'axios';
import * as React from 'react';
import { useNavigate } from 'react-router';
import { AuthLayout } from 'src/components/layouts';
import { paths } from 'src/config/paths';
import { LoginForm } from 'src/features/auth/components/login-form';
import { OtpStepper } from 'src/features/auth/components/otp-stepper';
import { useDisclosure } from 'src/hook/use-disclosure';

const RegisterRoot = () => {
  const navigate = useNavigate();

  const [email, setEmail] = React.useState('');
  const { isOpen, open, close } = useDisclosure(false);

  const handleLoginSuccess = () => {
    close();
    navigate(paths.app.home.getHref());
  };

  const handleLoginOnError = (
    error: AxiosError,
    variables: {
      email: string;
      password: string;
    },
  ) => {
    const data = error.response?.data as { errors?: { email?: string } };
    if (data?.errors?.email === 'notActive') {
      setEmail(variables.email);
      open();
    }
  };

  return (
    <AuthLayout title="Welcome Back">
      <LoginForm onSuccess={handleLoginSuccess} onError={handleLoginOnError} />
      <Dialog open={isOpen}>
        <OtpStepper email={email} onSuccess={handleLoginSuccess} />
      </Dialog>
    </AuthLayout>
  );
};

export default RegisterRoot;
