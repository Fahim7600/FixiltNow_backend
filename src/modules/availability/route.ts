import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/authGuard";
import { validateRequest } from "../../middlewares/validateRequest";
import * as availabilityController from "./controller";
import { createAvailabilitySchema } from "./validation";

const router = Router();

/**
 * @openapi
 * /technician/availability:
 *   post:
 *     summary: Add recurring weekly availability window for technician
 *     tags:
 *       - Availability
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dayOfWeek
 *               - startTime
 *               - endTime
 *             properties:
 *               dayOfWeek:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 6
 *                 example: 1
 *                 description: "0 = Sunday, 1 = Monday, ..., 6 = Saturday"
 *               startTime:
 *                 type: string
 *                 pattern: "^([01]\\d|2[0-3]):([0-5]\\d)$"
 *                 example: "09:00"
 *               endTime:
 *                 type: string
 *                 pattern: "^([01]\\d|2[0-3]):([0-5]\\d)$"
 *                 example: "17:00"
 *     responses:
 *       201:
 *         description: Availability window added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 *       400:
 *         description: Validation error or time slot overlap
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Technician role required)
 *   get:
 *     summary: Retrieve technician's own availability windows
 *     tags:
 *       - Availability
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Availability windows retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Technician role required)
 */
router.post(
  "/",
  authenticate,
  authorize("TECHNICIAN"),
  validateRequest(createAvailabilitySchema),
  availabilityController.addAvailability,
);

router.get(
  "/",
  authenticate,
  authorize("TECHNICIAN"),
  availabilityController.getMyAvailability,
);

/**
 * @openapi
 * /technician/availability/{id}:
 *   delete:
 *     summary: Delete an availability window owned by the technician
 *     tags:
 *       - Availability
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Availability UUID
 *     responses:
 *       200:
 *         description: Availability window deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden or ownership mismatch
 *       404:
 *         description: Availability window not found
 */
router.delete(
  "/:id",
  authenticate,
  authorize("TECHNICIAN"),
  availabilityController.deleteAvailability,
);

export default router;
