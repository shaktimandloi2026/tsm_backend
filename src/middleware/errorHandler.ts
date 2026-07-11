import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const notFound = (req: Request, res: Response): void => {
  sendError(res, `Route ${req.originalUrl} not found`, 404);
};

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', err.message);

  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  if (err.name === 'ValidationError') {
    sendError(res, err.message, 422);
    return;
  }

  if (err.name === 'CastError') {
    sendError(res, 'Invalid resource ID', 400);
    return;
  }

  if ((err as { code?: number }).code === 11000) {
    sendError(res, 'Duplicate field value', 409);
    return;
  }

  sendError(res, 'Internal server error', 500);
};
