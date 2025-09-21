import { z } from 'zod';

export const nameRegex = /^[A-Za-zÀ-Ỵà-ỹ]+(?:[ '-][A-Za-zÀ-Ỵà-ỹ]+)*$/;

export const registerInputSchema = z.object({
  firstName: z
    .string()
    .min(1, 'Required')
    .regex(nameRegex, 'Invalid first name')
    .trim(),
  lastName: z
    .string()
    .min(1, 'Required')
    .regex(nameRegex, 'Invalid last name')
    .trim(),
  email: z.string().min(1, 'Required'),
  password: z.string().min(5, 'Required').trim(),
});

export type RegisterInput = z.infer<typeof registerInputSchema>;
