import { z } from 'zod';

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

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
    .any()
    .refine(
      (fileList) => {
        if (
          !fileList ||
          !(fileList instanceof FileList) ||
          fileList.length === 0
        ) {
          return true;
        }

        const file = fileList[0];
        return (
          file.size <= MAX_AVATAR_SIZE &&
          ACCEPTED_IMAGE_TYPES.includes(file.type)
        );
      },
      { message: 'Avatar must be a JPG or PNG image under 5MB' },
    )
    .transform((v) => (v instanceof FileList && v.length > 0 ? v : undefined))
    .optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;
