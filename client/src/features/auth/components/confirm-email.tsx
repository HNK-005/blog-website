import * as React from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Button,
  Divider,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { confirmEmail, resendEmail } from 'src/lib/auth';
import { Link as RouterLink } from 'react-router';
import { paths } from 'src/config/paths';

type ConfirmEmailProps = {
  hash: string;
  email: string;
};

export const ConfirmEmail = ({ hash, email }: ConfirmEmailProps) => {
  const confirmMutation = useMutation({
    mutationFn: confirmEmail,
  });

  const resendEmailMutation = useMutation({
    mutationFn: resendEmail,
  });

  const second = React.useRef(parseInt(import.meta.env.VITE_COOL_DOWN_RESEND));

  const [cooldown, setCooldown] = React.useState(second.current);

  React.useEffect(() => {
    if (hash) {
      confirmMutation.mutate({ hash });
    }
  }, [hash]);

  React.useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = () => {
    if (!email || cooldown > 0) return;
    resendEmailMutation.mutate(
      { email },
      {
        onSuccess: () => {
          setCooldown(second.current);
        },
      },
    );
  };

  const isLoading = confirmMutation.isPending || resendEmailMutation.isPending;
  const isResendDisabled = resendEmailMutation.isPending || cooldown > 0;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.50',
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: '100%',
          maxWidth: 420,
          p: 4,
          borderRadius: 4,
          textAlign: 'center',
        }}
      >
        {/* Header */}
        <Typography
          variant="h5"
          fontWeight={700}
          gutterBottom
          sx={{ color: 'primary.main' }}
        >
          Confirm your email ✉️
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          We’re verifying your email to keep your account secure.
        </Typography>

        {/* Loading / Status */}

        {isLoading && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              gap: 1.5,
              mb: 3,
            }}
          >
            <CircularProgress size={28} />
            <Typography variant="body2">Processing, please wait...</Typography>
          </Box>
        )}

        {/* Divider */}
        <Divider sx={{ my: 3 }} />

        {/* Resend Section */}
        <Typography variant="body2" color="text.secondary" mb={2}>
          Didn’t get the email? You can resend the confirmation link below 👇
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          sx={{
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 600,
            mb: 2,
          }}
          onClick={handleResend}
          disabled={isResendDisabled}
        >
          {resendEmailMutation.isPending
            ? 'Sending...'
            : cooldown > 0
              ? `Resend (${cooldown}s)`
              : 'Resend email'}
        </Button>

        <Button
          component={RouterLink}
          to={paths.app.home.getHref()}
          variant="outlined"
          size="large"
          fullWidth
          sx={{
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Go back home
        </Button>

        <Typography
          variant="caption"
          display="block"
          color="text.disabled"
          mt={3}
        >
          Need help? Contact support@yourapp.com
        </Typography>
      </Paper>
    </Box>
  );
};
