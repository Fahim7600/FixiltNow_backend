import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import * as authController from "./controller";
import { registerSchema } from "./validation";

const router = Router();

router.post(
  "/register",
  validateRequest(registerSchema),
  authController.register,
);

export default router;
