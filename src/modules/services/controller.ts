import type { Request, Response } from "express";
import { AppError } from "../../utils/AppError";
import { asyncHandler } from "../../utils/asyncHandler";
import * as servicesService from "./service";

export const createService = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError(401, "Unauthorized", "User ID missing from request");
    }

    const result = await servicesService.createService(userId, req.body);
    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: result,
    });
  },
);

export const getMyServices = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError(401, "Unauthorized", "User ID missing from request");
    }

    const result = await servicesService.getMyServices(userId);
    res.status(200).json({
      success: true,
      message: "Services retrieved successfully",
      data: result,
    });
  },
);

export const updateService = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError(401, "Unauthorized", "User ID missing from request");
    }

    const serviceId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const result = await servicesService.updateService(
      userId,
      serviceId,
      req.body,
    );
    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: result,
    });
  },
);

export const deleteService = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError(401, "Unauthorized", "User ID missing from request");
    }

    const serviceId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    await servicesService.deleteService(userId, serviceId);
    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  },
);
