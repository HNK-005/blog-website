import { AuthLayout } from 'src/components/layouts';
import ConfirmOtpForm from 'src/features/auth/components/confirm-otp-form';
import { useLocation, useNavigate } from 'react-router';
import NotFoundRoute from '../not-found';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { paths } from 'src/config/paths';

const VerifyEmailRoute = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};
  const [otpLength] = useState(6);

  const handleSuccess = () => {
    toast.success('Confirm email completed');
    navigate(paths.app.home.getHref());
  };

  if (!email) return <NotFoundRoute />;

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
