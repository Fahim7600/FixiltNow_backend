import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/authGuard";
import { validateRequest } from "../../middlewares/validateRequest";
import * as paymentsController from "./controller";
import { createPaymentIntentSchema } from "./validation";

const router = Router();

router.post("/confirm", paymentsController.confirmWebhook);

router.post(
  "/create",
  authenticate,
  authorize("CUSTOMER"),
  validateRequest(createPaymentIntentSchema),
  paymentsController.createPaymentIntent,
);

router.get(
  "/",
  authenticate,
  authorize("CUSTOMER", "TECHNICIAN", "ADMIN"),
  paymentsController.getMyPayments,
);

router.get(
  "/:id",
  authenticate,
  authorize("CUSTOMER", "TECHNICIAN", "ADMIN"),
  paymentsController.getPaymentById,
);

export default router;
