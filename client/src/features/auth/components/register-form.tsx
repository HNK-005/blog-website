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
  registerInputSchema,
  registerWithEmailAndPassword,
  type RegisterInput,
} from 'src/lib/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDisclosure } from 'src/hook/use-disclosure';
import { paths } from 'src/config/paths';
import { useMutation } from '@tanstack/react-query';

type RegisterFormProps = {
  onSuccess: (
    _data: any,
    variables: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    },
  ) => void;
};

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const registering = useMutation({
    mutationFn: async (data: RegisterInput) => {
      return await registerWithEmailAndPassword(data);
    },
    onSuccess,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerInputSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  const { isOpen: showPassword, toggle: toggleShowPassword } =
    useDisclosure(false);

  const onSubmit: SubmitHandler<RegisterInput> = (data) => {
    registering.mutate(data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          fullWidth
          label="First Name"
          {...register('firstName')}
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
        />

        <TextField
          fullWidth
          label="Last Name"
          {...register('lastName')}
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
        />
      </Box>

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
        loading={registering.isPending}
      >
        Register
      </Button>

      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Already a member?{' '}
        <Link component={RouterLink} to={paths.app.auth.login.getHref()}>
          Login
        </Link>
      </Typography>
    </Box>
  );
};
