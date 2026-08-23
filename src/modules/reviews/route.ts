import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/authGuard";
import { validateRequest } from "../../middlewares/validateRequest";
import * as reviewsController from "./controller";
import { createReviewSchema } from "./validation";

const router = Router();

/**
 * @openapi
 * /reviews:
 *   post:
 *     summary: Submit a rating and review for a COMPLETED booking (Customer only)
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *               - rating
 *             properties:
 *               bookingId:
 *                 type: string
 *                 format: uuid
 *                 example: 57ddea74-ab05-4c61-9c23-fcd10796b2a9
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 maxLength: 1000
 *                 example: "Excellent service, quick and clean!"
 *     responses:
 *       201:
 *         description: Review created and technician average rating recalculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 *       400:
 *         description: Validation error, uncompleted booking, or duplicate review
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Customer role required or non-owner)
 *       404:
 *         description: Booking not found
 */
router.post(
  "/",
  authenticate,
  authorize("CUSTOMER"),
  validateRequest(createReviewSchema),
  reviewsController.createReview,
);

export default router;
