import { z } from 'zod';
import { api } from './api-client';
import { configureAuth } from 'react-query-auth';

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
export type ConfirmInput = {
  email: string;
  otp: string;
};

const registerWithEmailAndPassword = (
  data: RegisterInput,
): Promise<{ email: string }> => {
  return api.post('/auth/email/register', data);
};

export const confirmEmail = (data: ConfirmInput): Promise<any> => {
  return api.post('/auth/email/confirm', data);
};

const authConfig = {
  userFn: async () => null,
  loginFn: async () => null,
  registerFn: async (data: RegisterInput) => {
    const response = await registerWithEmailAndPassword(data);
    return response;
  },
  logoutFn: async () => null,
};

export const { useRegister, AuthLoader } = configureAuth(authConfig);
