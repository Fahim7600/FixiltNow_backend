import type { Request, Response } from "express";
import * as authService from "./service";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await authService.registerUser(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(400).json({
      success: false,
      message: err.message || "Registration failed",
      errorDetails: err.message || "An unexpected error occurred",
    });
  }
};
