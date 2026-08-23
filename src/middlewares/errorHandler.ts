import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errorDetails: err.errorDetails,
    });
    return;
  }

  if (err instanceof ZodError) {
    const formattedErrors = err.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(", ");

    res.status(400).json({
      success: false,
      message: "Validation Error",
      errorDetails: formattedErrors,
    });
    return;
  }

  if (typeof err === "object" && err !== null && "code" in err) {
    const code = (err as { code: unknown }).code;
    if (typeof code === "string") {
      if (code === "P2002") {
        res.status(400).json({
          success: false,
          message: "Duplicate field value entered",
          errorDetails: "A record with this unique field already exists.",
        });
        return;
      }

      if (code === "P2025") {
        res.status(404).json({
          success: false,
          message: "Record not found",
          errorDetails: "Requested record does not exist.",
        });
        return;
      }
    }
  }

  // Log unexpected errors server-side
  console.error("Unhandled Error:", err);

  res.status(500).json({
    success: false,
    message: "Something went wrong",
    errorDetails: "Internal server error",
  });
};
