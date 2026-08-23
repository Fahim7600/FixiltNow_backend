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

export const confirmWebhook = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const signature = (req.headers["stripe-signature"] as string) || "";
    const rawBody =
      (req as unknown as { rawBody?: Buffer }).rawBody || req.body;

    const result = await paymentsService.handleWebhookEvent(rawBody, signature);

    res.status(200).json({
      success: true,
      message: "Webhook processed successfully",
      data: result,
    });
  },
);

export const getMyPayments = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const role = req.user?.role;

    if (!userId || !role) {
      throw new AppError(401, "Unauthorized", "User ID missing from request");
    }

    const result = await paymentsService.getMyPayments(userId, role);

    res.status(200).json({
      success: true,
      message: "Payments retrieved successfully",
      data: result,
    });
  },
);

export const getPaymentById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const role = req.user?.role;

    if (!userId || !role) {
      throw new AppError(401, "Unauthorized", "User ID missing from request");
    }

    const paymentId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const result = await paymentsService.getPaymentById(
      userId,
      role,
      paymentId,
    );

    res.status(200).json({
      success: true,
      message: "Payment retrieved successfully",
      data: result,
    });
  },
);
