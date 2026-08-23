import { Router } from "express";
import authRoutes from "../modules/auth/route";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
});

router.use("/auth", authRoutes);

export default router;
