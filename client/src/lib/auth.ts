import { z } from 'zod';
import { api } from './api-client';
import type { AuthResponse, User } from 'src/types/api';

export const nameRegex = /^[A-Za-zÀ-ỹ]+(?:[ '-][A-Za-zÀ-ỹ]+)*$/;

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

export const loginInputSchema = z.object({
  email: z.string().min(1, 'Required'),
  password: z.string().min(1, 'Required'),
});

export type RegisterInput = z.infer<typeof registerInputSchema>;
export type LoginInput = z.infer<typeof loginInputSchema>;
export type ConfirmInput = {
  email: string;
  otp: string;
};
export type SendOtp = Omit<ConfirmInput, 'otp'>;

export const registerWithEmailAndPassword = (
  data: RegisterInput,
): Promise<any> => {
  return api.post('/auth/email/register', data);
};

export const loginWithEmailAndPassword = (
  data: LoginInput,
): Promise<AuthResponse> => {
  return api.post('/auth/email/login', data);
};

export const confirmEmail = (data: ConfirmInput): Promise<any> => {
  return api.post('/auth/email/confirm', data);
};

export const sendOtp = (data: SendOtp): Promise<any> => {
  return api.post('/auth/email/new-otp', data);
};

export const me = (): Promise<User> => {
  return api.get('/auth/me');
};

export const refreshToken = (): Promise<any> => {
  return api.post('/auth/refresh');
};
