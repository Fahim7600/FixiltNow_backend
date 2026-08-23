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

export const getMyBookings = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const role = req.user?.role;
    if (!userId || !role) {
      throw new AppError(
        401,
        "Unauthorized",
        "User details missing from request",
      );
    }

    const result = await bookingsService.getMyBookings(userId, role);
    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: result,
    });
  },
);

export const getBookingById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const role = req.user?.role;
    if (!userId || !role) {
      throw new AppError(
        401,
        "Unauthorized",
        "User details missing from request",
      );
    }

    const bookingId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const result = await bookingsService.getBookingById(
      userId,
      role,
      bookingId,
    );
    res.status(200).json({
      success: true,
      message: "Booking retrieved successfully",
      data: result,
    });
  },
);

export const updateBookingStatus = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError(401, "Unauthorized", "User ID missing from request");
    }

    const bookingId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const { status } = req.body;

    const result = await bookingsService.updateBookingStatus(
      userId,
      bookingId,
      status,
    );

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      data: result,
    });
  },
);
