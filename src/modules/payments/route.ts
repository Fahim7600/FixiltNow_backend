import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/authGuard";
import { validateRequest } from "../../middlewares/validateRequest";
import * as paymentsController from "./controller";
import { createPaymentIntentSchema } from "./validation";

const router = Router();

/**
 * @openapi
 * /payments/confirm:
 *   post:
 *     summary: Stripe Webhook endpoint for confirming PaymentIntents (Public, signature verified)
 *     tags:
 *       - Payments
 *     responses:
 *       200:
 *         description: Webhook event processed successfully
 *       400:
 *         description: Invalid signature or payload error
 */
router.post("/confirm", paymentsController.confirmWebhook);

/**
 * @openapi
 * /payments/create:
 *   post:
 *     summary: Initiate a Stripe PaymentIntent for an ACCEPTED booking (Customer only)
 *     tags:
 *       - Payments
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
 *             properties:
 *               bookingId:
 *                 type: string
 *                 format: uuid
 *                 example: 4512e322-3f98-4bdd-a2d8-dab4d18022e2
 *     responses:
 *       200:
 *         description: PaymentIntent created or reused successfully (returns clientSecret)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 *       400:
 *         description: Invalid booking status or validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Customer role required or non-owner)
 *       404:
 *         description: Booking not found
 *   get:
 *     summary: List payments for the caller (Customer or Technician)
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin role restricted here, use /admin/payments)
 */
router.post(
  "/create",
  authenticate,
  authorize("CUSTOMER"),
  validateRequest(createPaymentIntentSchema),
  paymentsController.createPaymentIntent,
);

router.get(
  "/",
  authenticate,
  authorize("CUSTOMER", "TECHNICIAN", "ADMIN"),
  paymentsController.getMyPayments,
);

/**
 * @openapi
 * /payments/{id}:
 *   get:
 *     summary: Get payment details by ID (Customer owner, assigned Technician, or Admin)
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Payment UUID
 *     responses:
 *       200:
 *         description: Payment details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Payment not found
 */
router.get(
  "/:id",
  authenticate,
  authorize("CUSTOMER", "TECHNICIAN", "ADMIN"),
  paymentsController.getPaymentById,
);

export default router;
