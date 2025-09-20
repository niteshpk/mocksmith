import { HttpStatus } from '../utils/httpStatus';
import type { ErrorRequestHandler } from 'express';

interface CustomError extends Error {
  status?: number;
  details?: unknown;
}

export const errorHandler: ErrorRequestHandler = (err: CustomError, _req, res, _next) => {
  const status = err.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
  const message = err.message ?? 'Unexpected error';
  const details = err.details;

  res.status(status).json({
    error: err.name || 'Error',
    message,
    ...(details ? { details } : {}),
  });
};
