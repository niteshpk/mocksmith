import { env } from './config/env';
import { createApp } from './app';
import { db, runMigrations } from './db/sqlite';
import { logger } from './middleware/logging';

runMigrations();
const app = createApp();

app.listen(env.PORT, () => {
  logger.info(`Server listening on http://localhost:${env.PORT}`);
});
process.on('SIGINT', () => { db.close(); process.exit(0); });
process.on('SIGTERM', () => { db.close(); process.exit(0); });
