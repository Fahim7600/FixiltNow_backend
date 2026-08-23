import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/authGuard";
import { validateRequest } from "../../middlewares/validateRequest";
import * as categoryController from "../categories/controller";
import { createCategorySchema } from "../categories/validation";

const router = Router();

router.post(
  "/categories",
  authenticate,
  authorize("ADMIN"),
  validateRequest(createCategorySchema),
  categoryController.createCategory,
);

export default router;
