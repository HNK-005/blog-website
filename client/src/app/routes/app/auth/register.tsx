import { AuthLayout } from 'src/components/layouts';
import { RegisterForm } from 'src/features/auth/components/register-form';
import toast from 'react-hot-toast';
import { Dialog } from '@mui/material';
import { useDisclosure } from 'src/hook/use-disclosure';
import * as React from 'react';
import ConfirmOtpForm from 'src/features/auth/components/confirm-otp-form';
import { useNavigate, useSearchParams } from 'react-router';
import { paths } from 'src/config/paths';

const RegisterRoot = () => {
  const { isOpen, open, close } = useDisclosure(false);
  const [email, setEmail] = React.useState('');
  const [searchParams] = useSearchParams();

  const redirectTo = searchParams.get('redirectTo');
  const navigate = useNavigate();

  const handleRegisterSuccess = (
    _data: any,
    variables: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    },
  ) => {
    if (!variables.email) {
      return toast.error('Email invalid');
    }
    setEmail(variables.email);
    open();
  };

  const handleConfirmSuccess = () => {
    close();
    toast.success('Confirm email completed, please login');
    navigate(redirectTo || paths.app.auth.login.getHref(), { replace: true });
  };

  return (
    <AuthLayout title="Join us today">
      <RegisterForm onSuccess={handleRegisterSuccess} />
      <Dialog open={isOpen}>
        <ConfirmOtpForm email={email} onSuccess={handleConfirmSuccess} />
      </Dialog>
    </AuthLayout>
  );
};

export default RegisterRoot;
