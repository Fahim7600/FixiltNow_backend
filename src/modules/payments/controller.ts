import type { Request, Response } from "express";
import { AppError } from "../../utils/AppError";
import { asyncHandler } from "../../utils/asyncHandler";
import * as paymentsService from "./service";

export const createPaymentIntent = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const customerId = req.user?.userId;
    if (!customerId) {
      throw new AppError(401, "Unauthorized", "User ID missing from request");
    }

    const { bookingId } = req.body;
    const result = await paymentsService.createPaymentIntent(
      customerId,
      bookingId,
    );

    res.status(201).json({
      success: true,
      message: "Payment intent created successfully",
      data: result,
    });
  },
);
