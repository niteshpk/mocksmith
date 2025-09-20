import { Request, Response } from 'express';
import { PostsService } from '../services/posts.service';
import { HttpStatus } from '../utils/httpStatus';

export const PostsController = {
  list: (req: Request, res: Response) => {
    const page = Number((req.query as any)._page ?? 1);
    const limit = Number((req.query as any)._limit ?? 10);
    const userId = (req.query as any).userId ? Number((req.query as any).userId) : undefined;
    const offset = (page - 1) * limit;
    const items = PostsService.list({ limit, offset, userId });
    const total = PostsService.count({ userId });
    res.setHeader('X-Total-Count', String(total));
    res.json(items);
  },
  get: (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const post = PostsService.get(id);
    if (!post) return res.status(HttpStatus.NOT_FOUND).json({ message: 'Post not found' });
    res.json(post);
  },
  create: (req: Request, res: Response) => {
    const post = PostsService.create(req.body);
    res.status(HttpStatus.CREATED).json(post);
  },
  update: (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const post = PostsService.update(id, req.body);
    if (!post) return res.status(HttpStatus.NOT_FOUND).json({ message: 'Post not found' });
    res.json(post);
  },
  remove: (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const ok = PostsService.remove(id);
    if (!ok) return res.status(HttpStatus.NOT_FOUND).json({ message: 'Post not found' });
    res.status(HttpStatus.NO_CONTENT).send();
  },
};
