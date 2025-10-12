import { useForm, type SubmitHandler } from 'react-hook-form';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  InputAdornment,
  IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link as RouterLink } from 'react-router';
import {
  loginInputSchema,
  loginWithEmailAndPassword,
  type LoginInput,
} from 'src/lib/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDisclosure } from 'src/hook/use-disclosure';
import { paths } from 'src/config/paths';
import { useMutation } from '@tanstack/react-query';
import type { AuthResponse } from 'src/types/api';

type LoginFormProps = {
  onSuccess: (data: AuthResponse) => void;
};

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const login = useMutation({
    mutationFn: async (data: LoginInput) => {
      return await loginWithEmailAndPassword(data);
    },
    onSuccess,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginInputSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { isOpen: showPassword, toggle: toggleShowPassword } =
    useDisclosure(false);

  const onSubmit: SubmitHandler<LoginInput> = (data) => {
    login.mutate(data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Box mb={2}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
      </Box>

      <Box mb={2}>
        <TextField
          fullWidth
          type={showPassword ? 'text' : 'password'}
          label="Password"
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword
                        ? 'hide the password'
                        : 'display the password'
                    }
                    onClick={toggleShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 2 }}
        loading={login.isPending}
      >
        Login
      </Button>

      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Don't have an account'?{' '}
        <Link component={RouterLink} to={paths.app.auth.register.getHref()}>
          Join us today
        </Link>
      </Typography>
    </Box>
  );
};
