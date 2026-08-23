import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import * as catalogService from "./service";
import type { ServicesQueryInput, TechniciansQueryInput } from "./validation";

export const getServices = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const result = await catalogService.getPublicServices(
      req.query as unknown as ServicesQueryInput,
    );
    res.status(200).json({
      success: true,
      message: "Services retrieved successfully",
      data: result,
    });
  },
);

export const getTechnicians = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const result = await catalogService.getPublicTechnicians(
      req.query as unknown as TechniciansQueryInput,
    );
    res.status(200).json({
      success: true,
      message: "Technicians retrieved successfully",
      data: result,
    });
  },
);

export const getTechnicianById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await catalogService.getTechnicianById(id);
    res.status(200).json({
      success: true,
      message: "Technician retrieved successfully",
      data: result,
    });
  },
);
