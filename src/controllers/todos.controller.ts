import { Request, Response } from 'express';
import { TodosService } from '../services/todos.service';
import { HttpStatus } from '../utils/httpStatus';

export const TodosController = {
  list: (req: Request, res: Response) => {
    const page = Number((req.query as any)._page ?? 1);
    const limit = Number((req.query as any)._limit ?? 10);
    const userId = (req.query as any).userId ? Number((req.query as any).userId) : undefined;
    const offset = (page - 1) * limit;
    const items = TodosService.list({ limit, offset, userId });
    const total = TodosService.count({ userId });
    res.setHeader('X-Total-Count', String(total));
    res.json(items);
  },
  get: (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const todo = TodosService.get(id);
    if (!todo) return res.status(HttpStatus.NOT_FOUND).json({ message: 'Todo not found' });
    res.json(todo);
  },
  create: (req: Request, res: Response) => {
    const todo = TodosService.create(req.body);
    res.status(HttpStatus.CREATED).json(todo);
  },
  update: (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const todo = TodosService.update(id, req.body);
    if (!todo) return res.status(HttpStatus.NOT_FOUND).json({ message: 'Todo not found' });
    res.json(todo);
  },
  remove: (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const ok = TodosService.remove(id);
    if (!ok) return res.status(HttpStatus.NOT_FOUND).json({ message: 'Todo not found' });
    res.status(HttpStatus.NO_CONTENT).send();
  },
};
