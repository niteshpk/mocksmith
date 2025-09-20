import { db, runMigrations } from '../src/db/sqlite';

export function resetAndSeed() {
  runMigrations();

  // Wipe tables & reset AUTOINCREMENT so IDs start at 1 each time.
  // (If we don't reset sqlite_sequence, new users won't get id=1/2 and FK inserts will fail.)
  db.exec(`
    PRAGMA foreign_keys=OFF;
    BEGIN;
      DELETE FROM comments;
      DELETE FROM posts;
      DELETE FROM todos;
      DELETE FROM users;
      DELETE FROM sqlite_sequence WHERE name IN ('comments','posts','todos','users');
    COMMIT;
    PRAGMA foreign_keys=ON;
  `);

  // users
  const insertUser = db.prepare('INSERT INTO users (name, username, email) VALUES (?,?,?)');
  const u1 = Number(insertUser.run('Alpha User', 'alpha', 'alpha@example.com').lastInsertRowid); // 1
  const u2 = Number(insertUser.run('Beta User', 'beta', 'beta@example.com').lastInsertRowid); // 2

  // posts (FK -> users)
  const insertPost = db.prepare('INSERT INTO posts (userId, title, body) VALUES (?,?,?)');
  const p1 = Number(insertPost.run(u1, 'Hello World', 'First post body').lastInsertRowid); // 1
  insertPost.run(u2, 'Beta Post', 'By beta'); // 2

  // comments (FK -> posts)
  const insertComment = db.prepare(
    'INSERT INTO comments (postId, name, email, body) VALUES (?,?,?,?)',
  );
  insertComment.run(p1, 'Alpha Commenter', 'c1@example.com', 'Nice post!'); // 1

  // todos (FK -> users)
  const insertTodo = db.prepare('INSERT INTO todos (userId, title, completed) VALUES (?,?,?)');
  insertTodo.run(u1, 'Alpha todo', 0); // 1
}
