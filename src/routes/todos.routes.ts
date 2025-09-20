import { Router } from 'express';
import { z } from 'zod';
import { TodosController } from '../controllers/todos.controller';
import { validateBody, validateParams, validateQuery } from '../middleware/validate';
import { idParam, paginationQuery } from '../schemas/common';
import { todoCreateSchema, todoUpdateSchema } from '../schemas/todo.schema';

export const todosRouter = Router();

const todosListQuery = paginationQuery.extend({
  userId: z.coerce.number().int().positive().optional(),
});

todosRouter.get('/', validateQuery(todosListQuery), TodosController.list);
todosRouter.get('/:id', validateParams(idParam), TodosController.get);
todosRouter.post('/', validateBody(todoCreateSchema), TodosController.create);
todosRouter.put(
  '/:id',
  validateParams(idParam),
  validateBody(todoUpdateSchema),
  TodosController.update,
);
todosRouter.delete('/:id', validateParams(idParam), TodosController.remove);
