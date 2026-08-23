import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/authGuard";
import { validateRequest } from "../../middlewares/validateRequest";
import * as bookingsController from "./controller";
import { createBookingSchema } from "./validation";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("CUSTOMER"),
  validateRequest(createBookingSchema),
  bookingsController.createBooking,
);

export default router;
