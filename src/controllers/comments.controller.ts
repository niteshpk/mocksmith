import { Request, Response } from 'express';

import { CommentsService } from '../services/comments.service';
import { HttpStatus } from '../utils/httpStatus';

export const CommentsController = {
  list: (req: Request, res: Response) => {
    interface CommentsQuery {
      _page?: string;
      _limit?: string;
      postId?: string;
    }
    const query = req.query as CommentsQuery;
    const page = Number(query._page ?? 1);
    const limit = Number(query._limit ?? 10);
    const postId = query.postId ? Number(query.postId) : undefined;
    const offset = (page - 1) * limit;
    const items = CommentsService.list({ limit, offset, postId });
    const total = CommentsService.count({ postId });
    res.setHeader('X-Total-Count', String(total));
    res.json(items);
  },
  get: (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const comment = CommentsService.get(id);
    if (!comment) return res.status(HttpStatus.NOT_FOUND).json({ message: 'Comment not found' });
    res.json(comment);
  },
  create: (req: Request, res: Response) => {
    const comment = CommentsService.create(req.body);
    res.status(HttpStatus.CREATED).json(comment);
  },
  update: (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const comment = CommentsService.update(id, req.body);
    if (!comment) return res.status(HttpStatus.NOT_FOUND).json({ message: 'Comment not found' });
    res.json(comment);
  },
  remove: (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const ok = CommentsService.remove(id);
    if (!ok) return res.status(HttpStatus.NOT_FOUND).json({ message: 'Comment not found' });
    res.status(HttpStatus.NO_CONTENT).send();
  },
};
