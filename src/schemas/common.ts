import { z } from 'zod';

export const idParam = z.object({
  id: z.coerce.number().int().positive(),
});
export type IdParam = z.infer<typeof idParam>;

export const paginationQuery = z.object({
  _page: z.coerce.number().int().positive().default(1),
  _limit: z.coerce.number().int().positive().max(100).default(10),
});
export type PaginationQuery = z.infer<typeof paginationQuery>;
