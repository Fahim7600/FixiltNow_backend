import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/authGuard";
import { validateRequest } from "../../middlewares/validateRequest";
import * as reviewsController from "./controller";
import { createReviewSchema } from "./validation";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("CUSTOMER"),
  validateRequest(createReviewSchema),
  reviewsController.createReview,
);

export default router;
