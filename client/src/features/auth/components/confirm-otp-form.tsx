import React from 'react';
import { MuiOtpInput } from 'mui-one-time-password-input';
import { Box, Button, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { confirmEmail, type ConfirmInput } from 'src/lib/auth';
import toast from 'react-hot-toast';

export function matchIsNumeric(text: string) {
  const isNumber = typeof text === 'number';
  const isString = typeof text === 'string';
  return (isNumber || (isString && text !== '')) && !isNaN(Number(text));
}

const validateChar = (value: string) => {
  return matchIsNumeric(value);
};

type ConfirmOtpForm = {
  email: string;
  length?: number;
  onSucess: () => void;
};

const ConfirmOtpForm = ({ email, length = 6, onSucess }: ConfirmOtpForm) => {
  const [otp, setOtp] = React.useState('');
  const [cooldown, setCooldown] = React.useState(60);

  const confirm = useMutation({
    mutationFn: async (data: ConfirmInput) => {
      return await confirmEmail(data);
    },
    onSuccess: onSucess,
  });

  const handleChange = (newValue: string) => {
    setOtp(newValue);
  };

  const handleSubmit = () => {
    if (otp.length < length) {
      return toast.error('OTP invalid!');
    }
    confirm.mutate({ email, otp });
  };

  // countdown timer cho cooldown
  React.useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  return (
    <Box paddingX={10} paddingY={8}>
      <Box textAlign="center">
        <Typography variant="h6" mb={4}>
          Enter the OTP code sent to {email}
        </Typography>

        <Box display="flex" gap={1} justifyContent="center" mb={4}>
          <MuiOtpInput
            length={length}
            value={otp}
            validateChar={validateChar}
            onChange={handleChange}
          />
        </Box>

        <Button
          variant="contained"
          onClick={handleSubmit}
          loading={confirm.isPending}
        >
          Confirm
        </Button>
        <Box mt={3}>
          <Button variant="text" onClick={() => {}} disabled={cooldown > 0}>
            {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ConfirmOtpForm;
