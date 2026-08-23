import type { NextFunction, Request, Response } from "express";
import jwt, { type Secret } from "jsonwebtoken";
import { config } from "../../config/env";

// temporary, will move to src/middlewares in next step
export const tempAuthGuard = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
      errorDetails: "No token provided",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret as Secret) as {
      userId: string;
      role: string;
    };
    req.user = decoded;
    next();
  } catch (_error: unknown) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
      errorDetails: "Invalid or expired token",
    });
  }
};
