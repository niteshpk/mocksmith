import cors from 'cors';
import express from 'express';
import promBundle from 'express-prom-bundle';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import { getOpenApiSpec } from './docs/openapi';
import { errorHandler } from './middleware/error';
import { requestLogger } from './middleware/logging';
import { apiRouter } from './routes';

export function createApp() {
  const app = express();

  // In dev we relax CSP so Swagger UI can load its scripts/styles comfortably.
  app.use(
    helmet({
      contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
    }),
  );

  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  // Metrics
  const metricsMiddleware = promBundle({
    includeMethod: true,
    includePath: true,
    includeStatusCode: true,
  });
  app.use(metricsMiddleware);

  // Routes
  app.use('/api', apiRouter);

  // OpenAPI spec + Swagger UI (serve spec via URL to avoid inline JSON parsing issues)
  const spec = getOpenApiSpec();
  app.get('/docs.json', (_req, res) => res.json(spec));
  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
      swaggerUrl: '/docs.json',
      explorer: true,
    }),
  );

  // Health
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  // Errors
  app.use(errorHandler);

  return app;
}
