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

/**
 * @openapi
 * /admin/categories:
 *   post:
 *     summary: Create a new service category (Admin only)
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electrical
 *               description:
 *                 type: string
 *                 example: Electrical repairs and installations
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 *       400:
 *         description: Duplicate category or validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin role required)
 *   get:
 *     summary: List all service categories (Admin view)
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin role required)
 */
router.post(
  "/categories",
  validateRequest(createCategorySchema),
  categoryController.createCategory,
);
router.get("/categories", adminController.getAllCategories);

/**
 * @openapi
 * /admin/users:
 *   get:
 *     summary: Retrieve paginated list of all users across the platform (Admin only)
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [CUSTOMER, TECHNICIAN, ADMIN]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, BANNED]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Users retrieved successfully (password field omitted)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin role required)
 */
router.get(
  "/users",
  validateQuery(adminUsersQuerySchema),
  adminController.getAllUsers,
);

/**
 * @openapi
 * /admin/users/{id}:
 *   patch:
 *     summary: Update user status to ACTIVE or BANNED (Admin only, safety guard prevents banning ADMIN accounts)
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Target User UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, BANNED]
 *     responses:
 *       200:
 *         description: User status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 *       400:
 *         description: Attempted to ban an admin account or validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin role required)
 *       404:
 *         description: User not found
 */
router.patch(
  "/users/:id",
  validateRequest(updateUserStatusSchema),
  adminController.updateUserStatus,
);

/**
 * @openapi
 * /admin/bookings:
 *   get:
 *     summary: Retrieve platform-wide paginated list of all bookings (Admin only)
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [REQUESTED, ACCEPTED, DECLINED, PAID, IN_PROGRESS, COMPLETED, CANCELLED]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Platform bookings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin role required)
 */
router.get(
  "/bookings",
  validateQuery(adminBookingsQuerySchema),
  adminController.getAllBookings,
);

/**
 * @openapi
 * /admin/payments:
 *   get:
 *     summary: Retrieve platform-wide paginated list of all payments (Admin only)
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, COMPLETED, FAILED]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Platform payments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin role required)
 */
router.get(
  "/payments",
  validateQuery(adminPaymentsQuerySchema),
  adminController.getAllPayments,
);

export default router;
