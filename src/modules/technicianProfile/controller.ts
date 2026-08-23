import type { Request, Response } from "express";
import { AppError } from "../../utils/AppError";
import { asyncHandler } from "../../utils/asyncHandler";
import * as technicianProfileService from "./service";

export const upsertProfile = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError(401, "Unauthorized", "User ID missing from request");
    }

    const result = await technicianProfileService.upsertProfile(
      userId,
      req.body,
    );
    res.status(200).json({
      success: true,
      message: "Technician profile saved successfully",
      data: result,
    });
  },
);

export const getMyProfile = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError(401, "Unauthorized", "User ID missing from request");
    }

    const result = await technicianProfileService.getMyProfile(userId);
    res.status(200).json({
      success: true,
      message: "Technician profile retrieved successfully",
      data: result,
    });
  },
);
