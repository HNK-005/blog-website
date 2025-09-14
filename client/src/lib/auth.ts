import { z } from 'zod';

export const fullnameRegex = /^[a-zA-Z\s]+$/;

export const signUpInputSchema = z.object({
  fullName: z
    .string()
    .min(3, 'Full Name must be at least 3 characters')
    .max(50, 'Full Name must be at most 50 characters')
    .regex(fullnameRegex, 'Full Name must contain only letters and spaces'),
  email: z.string().min(1, 'Required').email('Invalid email address'),
  password: z.string().min(6, 'Required'),
});

export type SignUpInput = z.infer<typeof signUpInputSchema>;
