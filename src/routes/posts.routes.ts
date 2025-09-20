import { Router } from 'express';
import { z } from 'zod';

import { PostsController } from '../controllers/posts.controller';
import { validateBody, validateParams, validateQuery } from '../middleware/validate';
import { idParam, paginationQuery } from '../schemas/common';
import { postCreateSchema, postUpdateSchema } from '../schemas/post.schema';

export const postsRouter = Router();

const postsListQuery = paginationQuery.extend({
  userId: z.coerce.number().int().positive().optional(),
});

postsRouter.get('/', validateQuery(postsListQuery), PostsController.list);
postsRouter.get('/:id', validateParams(idParam), PostsController.get);
postsRouter.post('/', validateBody(postCreateSchema), PostsController.create);
postsRouter.put(
  '/:id',
  validateParams(idParam),
  validateBody(postUpdateSchema),
  PostsController.update,
);
postsRouter.delete('/:id', validateParams(idParam), PostsController.remove);
