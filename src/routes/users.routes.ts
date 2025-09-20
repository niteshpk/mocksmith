import { Router } from 'express';
import { UsersController } from '../controllers/users.controller';
import { validateBody, validateParams, validateQuery } from '../middleware/validate';
import { idParam, paginationQuery } from '../schemas/common';
import { userCreateSchema, userUpdateSchema } from '../schemas/user.schema';

export const usersRouter = Router();

usersRouter.get('/', validateQuery(paginationQuery), UsersController.list);
usersRouter.get('/:id', validateParams(idParam), UsersController.get);
usersRouter.post('/', validateBody(userCreateSchema), UsersController.create);
usersRouter.put(
  '/:id',
  validateParams(idParam),
  validateBody(userUpdateSchema),
  UsersController.update,
);
usersRouter.delete('/:id', validateParams(idParam), UsersController.remove);
