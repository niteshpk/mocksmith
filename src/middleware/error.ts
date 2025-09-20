import type { ErrorRequestHandler } from 'express';
import { HttpStatus } from '../utils/httpStatus';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const status = (err as any)?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
  const message = (err as any)?.message ?? 'Unexpected error';
  const details = (err as any)?.details;

  res.status(status).json({
    error: err.name || 'Error',
    message,
    ...(details ? { details } : {})
  });
};
