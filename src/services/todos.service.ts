import { db } from '../db/sqlite';
import type { Todo } from '../models';

export class TodosService {
  static list(opts: { limit: number; offset: number; userId?: number }): Todo[] {
    const rows = opts.userId
      ? (db
          .prepare('SELECT * FROM todos WHERE userId = ? LIMIT ? OFFSET ?')
          .all(opts.userId, opts.limit, opts.offset) as Todo[])
      : (db.prepare('SELECT * FROM todos LIMIT ? OFFSET ?').all(opts.limit, opts.offset) as Todo[]);
    return rows.map((r) => ({ ...r, completed: !!r.completed }));
  }
  static count(filter?: { userId?: number }): number {
    if (filter?.userId) {
      const row = db
        .prepare('SELECT COUNT(*) as c FROM todos WHERE userId = ?')
        .get(filter.userId) as { c: number };
      return row.c;
    }
    const row = db.prepare('SELECT COUNT(*) as c FROM todos').get() as { c: number };
    return row.c;
  }
  static get(id: number): Todo | undefined {
    const row = db.prepare('SELECT * FROM todos WHERE id = ?').get(id) as Todo | undefined;
    return row ? { ...row, completed: !!row.completed } : undefined;
  }
  static listByUser(userId: number): Todo[] {
    const rows = db.prepare('SELECT * FROM todos WHERE userId = ?').all(userId) as Todo[];
    return rows.map((r) => ({ ...r, completed: !!r.completed }));
  }
  static create(input: Omit<Todo, 'id'>): Todo {
    const user = db.prepare('SELECT id FROM users WHERE id = ?').get(input.userId);
    if (!user) throw Object.assign(new Error('User not found'), { status: 400 });
    const completed = input.completed ? 1 : 0;
    const stmt = db.prepare('INSERT INTO todos (userId, title, completed) VALUES (?,?,?)');
    const info = stmt.run(input.userId, input.title, completed);
    return { id: Number(info.lastInsertRowid), ...input };
  }
  static update(id: number, input: Partial<Omit<Todo, 'id'>>): Todo | undefined {
    const t = this.get(id);
    if (!t) return;
    const next = { ...t, ...input };
    const completed = next.completed ? 1 : 0;
    if (input.userId) {
      const user = db.prepare('SELECT id FROM users WHERE id = ?').get(input.userId);
      if (!user) throw Object.assign(new Error('User not found'), { status: 400 });
    }
    db.prepare('UPDATE todos SET userId=?, title=?, completed=? WHERE id=?').run(
      next.userId,
      next.title,
      completed,
      id,
    );
    return { ...next };
  }
  static remove(id: number): boolean {
    const info = db.prepare('DELETE FROM todos WHERE id = ?').run(id);
    return info.changes > 0;
  }
}
