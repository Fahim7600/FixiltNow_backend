import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/authGuard";
import {
  validateQuery,
  validateRequest,
} from "../../middlewares/validateRequest";
import * as categoryController from "../categories/controller";
import { createCategorySchema } from "../categories/validation";
import * as adminController from "./controller";
import {
  adminBookingsQuerySchema,
  adminPaymentsQuerySchema,
  adminUsersQuerySchema,
  updateUserStatusSchema,
} from "./validation";

const router = Router();

// Protect all admin routes with authenticate + authorize('ADMIN')
router.use(authenticate, authorize("ADMIN"));

// Categories
router.post(
  "/categories",
  validateRequest(createCategorySchema),
  categoryController.createCategory,
);
router.get("/categories", adminController.getAllCategories);

// Users
router.get(
  "/users",
  validateQuery(adminUsersQuerySchema),
  adminController.getAllUsers,
);
router.patch(
  "/users/:id",
  validateRequest(updateUserStatusSchema),
  adminController.updateUserStatus,
);

// Bookings
router.get(
  "/bookings",
  validateQuery(adminBookingsQuerySchema),
  adminController.getAllBookings,
);

// Payments
router.get(
  "/payments",
  validateQuery(adminPaymentsQuerySchema),
  adminController.getAllPayments,
);

export default router;
