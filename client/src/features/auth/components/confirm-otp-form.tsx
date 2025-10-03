import React from 'react';
import { MuiOtpInput } from 'mui-one-time-password-input';
import { Box, Button, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { confirmEmail, type ConfirmInput } from 'src/lib/auth';

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

const ConfirmOtpForm = ({ email, length, onSucess }: ConfirmOtpForm) => {
  const [otp, setOtp] = React.useState('');

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
    confirm.mutate({ email, otp });
  };

  return (
    <Box>
      <Box textAlign="center">
        <Typography variant="h6" mb={2}>
          Enter the OTP code sent to {email}
        </Typography>

        <Box display="flex" gap={1} justifyContent="center" mb={2}>
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
      </Box>
    </Box>
  );
};

export default ConfirmOtpForm;
