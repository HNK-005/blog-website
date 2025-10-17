import type { FileResponse } from 'src/types/api';
import { api } from './api-client';
import z from 'zod';

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB default
export const ACCEPTED_IMAGE_TYPES: string[] = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const file = z
  .instanceof(File)
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    'File size must be less than 5MB',
  )
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    'Only .jpg, .jpeg, .png and .webp formats are supported',
  )
  .nullable()
  .optional();

export const upload = (formData: FormData): Promise<{ file: FileResponse }> => {
  return api.post('/files/upload', formData);
};

export const remove = (path: string): Promise<any> => {
  return api.delete('', { baseURL: path });
};
