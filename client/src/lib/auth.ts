import { z } from 'zod';

export const signUpInputSchema = z.object({
  fullName: z.string(),
  email: z.string(),
  password: z.string(),
});

export type SignUpInput = z.infer<typeof signUpInputSchema>;
