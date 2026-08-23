import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import * as adminService from "./service";
import type {
  AdminBookingsQueryInput,
  AdminPaymentsQueryInput,
  AdminUsersQueryInput,
} from "./validation";

export const getAllUsers = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const filters = req.query as unknown as AdminUsersQueryInput;
    const result = await adminService.getAllUsers(filters);
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result,
    });
  },
);

export const updateUserStatus = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const targetId = Array.isArray(id) ? id[0] : id;

    const user = await adminService.updateUserStatus(targetId, req.body.status);
    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: user,
    });
  },
);

export const getAllBookings = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const filters = req.query as unknown as AdminBookingsQueryInput;
    const result = await adminService.getAllBookings(filters);
    res.status(200).json({
      success: true,
      message: "Platform bookings retrieved successfully",
      data: result,
    });
  },
);

export const getAllPayments = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const filters = req.query as unknown as AdminPaymentsQueryInput;
    const result = await adminService.getAllPayments(filters);
    res.status(200).json({
      success: true,
      message: "Platform payments retrieved successfully",
      data: result,
    });
  },
);

export const getAllCategories = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const categories = await adminService.getAllCategories();
    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  },
);
