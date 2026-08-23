import type { Role } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import jwt, { type Secret } from "jsonwebtoken";
import { config } from "../config/env";

export const authenticate = (
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
      role: Role;
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

export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
        errorDetails: "Authentication required before authorization",
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role as Role)) {
      res.status(403).json({
        success: false,
        message: "Forbidden",
        errorDetails: "You do not have permission to access this resource",
      });
      return;
    }

    next();
  };
};
