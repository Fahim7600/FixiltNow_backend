import { Router } from "express";
import { validateQuery } from "../../middlewares/validateRequest";
import * as catalogController from "./controller";
import { servicesQuerySchema, techniciansQuerySchema } from "./validation";

export const publicServicesRouter = Router();

/**
 * @openapi
 * /services:
 *   get:
 *     summary: Publicly browse and search active services across all technicians
 *     tags:
 *       - Catalog
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by category UUID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Case-insensitive search on title
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by technician location
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [price_asc, price_desc, newest]
 *           default: newest
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
 *         description: Services retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 */
publicServicesRouter.get(
  "/",
  validateQuery(servicesQuerySchema),
  catalogController.getServices,
);

export const publicTechniciansRouter = Router();

/**
 * @openapi
 * /technicians:
 *   get:
 *     summary: Publicly browse and search technician profiles
 *     tags:
 *       - Catalog
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by technician name
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *       - in: query
 *         name: skills
 *         schema:
 *           type: string
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
 *         description: Technicians retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 */
publicTechniciansRouter.get(
  "/",
  validateQuery(techniciansQuerySchema),
  catalogController.getTechnicians,
);

/**
 * @openapi
 * /technicians/{id}:
 *   get:
 *     summary: Retrieve detailed public profile of a technician including services and reviews
 *     tags:
 *       - Catalog
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Technician Profile ID or User ID
 *     responses:
 *       200:
 *         description: Technician profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 *       404:
 *         description: Technician not found
 */
publicTechniciansRouter.get("/:id", catalogController.getTechnicianById);
