import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/authGuard";
import { validateRequest } from "../../middlewares/validateRequest";
import * as bookingsController from "./controller";
import { createBookingSchema, updateBookingStatusSchema } from "./validation";

const router = Router();

/**
 * @openapi
 * /bookings:
 *   post:
 *     summary: Create a new booking request for a service (Customer only)
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serviceId
 *               - scheduledDate
 *             properties:
 *               serviceId:
 *                 type: string
 *                 format: uuid
 *                 example: 8089e098-96c5-445a-9d35-6f8e3e7220f4
 *               scheduledDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-09-01T10:00:00.000Z"
 *               notes:
 *                 type: string
 *                 example: Please bring extra ladder
 *     responses:
 *       201:
 *         description: Booking request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 *       400:
 *         description: Validation error or inactive service
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Customer role required)
 *       404:
 *         description: Service not found
 *   get:
 *     summary: Retrieve list of bookings for the caller (Customer or Technician)
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bookings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin role restricted here, use /admin/bookings)
 */
router.post(
  "/",
  authenticate,
  authorize("CUSTOMER"),
  validateRequest(createBookingSchema),
  bookingsController.createBooking,
);

router.get(
  "/",
  authenticate,
  authorize("CUSTOMER", "TECHNICIAN"),
  bookingsController.getMyBookings,
);

/**
 * @openapi
 * /bookings/{id}:
 *   get:
 *     summary: Retrieve booking details by ID (Customer owner or assigned Technician)
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Booking UUID
 *     responses:
 *       200:
 *         description: Booking details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Unauthorized caller)
 *       404:
 *         description: Booking not found
 */
router.get(
  "/:id",
  authenticate,
  authorize("CUSTOMER", "TECHNICIAN"),
  bookingsController.getBookingById,
);

export const technicianBookingRouter = Router();

/**
 * @openapi
 * /technician/bookings/{id}:
 *   patch:
 *     summary: Technician updates status of an assigned booking (REQUESTED -> ACCEPTED/DECLINED, ACCEPTED -> IN_PROGRESS, IN_PROGRESS -> COMPLETED)
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Booking UUID
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
 *                 enum: [ACCEPTED, DECLINED, IN_PROGRESS, COMPLETED]
 *     responses:
 *       200:
 *         description: Booking status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 *       400:
 *         description: Invalid status transition or validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Technician owner check failed)
 *       404:
 *         description: Booking not found
 */
technicianBookingRouter.patch(
  "/:id",
  authenticate,
  authorize("TECHNICIAN"),
  validateRequest(updateBookingStatusSchema),
  bookingsController.updateBookingStatus,
);

export default router;
