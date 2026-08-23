import { Router } from "express";
import { validateQuery } from "../../middlewares/validateRequest";
import * as catalogController from "./controller";
import { servicesQuerySchema, techniciansQuerySchema } from "./validation";

export const publicServicesRouter = Router();
publicServicesRouter.get(
  "/",
  validateQuery(servicesQuerySchema),
  catalogController.getServices,
);

export const publicTechniciansRouter = Router();
publicTechniciansRouter.get(
  "/",
  validateQuery(techniciansQuerySchema),
  catalogController.getTechnicians,
);
publicTechniciansRouter.get("/:id", catalogController.getTechnicianById);
