import { Router } from "express";
import { loginAccount, registerUser } from "../controllers/authController.js";
import authRateLimiter from "../middleware/authRateLimiter.js";
import validateRequest from "../middleware/validationMiddleware.js";
import { loginSchema, registerSchema } from "../middleware/validators.js";

const router = Router();

router.post("/register", authRateLimiter, validateRequest(registerSchema), registerUser);
router.post("/login", authRateLimiter, validateRequest(loginSchema), loginAccount);

export default router;
