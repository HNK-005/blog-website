import React, { useRef } from 'react';
import { MuiOtpInput } from 'mui-one-time-password-input';
import { Box, Button, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import {
  confirmEmail,
  sendOtp,
  type ConfirmInput,
  type SendOtp,
} from 'src/lib/auth';

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
  onSuccess: () => void;
};

const ConfirmOtpForm = ({ email, length = 6, onSuccess }: ConfirmOtpForm) => {
  const [otp, setOtp] = React.useState('');
  const secondCooldown = useRef(
    Number(import.meta.env.VITE_COOLDOWN_RESEND_OTP) || 60,
  );
  const [cooldown, setCooldown] = React.useState(secondCooldown.current || 60);
  const otpRef = useRef<HTMLDivElement>(null);

  const confirm = useMutation({
    mutationFn: async (data: ConfirmInput) => {
      return await confirmEmail(data);
    },
    onSuccess: onSuccess,
  });

  const resendOtp = useMutation({
    mutationFn: async (data: SendOtp) => {
      return await sendOtp(data);
    },
    onSuccess: () => {
      setCooldown(secondCooldown.current);
    },
  });

  const handleChange = (newValue: string) => {
    setOtp(newValue);
  };

  const handleSubmit = () => {
    if (otp.length < length) {
      if (otpRef.current) {
        const inputs = otpRef.current.querySelectorAll('input');
        const unfocusedInput = Array.from(inputs).find((el) => el.value === ''); //Find element input has not value
        unfocusedInput?.focus();
        return;
      }
    }
    confirm.mutate({ email, otp });
  };

  // countdown timer for cooldown
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
            ref={otpRef}
            length={length}
            value={otp}
            validateChar={validateChar}
            onChange={handleChange}
            autoFocus
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
          <Button
            variant="text"
            onClick={() => resendOtp.mutate({ email })}
            disabled={cooldown > 0}
            loading={resendOtp.isPending}
          >
            {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ConfirmOtpForm;
