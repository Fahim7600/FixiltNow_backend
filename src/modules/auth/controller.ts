import type { Request, Response } from "express";
import { AppError } from "../../utils/AppError";
import { asyncHandler } from "../../utils/asyncHandler";
import * as authService from "./service";

export const register = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const result = await authService.registerUser(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  },
);

export const login = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const result = await authService.loginUser(req.body);
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: result,
    });
  },
);

export const getMe = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError(401, "Unauthorized", "User ID missing from request");
    }

    const result = await authService.getMe(userId);
    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data: result,
    });
  },
);
