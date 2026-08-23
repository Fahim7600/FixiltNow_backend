import { Router } from "express";
import adminRoutes from "../modules/admin/route";
import authRoutes from "../modules/auth/route";
import availabilityRoutes from "../modules/availability/route";
import {
  publicServicesRouter,
  publicTechniciansRouter,
} from "../modules/catalog/route";
import categoryRoutes from "../modules/categories/route";
import serviceRoutes from "../modules/services/route";
import technicianProfileRoutes from "../modules/technicianProfile/route";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
});

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/admin", adminRoutes);
router.use("/technician", technicianProfileRoutes);
router.use("/technician/services", serviceRoutes);
router.use("/technician/availability", availabilityRoutes);
router.use("/services", publicServicesRouter);
router.use("/technicians", publicTechniciansRouter);

export default router;
