import { api } from './api-client';
import { z } from 'zod';

export const profileSchema = z.object({
  username: z
    .string()
    .min(1, 'Username cannot be empty')
    .max(30)
    .regex(/^[a-zA-Z0-9._-]+$/, 'Only letters, numbers, ., _, - allowed'),

  firstName: z.string().min(1, 'First name cannot be empty').max(50),
  lastName: z.string().min(1, 'Last name cannot be empty').max(50),

  email: z.string().min(1, 'Email cannot be empty').email('Invalid email'),

  bio: z.string().max(300).optional().or(z.literal('')),

  avatar: z
    .object({
      id: z.string().optional(),
      path: z.string().optional(),
    })
    .optional()
    .nullable(),
});

export type ProfileInput = z.infer<typeof profileSchema>;

export const uploadAvatar = (
  formData: FormData,
): Promise<{ file: { _id: string; path: string } }> => {
  return api.post('/files/upload', formData);
};

export const updateProfile = (data: ProfileInput): Promise<any> => {
  return api.patch('/auth/me', data);
};
