import { z } from 'zod';

export const commentCreateSchema = z.object({
  postId: z.number().int().positive(),
  name: z.string().min(1),
  email: z.string().email(),
  body: z.string().min(1)
});

export const commentUpdateSchema = commentCreateSchema.partial();

export const commentResponseSchema = commentCreateSchema.extend({
  id: z.number().int().positive()
});

export type CommentCreateDTO = z.infer<typeof commentCreateSchema>;
export type CommentUpdateDTO = z.infer<typeof commentUpdateSchema>;
export type CommentResponseDTO = z.infer<typeof commentResponseSchema>;
