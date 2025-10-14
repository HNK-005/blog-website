import * as React from 'react';
import { Box, Paper, Typography, Button, Divider } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { confirmEmail } from 'src/lib/auth';
import { Link as RouterLink } from 'react-router';
import { paths } from 'src/config/paths';
import LoadingPage from 'src/components/loadings/loading-page';

type ConfirmEmailProps = {
  hash: string;
};

export const ConfirmEmail = ({ hash }: ConfirmEmailProps) => {
  const confirmMutation = useMutation({
    mutationFn: confirmEmail,
  });

  React.useEffect(() => {
    if (hash) {
      confirmMutation.mutate({ hash });
    }
  }, [hash]);

  if (confirmMutation.isPending) {
    return <LoadingPage />;
  }

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

        {/* Divider */}
        <Divider sx={{ my: 3 }} />

        <Button
          component={RouterLink}
          to={paths.app.auth.login.getHref()}
          variant="outlined"
          size="large"
          fullWidth
          sx={{
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Go back login
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
