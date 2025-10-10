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
  const secondCoolDown = useRef(
    Number(import.meta.env.VITE_COOL_DOWN_RESEND_OTP) || 60,
  );
  const [coolDown, setCoolDown] = React.useState(secondCoolDown.current || 60);
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
      setCoolDown(secondCoolDown.current);
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  // countdown timer for coolDown
  React.useEffect(() => {
    if (coolDown > 0) {
      const timer = setInterval(() => setCoolDown((c) => c - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [coolDown]);

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
            onKeyDown={handleKeyDown}
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
            onKeyDown={handleKeyDown}
            variant="text"
            onClick={() => resendOtp.mutate({ email })}
            disabled={coolDown > 0}
            loading={resendOtp.isPending}
          >
            {coolDown > 0 ? `Resend OTP in ${coolDown}s` : 'Resend OTP'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ConfirmOtpForm;
