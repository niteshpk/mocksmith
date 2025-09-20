import { Router } from 'express';
import { z } from 'zod';

import { CommentsController } from '../controllers/comments.controller';
import { validateBody, validateParams, validateQuery } from '../middleware/validate';
import { commentCreateSchema, commentUpdateSchema } from '../schemas/comment.schema';
import { idParam, paginationQuery } from '../schemas/common';

export const commentsRouter = Router();

const commentsListQuery = paginationQuery.extend({
  postId: z.coerce.number().int().positive().optional(),
});

commentsRouter.get('/', validateQuery(commentsListQuery), CommentsController.list);
commentsRouter.get('/:id', validateParams(idParam), CommentsController.get);
commentsRouter.post('/', validateBody(commentCreateSchema), CommentsController.create);
commentsRouter.put(
  '/:id',
  validateParams(idParam),
  validateBody(commentUpdateSchema),
  CommentsController.update,
);
commentsRouter.delete('/:id', validateParams(idParam), CommentsController.remove);
