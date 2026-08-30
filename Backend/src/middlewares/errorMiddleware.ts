import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err);

  const statusCode = err.statusCode || err.httpStatusCode || err.response?.status || 500;
  const message = err.message || 'Internal Server Error';
  const apiResponse = err.ApiResponse || err.response?.data;

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    apiResponse,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
