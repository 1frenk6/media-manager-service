import type { Request, Response, NextFunction } from 'express';

// TODO: Create Error utility Class
export default function errorHandler (err: any, req: Request, res: Response, next: NextFunction) {
  console.error('Error detected: ', err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong.';

  res.status(statusCode).json({
    error: {
      message,
      stack: err.stack,
    },
  });
};
