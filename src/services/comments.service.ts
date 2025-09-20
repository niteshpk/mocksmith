import { db } from '../db/sqlite';
import type { Comment } from '../models';

export class CommentsService {
  static list(opts: { limit: number; offset: number; postId?: number }): Comment[] {
    if (opts.postId) {
      return db
        .prepare('SELECT * FROM comments WHERE postId = ? LIMIT ? OFFSET ?')
        .all(opts.postId, opts.limit, opts.offset) as Comment[];
    }
    return db
      .prepare('SELECT * FROM comments LIMIT ? OFFSET ?')
      .all(opts.limit, opts.offset) as Comment[];
  }
  static count(filter?: { postId?: number }): number {
    if (filter?.postId) {
      const row = db
        .prepare('SELECT COUNT(*) as c FROM comments WHERE postId = ?')
        .get(filter.postId) as { c: number };
      return row.c;
    }
    const row = db.prepare('SELECT COUNT(*) as c FROM comments').get() as { c: number };
    return row.c;
  }
  static get(id: number): Comment | undefined {
    return db.prepare('SELECT * FROM comments WHERE id = ?').get(id) as Comment | undefined;
  }
  static listByPost(postId: number): Comment[] {
    return db.prepare('SELECT * FROM comments WHERE postId = ?').all(postId) as Comment[];
  }
  static create(input: Omit<Comment, 'id'>): Comment {
    const post = db.prepare('SELECT id FROM posts WHERE id = ?').get(input.postId);
    if (!post) throw Object.assign(new Error('Post not found'), { status: 400 });
    const stmt = db.prepare('INSERT INTO comments (postId, name, email, body) VALUES (?,?,?,?)');
    const info = stmt.run(input.postId, input.name, input.email, input.body);
    return { id: Number(info.lastInsertRowid), ...input };
  }
  static update(id: number, input: Partial<Omit<Comment, 'id'>>): Comment | undefined {
    const c = this.get(id);
    if (!c) return;
    const next = { ...c, ...input };
    if (input.postId) {
      const post = db.prepare('SELECT id FROM posts WHERE id = ?').get(input.postId);
      if (!post) throw Object.assign(new Error('Post not found'), { status: 400 });
    }
    db.prepare('UPDATE comments SET postId=?, name=?, email=?, body=? WHERE id=?').run(
      next.postId,
      next.name,
      next.email,
      next.body,
      id,
    );
    return next;
  }
  static remove(id: number): boolean {
    const info = db.prepare('DELETE FROM comments WHERE id = ?').run(id);
    return info.changes > 0;
  }
}
