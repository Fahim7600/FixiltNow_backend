import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/authGuard";
import { validateRequest } from "../../middlewares/validateRequest";
import * as servicesController from "./controller";
import { createServiceSchema, updateServiceSchema } from "./validation";

const router = Router();

/**
 * @openapi
 * /technician/services:
 *   post:
 *     summary: Create a new service listing owned by the technician
 *     tags:
 *       - Services
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categoryId
 *               - title
 *               - price
 *             properties:
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *                 example: 694c4c28-8e69-414d-8bf7-c84bcc11028d
 *               title:
 *                 type: string
 *                 example: Emergency Leak Repair
 *               description:
 *                 type: string
 *                 example: Fast fix for leaking pipes
 *               price:
 *                 type: number
 *                 example: 75.00
 *     responses:
 *       201:
 *         description: Service created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 *       400:
 *         description: Validation error or invalid category
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Technician role required)
 *       404:
 *         description: Technician profile missing
 *   get:
 *     summary: List all services owned by the authenticated technician
 *     tags:
 *       - Services
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Services retrieved successfully
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
  validateRequest(createServiceSchema),
  servicesController.createService,
);

router.get(
  "/",
  authenticate,
  authorize("TECHNICIAN"),
  servicesController.getMyServices,
);

/**
 * @openapi
 * /technician/services/{id}:
 *   patch:
 *     summary: Update an existing service owned by the technician
 *     tags:
 *       - Services
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Service UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Service updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden or ownership mismatch
 *       404:
 *         description: Service not found
 *   delete:
 *     summary: Delete a service listing owned by the technician
 *     tags:
 *       - Services
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Service UUID
 *     responses:
 *       200:
 *         description: Service deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden or ownership mismatch
 *       404:
 *         description: Service not found
 */
router.patch(
  "/:id",
  authenticate,
  authorize("TECHNICIAN"),
  validateRequest(updateServiceSchema),
  servicesController.updateService,
);

router.delete(
  "/:id",
  authenticate,
  authorize("TECHNICIAN"),
  servicesController.deleteService,
);

export default router;
