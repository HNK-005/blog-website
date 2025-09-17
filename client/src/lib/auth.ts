import { z } from 'zod';
import { api } from './api-client';
import { configureAuth } from 'react-query-auth';

export const signUpInputSchema = z.object({
  fullName: z.string().min(1, 'Required'),
  email: z
    .string()
    .min(1, 'Required')
    .email('Invalid email address')
    .transform((text) => text.toLowerCase()),
  password: z.string().min(6, 'Required'),
});

export type SignUpInput = z.infer<typeof signUpInputSchema>;

const signUpWithEmailAndPassword = (data: SignUpInput): Promise<''> => {
  return api.post('/auth/email/register', data);
};

const authConfig = {
  userFn: async () => {
    return null;
  },
  registerFn: async (data: SignUpInput) => {
    const response = await signUpWithEmailAndPassword(data);
    return response;
  },
  loginFn: async (_data: { email: string; password: string }) => {
    return null;
  },
  logoutFn: async () => {
    return null;
  },
};

export const { useRegister, AuthLoader } = configureAuth(authConfig);
