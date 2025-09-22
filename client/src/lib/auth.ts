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

const registerWithEmailAndPassword = (data: RegisterInput): Promise<any> => {
  return api.post('/auth/email/register', data);
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
