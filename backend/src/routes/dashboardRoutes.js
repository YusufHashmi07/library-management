import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";

const router = Router();

router.get("/stats", authMiddleware, allowRoles("admin"), getDashboardStats);

export default router;
