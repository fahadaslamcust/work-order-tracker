import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Catch Zod errors by instance OR by error structure/name
  const isZodError =
    err?.name === 'ZodError' ||
    Array.isArray(err?.errors) ||
    Array.isArray(err?.issues);

  if (isZodError) {
    const rawIssues = err.errors || err.issues || [];
    const details = rawIssues.map((e: any) => ({
      field: Array.isArray(e.path) ? e.path.join('.') : String(e.path || ''),
      issue: e.message || 'Invalid value',
    }));

    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: details[0]?.issue || 'Invalid input data',
        details,
      },
    });
  }

  // Handle Unauthorized / Invalid Credentials
  if (err.code === 'UNAUTHORIZED') {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: err.message || 'Invalid credentials',
      },
    });
  }

  // Handle Not Found
  if (err.code === 'NOT_FOUND') {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: err.message || 'Resource not found',
      },
    });
  }

  // Handle Invalid Status Transition
  if (err.code === 'INVALID_STATUS_TRANSITION') {
    return res.status(400).json({
      error: {
        code: 'INVALID_STATUS_TRANSITION',
        message: err.message,
      },
    });
  }

  // Default Catch-All 500
  return res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    },
  });
};