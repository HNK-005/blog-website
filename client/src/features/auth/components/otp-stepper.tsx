import * as React from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
} from '@mui/material';
import ConfirmOtpForm from './confirm-otp-form';
import { useDisclosure } from 'src/hook/use-disclosure';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useMutation } from '@tanstack/react-query';
import { resendOtp } from 'src/lib/auth';

const steps = ['Send OTP', 'Enter OTP', 'Done'];

type OtpStepperProps = {
  email: string;
  onSuccess: () => void;
};

export const OtpStepper = ({ email, onSuccess }: OtpStepperProps) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const { isOpen: disabled, close: complete } = useDisclosure(false);
  const sendOtp = useMutation({
    mutationFn: async (data: { email: string }) => {
      return await resendOtp(data);
    },
    onSuccess: () => {
      setActiveStep(1);
    },
  });

  // Step handlers
  const handleNext = () => {
    if (activeStep < 0 || activeStep >= steps.length) return;
    const action: Record<number, () => void> = {
      0: () => sendOtp.mutate({ email }),
      1: () => {},
      2: () => {
        complete();
        onSuccess();
      },
    };
    action[activeStep]();
  };

  // Render form each one step
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography>Enter email:</Typography>
            <TextField
              label="Email"
              type="email"
              fullWidth
              sx={{ mt: 2 }}
              value={email}
              disabled
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <ConfirmOtpForm email={email} onSuccess={() => setActiveStep(2)} />
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="success.main">
              <CheckCircleIcon /> Confirm completed
            </Typography>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        minWidth: 600,
        my: 6,
        p: 4,
        boxSizing: 'border-box',
      }}
    >
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 10 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 3, mb: 2 }}>{renderStepContent(activeStep)}</Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Box sx={{ flex: '1 1 auto' }} />

        {activeStep !== 1 && (
          <Button
            onClick={handleNext}
            loading={activeStep === 0 ? sendOtp.isPending : false}
            disabled={disabled}
          >
            {(activeStep === 0 && 'Continue') ||
              (activeStep === 2 && 'Complete')}
          </Button>
        )}
      </Box>
    </Box>
  );
};
