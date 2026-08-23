import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/authGuard";
import { validateRequest } from "../../middlewares/validateRequest";
import * as paymentsController from "./controller";
import { createPaymentIntentSchema } from "./validation";

const router = Router();

router.post(
  "/create",
  authenticate,
  authorize("CUSTOMER"),
  validateRequest(createPaymentIntentSchema),
  paymentsController.createPaymentIntent,
);

export default router;
