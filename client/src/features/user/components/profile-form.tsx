import * as React from 'react';
import {
  Avatar,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useForm, Controller } from 'react-hook-form';
import { profileSchema, type ProfileInput } from 'src/lib/user';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useAuth } from 'src/features/auth/context/auth-provider';

export const ProfileForm = () => {
  const { user } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      bio: user?.bio,
    },
  });

  const [preview, setPreview] = React.useState<string | undefined>();

  const onSubmit = (data: ProfileInput) => {
    console.log('Form data:', data);
    alert('Cập nhật hồ sơ thành công ✅');
  };

  React.useEffect(() => {
    if (errors.avatar) {
      if (!errors.avatar.message) {
        return;
      }
      toast.error(errors.avatar.message);
    }
  }, [errors.avatar]);

  React.useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '100%',
        py: { xs: 3, sm: 6 },
        px: { xs: 2, sm: 4 },
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Grid
        container
        spacing={3}
        sx={{
          maxWidth: 1100,
          width: '100%',
        }}
      >
        {/* Avatar Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={2}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 2,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Profile Picture
            </Typography>

            <Avatar
              src={preview || user?.avatar}
              sx={{
                width: 120,
                height: 120,
                mb: 2,
              }}
            />

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2, px: 1 }}
            >
              JPG or PNG less than 5MB
            </Typography>

            <Controller
              name="avatar"
              control={control}
              render={({ field }) => (
                <Button variant="contained" component="label" fullWidth>
                  Upload new image
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const fileList = e.target.files;
                      if (!fileList || fileList.length === 0) return;

                      const file = fileList[0];
                      field.onChange(fileList);
                      setPreview(URL.createObjectURL(file));
                    }}
                  />
                </Button>
              )}
            />
          </Paper>
        </Grid>

        {/* Account Details */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={2}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Account Details
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              {/* Username */}
              <Controller
                name="username"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Username"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />

              {/* First + Last name */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="First name"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  name="lastName"
                  control={control}
                  rules={{ required: 'Không được bỏ trống' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Last name"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Stack>

              {/* Email */}
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Email"
                    type="email"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />

              {/* Bio */}
              <Controller
                name="bio"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Bio"
                    fullWidth
                    multiline
                    rows={3}
                  />
                )}
              />

              {/* Submit */}
              <Box sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    textTransform: 'none',
                    py: 1.2,
                  }}
                >
                  Save changes
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
