import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/authGuard";
import { validateRequest } from "../../middlewares/validateRequest";
import * as servicesController from "./controller";
import { createServiceSchema, updateServiceSchema } from "./validation";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("TECHNICIAN"),
  validateRequest(createServiceSchema),
  servicesController.createService,
);

router.get(
  "/",
  authenticate,
  authorize("TECHNICIAN"),
  servicesController.getMyServices,
);

router.patch(
  "/:id",
  authenticate,
  authorize("TECHNICIAN"),
  validateRequest(updateServiceSchema),
  servicesController.updateService,
);

router.delete(
  "/:id",
  authenticate,
  authorize("TECHNICIAN"),
  servicesController.deleteService,
);

export default router;
