import { Router } from 'express';

import { commentsRouter } from './comments.routes';
import { healthRouter } from './health.routes';
import { postsRouter } from './posts.routes';
import { todosRouter } from './todos.routes';
import { usersRouter } from './users.routes';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/posts', postsRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/todos', todosRouter);
