import type { Request, Response } from "express";
import { AppError } from "../../utils/AppError";
import { asyncHandler } from "../../utils/asyncHandler";
import * as bookingsService from "./service";

export const createBooking = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const customerId = req.user?.userId;
    if (!customerId) {
      throw new AppError(401, "Unauthorized", "User ID missing from request");
    }

    const result = await bookingsService.createBooking(customerId, req.body);
    res.status(201).json({
      success: true,
      message: "Booking request created successfully",
      data: result,
    });
  },
);
