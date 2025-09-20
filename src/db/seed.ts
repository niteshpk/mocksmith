import { db, runMigrations } from './sqlite';

// Run migrations / ensure schema
runMigrations();

// Reset tables and AUTOINCREMENT counters for reproducible seeds
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

const USER_COUNT = 100;
const POST_COUNT = 100;
const COMMENT_COUNT = 100;
const TODO_COUNT = 100;

// Prepare statements
const insertUser = db.prepare('INSERT INTO users (name, username, email) VALUES (?, ?, ?)');
const insertPost = db.prepare('INSERT INTO posts (userId, title, body) VALUES (?, ?, ?)');
const insertComment = db.prepare(
  'INSERT INTO comments (postId, name, email, body) VALUES (?, ?, ?, ?)',
);
const insertTodo = db.prepare('INSERT INTO todos (userId, title, completed) VALUES (?, ?, ?)');

// Seed inside a single transaction for speed & atomicity
const seed = db.transaction(() => {
  // Users: ids 1..100
  for (let i = 1; i <= USER_COUNT; i++) {
    const name = `User ${i}`;
    const username = `user${i}`;
    const email = `user${i}@example.com`;
    insertUser.run(name, username, email);
  }

  // Posts: ids 1..100, each referencing a user
  for (let i = 1; i <= POST_COUNT; i++) {
    const userId = ((i - 1) % USER_COUNT) + 1;
    const title = `Post ${i} Title`;
    const body = `This is the body of post ${i}.`;
    insertPost.run(userId, title, body);
  }

  // Comments: ids 1..100, each referencing a post
  for (let i = 1; i <= COMMENT_COUNT; i++) {
    const postId = ((i - 1) % POST_COUNT) + 1;
    const name = `Commenter ${i}`;
    const email = `commenter${i}@example.com`;
    const body = `Great insights on post ${postId}! (#${i})`;
    insertComment.run(postId, name, email, body);
  }

  // Todos: ids 1..100, each referencing a user
  for (let i = 1; i <= TODO_COUNT; i++) {
    const userId = ((i - 1) % USER_COUNT) + 1;
    const title = `Todo ${i}`;
    const completed = i % 2 === 0 ? 1 : 0; // store as INTEGER 0/1
    insertTodo.run(userId, title, completed);
  }
});

seed();
