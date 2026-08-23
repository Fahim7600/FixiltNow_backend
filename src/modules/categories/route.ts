import { Router } from "express";
import * as categoryController from "./controller";

const router = Router();

/**
 * @openapi
 * /categories:
 *   get:
 *     summary: Retrieve list of all service categories
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 */
router.get("/", categoryController.getAllCategories);

export default router;
