import { z } from 'zod';

export const todoCreateSchema = z.object({
  userId: z.number().int().positive(),
  title: z.string().min(1),
  completed: z.boolean().default(false)
});

export const todoUpdateSchema = todoCreateSchema.partial();

export const todoResponseSchema = todoCreateSchema.extend({
  id: z.number().int().positive()
});

export type TodoCreateDTO = z.infer<typeof todoCreateSchema>;
export type TodoUpdateDTO = z.infer<typeof todoUpdateSchema>;
export type TodoResponseDTO = z.infer<typeof todoResponseSchema>;
