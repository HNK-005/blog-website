import { AuthLayout } from '@/components/layouts';
import ConfirmOtpForm from '@/features/auth/components/confirm-otp-form';
import { useLocation, useNavigate } from 'react-router';
import NotFoundRoute from '../not-found';
import { useState } from 'react';

const VerifyEmailRoute = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};
  const [otpLength] = useState(6);
  const [backHistory] = useState(-1);

  const handleSuccess = () => {
    navigate(backHistory);
  };

  // if (!email) return <NotFoundRoute />;

  return (
    <AuthLayout title="Confirm OTP">
      <ConfirmOtpForm
        onSucess={handleSuccess}
        length={otpLength}
        email={email}
      />
    </AuthLayout>
  );
};

export default VerifyEmailRoute;
