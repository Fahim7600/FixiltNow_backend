import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/authGuard";
import { validateRequest } from "../../middlewares/validateRequest";
import * as technicianProfileController from "./controller";
import { upsertProfileSchema } from "./validation";

const router = Router();

router.put(
  "/profile",
  authenticate,
  authorize("TECHNICIAN"),
  validateRequest(upsertProfileSchema),
  technicianProfileController.upsertProfile,
);

router.get(
  "/profile",
  authenticate,
  authorize("TECHNICIAN"),
  technicianProfileController.getMyProfile,
);

export default router;
