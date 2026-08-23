import type { Request, Response } from "express";
import { AppError } from "../../utils/AppError";
import { asyncHandler } from "../../utils/asyncHandler";
import * as availabilityService from "./service";

export const addAvailability = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError(401, "Unauthorized", "User ID missing from request");
    }

    const result = await availabilityService.addAvailability(userId, req.body);
    res.status(201).json({
      success: true,
      message: "Availability window added successfully",
      data: result,
    });
  },
);

export const getMyAvailability = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError(401, "Unauthorized", "User ID missing from request");
    }

    const result = await availabilityService.getMyAvailability(userId);
    res.status(200).json({
      success: true,
      message: "Availability windows retrieved successfully",
      data: result,
    });
  },
);

export const deleteAvailability = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError(401, "Unauthorized", "User ID missing from request");
    }

    const availabilityId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    await availabilityService.deleteAvailability(userId, availabilityId);
    res.status(200).json({
      success: true,
      message: "Availability window deleted successfully",
    });
  },
);
