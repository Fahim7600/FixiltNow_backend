import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/authGuard";
import { validateRequest } from "../../middlewares/validateRequest";
import * as bookingsController from "./controller";
import { createBookingSchema, updateBookingStatusSchema } from "./validation";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("CUSTOMER"),
  validateRequest(createBookingSchema),
  bookingsController.createBooking,
);

router.get(
  "/",
  authenticate,
  authorize("CUSTOMER", "TECHNICIAN"),
  bookingsController.getMyBookings,
);

router.get(
  "/:id",
  authenticate,
  authorize("CUSTOMER", "TECHNICIAN"),
  bookingsController.getBookingById,
);

export const technicianBookingRouter = Router();

technicianBookingRouter.patch(
  "/:id",
  authenticate,
  authorize("TECHNICIAN"),
  validateRequest(updateBookingStatusSchema),
  bookingsController.updateBookingStatus,
);

export default router;
