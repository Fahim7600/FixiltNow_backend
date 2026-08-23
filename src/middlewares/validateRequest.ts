import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodSchema } from "zod";

export const validateRequest = (schema: ZodSchema) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join(", ");

        res.status(400).json({
          success: false,
          message: "Validation Error",
          errorDetails: formattedErrors,
        });
        return;
      }

      const err = error as Error;
      res.status(400).json({
        success: false,
        message: "Validation Error",
        errorDetails: err.message || "Invalid request payload",
      });
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsedQuery = await schema.parseAsync(req.query);
      for (const key of Object.keys(req.query)) {
        delete (req.query as Record<string, unknown>)[key];
      }
      Object.assign(req.query, parsedQuery);
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join(", ");

        res.status(400).json({
          success: false,
          message: "Validation Error",
          errorDetails: formattedErrors,
        });
        return;
      }

      const err = error as Error;
      res.status(400).json({
        success: false,
        message: "Validation Error",
        errorDetails: err.message || "Invalid query parameters",
      });
    }
  };
};
