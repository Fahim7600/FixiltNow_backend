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

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await authService.loginUser(req.body);
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: result,
    });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(400).json({
      success: false,
      message: err.message || "Login failed",
      errorDetails: err.message || "An unexpected error occurred",
    });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
        errorDetails: "User ID missing from request",
      });
      return;
    }

    const result = await authService.getMe(userId);
    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data: result,
    });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(400).json({
      success: false,
      message: err.message || "Failed to retrieve profile",
      errorDetails: err.message || "An unexpected error occurred",
    });
  }
};
