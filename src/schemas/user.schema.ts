import { z } from 'zod';

export const userCreateSchema = z.object({
  name: z.string().min(1),
  username: z.string().min(1),
  email: z.string().email()
});

export const userUpdateSchema = userCreateSchema.partial();

export const userResponseSchema = userCreateSchema.extend({
  id: z.number().int().positive()
});

export type UserCreateDTO = z.infer<typeof userCreateSchema>;
export type UserUpdateDTO = z.infer<typeof userUpdateSchema>;
export type UserResponseDTO = z.infer<typeof userResponseSchema>;
