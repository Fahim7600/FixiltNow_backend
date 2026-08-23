import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/authGuard";
import { validateRequest } from "../../middlewares/validateRequest";
import * as technicianProfileController from "./controller";
import { upsertProfileSchema } from "./validation";

const router = Router();

/**
 * @openapi
 * /technician/profile:
 *   put:
 *     summary: Create or update technician's own profile
 *     tags:
 *       - Technician Profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bio:
 *                 type: string
 *                 example: Expert electrician with 10 years experience
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Wiring", "Lighting", "Panels"]
 *               experienceYears:
 *                 type: integer
 *                 example: 5
 *               hourlyRate:
 *                 type: number
 *                 example: 45.50
 *               location:
 *                 type: string
 *                 example: "Dallas, TX"
 *     responses:
 *       200:
 *         description: Profile saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Technician role required)
 *   get:
 *     summary: Get technician's own profile details
 *     tags:
 *       - Technician Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Technician role required)
 *       404:
 *         description: Profile not found
 */
router.put(
  "/profile",
  authenticate,
  authorize("TECHNICIAN"),
  validateRequest(upsertProfileSchema),
  technicianProfileController.upsertProfile,
);

router.get(
  "/profile",
  authenticate,
  authorize("TECHNICIAN"),
  technicianProfileController.getMyProfile,
);

export default router;
