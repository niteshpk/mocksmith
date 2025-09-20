import { db } from '../db/sqlite';
import type { User } from '../models';

export class UsersService {
  static list(opts: { limit: number; offset: number }): User[] {
    return db
      .prepare('SELECT * FROM users LIMIT ? OFFSET ?')
      .all(opts.limit, opts.offset) as User[];
  }
  static count(): number {
    const row = db.prepare('SELECT COUNT(*) as c FROM users').get() as { c: number };
    return row.c;
  }
  static get(id: number): User | undefined {
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;
  }
  static create(input: Omit<User, 'id'>): User {
    const stmt = db.prepare('INSERT INTO users (name, username, email) VALUES (?,?,?)');
    const info = stmt.run(input.name, input.username, input.email);
    return { id: Number(info.lastInsertRowid), ...input };
  }
  static update(id: number, input: Partial<Omit<User, 'id'>>): User | undefined {
    const u = this.get(id);
    if (!u) return;
    const next = { ...u, ...input };
    db.prepare('UPDATE users SET name=?, username=?, email=? WHERE id=?').run(
      next.name,
      next.username,
      next.email,
      id,
    );
    return next;
  }
  static remove(id: number): boolean {
    const info = db.prepare('DELETE FROM users WHERE id = ?').run(id);
    return info.changes > 0;
  }
}
