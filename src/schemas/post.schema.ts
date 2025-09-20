import { z } from 'zod';

export const postCreateSchema = z.object({
  userId: z.number().int().positive(),
  title: z.string().min(1),
  body: z.string().min(1)
});

export const postUpdateSchema = postCreateSchema.partial();

export const postResponseSchema = postCreateSchema.extend({
  id: z.number().int().positive()
});

export type PostCreateDTO = z.infer<typeof postCreateSchema>;
export type PostUpdateDTO = z.infer<typeof postUpdateSchema>;
export type PostResponseDTO = z.infer<typeof postResponseSchema>;
