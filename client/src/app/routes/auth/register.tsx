import { AuthLayout } from 'src/components/layouts';
import { RegisterForm } from 'src/features/auth/components/register-form';
import toast from 'react-hot-toast';
import { Dialog } from '@mui/material';
import { useDisclosure } from 'src/hook/use-disclosure';
import { useState } from 'react';
import ConfirmOtpForm from 'src/features/auth/components/confirm-otp-form';

const RegisterRoot = () => {
  const { isOpen, open, close } = useDisclosure(false);
  const [email, setEmail] = useState('');

  const handleRegisterSuccess = (email?: string) => {
    if (!email) {
      return toast.error('ERROR');
    }
    setEmail(email);
    open();
  };

  const handleConfirmSuccess = () => {
    close();
    //navigate login
  };

  return (
    <AuthLayout title="Join us today">
      <RegisterForm onSuccess={handleRegisterSuccess} />
      <Dialog open={isOpen}>
        <ConfirmOtpForm email={email} onSucess={handleConfirmSuccess} />
      </Dialog>
    </AuthLayout>
  );
};

export default RegisterRoot;
