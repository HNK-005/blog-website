import { api } from './api-client';
import { z } from 'zod';
import { nameRegex, usernameRegex } from './regex';
import type { User } from 'src/types/api';
import { file } from './file';

export const profileSchema = z.object({
  username: z
    .string()
    .min(1, 'Username cannot be empty')
    .max(30)
    .regex(usernameRegex, 'Only letters, numbers, ., _, - allowed'),

  firstName: z
    .string()
    .regex(nameRegex, 'Invalid first name')
    .min(1, 'First name cannot be empty')
    .max(50),
  lastName: z
    .string()
    .regex(nameRegex, 'Invalid last name')
    .min(1, 'Last name cannot be empty')
    .max(50),

  email: z.string().min(1, 'Email cannot be empty').email('Invalid email'),

  bio: z.string().max(300).optional().or(z.literal('')),

  avatar: file,
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type ProfileUpdateInput = Pick<
  User,
  'username' | 'firstName' | 'lastName' | 'email' | 'bio' | 'avatar'
>;

export const updateProfile = (
  data: Pick<
    User,
    'username' | 'firstName' | 'lastName' | 'email' | 'bio' | 'avatar'
  >,
): Promise<User> => {
  return api.patch('/auth/me', data);
};
