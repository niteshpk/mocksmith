import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { env } from '../config/env';

const dir = path.dirname(env.DATABASE_URL);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

export const db = new Database(env.DATABASE_URL);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function runMigrations() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      username TEXT NOT NULL,
      email TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      postId INTEGER NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      body TEXT NOT NULL,
      FOREIGN KEY(postId) REFERENCES posts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      title TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
}
