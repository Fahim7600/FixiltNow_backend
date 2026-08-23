import type { Request, Response } from "express";
import { AppError } from "../../utils/AppError";
import { asyncHandler } from "../../utils/asyncHandler";
import * as reviewsService from "./service";

export const createReview = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const customerId = req.user?.userId;
    if (!customerId) {
      throw new AppError(401, "Unauthorized", "User ID missing from request");
    }

    const review = await reviewsService.createReview(customerId, req.body);

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  },
);

export const getTechnicianReviews = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { technicianProfileId } = req.params;
    const targetId = Array.isArray(technicianProfileId)
      ? technicianProfileId[0]
      : technicianProfileId;

    const reviews = await reviewsService.getTechnicianReviews(targetId);

    res.status(200).json({
      success: true,
      message: "Technician reviews retrieved successfully",
      data: reviews,
    });
  },
);
