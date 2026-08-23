import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/authGuard";
import { validateRequest } from "../../middlewares/validateRequest";
import * as availabilityController from "./controller";
import { createAvailabilitySchema } from "./validation";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("TECHNICIAN"),
  validateRequest(createAvailabilitySchema),
  availabilityController.addAvailability,
);

router.get(
  "/",
  authenticate,
  authorize("TECHNICIAN"),
  availabilityController.getMyAvailability,
);

router.delete(
  "/:id",
  authenticate,
  authorize("TECHNICIAN"),
  availabilityController.deleteAvailability,
);

export default router;
