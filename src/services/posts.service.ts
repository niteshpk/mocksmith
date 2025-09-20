import { db } from '../db/sqlite';
import type { Post } from '../models';

export class PostsService {
  static list(opts: { limit: number; offset: number; userId?: number }): Post[] {
    if (opts.userId) {
      return db
        .prepare('SELECT * FROM posts WHERE userId = ? LIMIT ? OFFSET ?')
        .all(opts.userId, opts.limit, opts.offset) as Post[];
    }
    return db
      .prepare('SELECT * FROM posts LIMIT ? OFFSET ?')
      .all(opts.limit, opts.offset) as Post[];
  }
  static count(filter?: { userId?: number }): number {
    if (filter?.userId) {
      const row = db
        .prepare('SELECT COUNT(*) as c FROM posts WHERE userId = ?')
        .get(filter.userId) as { c: number };
      return row.c;
    }
    const row = db.prepare('SELECT COUNT(*) as c FROM posts').get() as { c: number };
    return row.c;
  }
  static get(id: number): Post | undefined {
    return db.prepare('SELECT * FROM posts WHERE id = ?').get(id) as Post | undefined;
  }
  static listByUser(userId: number): Post[] {
    return db.prepare('SELECT * FROM posts WHERE userId = ?').all(userId) as Post[];
  }
  static create(input: Omit<Post, 'id'>): Post {
    const user = db.prepare('SELECT id FROM users WHERE id = ?').get(input.userId);
    if (!user) throw Object.assign(new Error('User not found'), { status: 400 });
    const stmt = db.prepare('INSERT INTO posts (userId, title, body) VALUES (?,?,?)');
    const info = stmt.run(input.userId, input.title, input.body);
    return { id: Number(info.lastInsertRowid), ...input };
  }
  static update(id: number, input: Partial<Omit<Post, 'id'>>): Post | undefined {
    const p = this.get(id);
    if (!p) return;
    const next = { ...p, ...input };
    if (input.userId) {
      const user = db.prepare('SELECT id FROM users WHERE id = ?').get(input.userId);
      if (!user) throw Object.assign(new Error('User not found'), { status: 400 });
    }
    db.prepare('UPDATE posts SET userId=?, title=?, body=? WHERE id=?').run(
      next.userId,
      next.title,
      next.body,
      id,
    );
    return next;
  }
  static remove(id: number): boolean {
    const info = db.prepare('DELETE FROM posts WHERE id = ?').run(id);
    return info.changes > 0;
  }
}
