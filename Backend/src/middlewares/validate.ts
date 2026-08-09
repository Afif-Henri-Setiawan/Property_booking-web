import { ZodSchema, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      }) as any;
      req.body = parsedData.body;
      // Object.assign used for query and params since Express 5 defines them as getters
      if (parsedData.query) Object.assign(req.query, parsedData.query);
      if (parsedData.params) Object.assign(req.params, parsedData.params);
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errorMessages = (error as any).errors.map((err: any) => `${err.path[err.path.length - 1]}: ${err.message}`);
        return res.status(400).json({
          status: 'error',
          message: 'Validasi gagal',
          errors: errorMessages,
        });
      }
      return res.status(400).json({
        status: 'error',
        message: 'Validasi gagal',
        error: error.message
      });
    }
  };
