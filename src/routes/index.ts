import { Router } from "express";
import adminRoutes from "../modules/admin/route";
import authRoutes from "../modules/auth/route";
import categoryRoutes from "../modules/categories/route";

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

export default router;
