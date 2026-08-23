import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/authGuard";
import { validateRequest } from "../../middlewares/validateRequest";
import * as authController from "./controller";
import { loginSchema, registerSchema } from "./validation";

const router = Router();

router.post(
  "/register",
  validateRequest(registerSchema),
  authController.register,
);
router.post("/login", validateRequest(loginSchema), authController.login);
router.get("/me", authenticate, authController.getMe);

// Temporary test route for role-based access control verification
router.get(
  "/test-admin-only",
  authenticate,
  authorize("ADMIN"),
  (_req, res) => {
    res.status(200).json({
      success: true,
      message: "You are an admin",
    });
  },
);

export default router;
