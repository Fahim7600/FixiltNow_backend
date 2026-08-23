import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/authGuard";
import { loginLimiter, registerLimiter } from "../../middlewares/rateLimiter";
import { validateRequest } from "../../middlewares/validateRequest";
import { asyncHandler } from "../../utils/asyncHandler";
import * as authController from "./controller";
import { loginSchema, registerSchema } from "./validation";

const router = Router();

router.post(
  "/register",
  registerLimiter,
  validateRequest(registerSchema),
  authController.register,
);
router.post(
  "/login",
  loginLimiter,
  validateRequest(loginSchema),
  authController.login,
);
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

// Temporary test route for 500 unexpected error verification
router.get(
  "/test-unexpected-error",
  asyncHandler(async () => {
    throw new Error("Simulated unexpected database failure");
  }),
);

export default router;
