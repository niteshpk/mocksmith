import { Request, Response } from 'express';

import { UsersService } from '../services/users.service';
import { HttpStatus } from '../utils/httpStatus';

export const UsersController = {
  list: (req: Request, res: Response) => {
    const query = req.query as Record<string, string>;
    const page = Number(query._page ?? '1');
    const limit = Number(query._limit ?? '10');
    const offset = (page - 1) * limit;
    const items = UsersService.list({ limit, offset });
    const total = UsersService.count();
    res.setHeader('X-Total-Count', String(total));
    res.json(items);
  },
  get: (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const user = UsersService.get(id);
    if (!user) return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found' });
    res.json(user);
  },
  create: (req: Request, res: Response) => {
    const user = UsersService.create(req.body);
    res.status(HttpStatus.CREATED).json(user);
  },
  update: (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const user = UsersService.update(id, req.body);
    if (!user) return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found' });
    res.json(user);
  },
  remove: (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const ok = UsersService.remove(id);
    if (!ok) return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found' });
    res.status(HttpStatus.NO_CONTENT).send();
  },
};
