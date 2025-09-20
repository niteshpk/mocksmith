import 'dotenv/config';

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 3000),
  DATABASE_URL: process.env.DATABASE_URL ?? './data/app.db',
  LOG_LEVEL: process.env.LOG_LEVEL ?? 'info'
} as const;
