import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import * as categoryService from "./service";

export const createCategory = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const result = await categoryService.createCategory(req.body);
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: result,
    });
  },
);

export const getAllCategories = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const result = await categoryService.getAllCategories();
    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: result,
    });
  },
);
