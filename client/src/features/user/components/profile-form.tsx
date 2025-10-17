import * as React from 'react';
import {
  Avatar,
  Box,
  Button,
  FormHelperText,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useForm, Controller } from 'react-hook-form';
import {
  profileSchema,
  updateProfile,
  type ProfileInput,
  type ProfileUpdateInput,
} from 'src/lib/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuthStore } from 'src/features/auth/store/auth-store';
import { remove, upload } from 'src/lib/file';

export const ProfileForm = () => {
  const { user } = useAuthStore.getState();
  const userAvatarPath = user?.avatar?.path;

  const [preview, setPreview] = React.useState<string | undefined>(
    userAvatarPath,
  );

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      bio: user?.bio,
      avatar: null,
    },
  });
  const avatar = watch('avatar');

  const uploadAvatar = useMutation({
    mutationFn: async (data: FormData) => await upload(data),
  });

  const removeAvatar = useMutation({
    mutationFn: async (path: string) => await remove(path),
  });

  const update = useMutation({
    mutationFn: async (data: ProfileUpdateInput) => await updateProfile(data),
    onSuccess: (data) => {
      useAuthStore.getState().setUser(data);
      toast.success('Update profile successfully');
    },
  });

  const handleAvatarChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setValue('avatar', file, { shouldValidate: true });
    },
    [setValue],
  );

  const onSubmit = React.useCallback(
    async (data: ProfileInput) => {
      const { avatar: newAvatar, ...rest } = data;
      const hasNewAvatar = Boolean(newAvatar);
      const previousAvatarPath = userAvatarPath;
      let uploadedFile: ProfileUpdateInput['avatar'];

      try {
        if (hasNewAvatar && newAvatar) {
          const formData = new FormData();
          formData.append('file', newAvatar);
          const uploadRes = await uploadAvatar.mutateAsync(formData);
          uploadedFile = uploadRes.file;
        }
      } catch {
        toast.error('Failed to upload avatar');
        return;
      }

      const payload: ProfileUpdateInput = {
        ...rest,
        avatar: uploadedFile ?? undefined,
      };

      update.mutate(payload, {
        onSuccess: () => {
          if (hasNewAvatar && previousAvatarPath) {
            removeAvatar.mutate(previousAvatarPath);
          }
        },
        onError: () => {
          if (hasNewAvatar && uploadedFile?.path) {
            removeAvatar.mutate(uploadedFile.path);
          }
          toast.error('Failed to update profile');
        },
      });
    },
    [uploadAvatar, update, removeAvatar, userAvatarPath],
  );

  React.useEffect(() => {
    if (avatar) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreview(fileReader.result as string);
      };
      fileReader.readAsDataURL(avatar);
      return () => fileReader.abort();
    }

    setPreview(userAvatarPath);
  }, [avatar, userAvatarPath]);

  const isSubmitting = update.isPending || uploadAvatar.isPending;

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
              src={preview}
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
              render={() => (
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  disabled={isSubmitting}
                >
                  Choose new avatar
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleAvatarChange}
                  />
                </Button>
              )}
            />
            {errors.avatar && (
              <FormHelperText error>{errors.avatar.message}</FormHelperText>
            )}
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
                  disabled={isSubmitting}
                  sx={{
                    textTransform: 'none',
                    py: 1.2,
                  }}
                >
                  {isSubmitting ? 'Saving...' : 'Save changes'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
