import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import * as authController from "./controller";
import { tempAuthGuard } from "./tempAuth";
import { loginSchema, registerSchema } from "./validation";

const router = Router();

router.post(
  "/register",
  validateRequest(registerSchema),
  authController.register,
);
router.post("/login", validateRequest(loginSchema), authController.login);
router.get("/me", tempAuthGuard, authController.getMe);

export default router;
