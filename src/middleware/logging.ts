import pino from 'pino';
import pinoHttp from 'pino-http';
import { env } from '../config/env';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

let hasPretty = false;
try {
  require.resolve('pino-pretty');
  hasPretty = true;
} catch {
  hasPretty = false;
}

const usePretty = env.NODE_ENV !== 'production' && hasPretty;

export const logger = pino({
  level: env.LOG_LEVEL,
  ...(usePretty
    ? {
        transport: {
          target: 'pino-pretty',
          options: { colorize: true, singleLine: true },
        },
      }
    : {}),
});

export const requestLogger = pinoHttp({ logger });
