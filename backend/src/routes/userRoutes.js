import { Router } from "express";
import { getMyProfile } from "../controllers/userController.js";
import { getMyIssues, issueBookForUser, returnBookForUser } from "../controllers/issueController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";

const router = Router();

router.get("/me", authMiddleware, allowRoles("user"), getMyProfile);
router.get("/issues", authMiddleware, allowRoles("user"), getMyIssues);
router.post("/issues/:bookId", authMiddleware, allowRoles("user"), issueBookForUser);
router.post("/issues/:issueId/return", authMiddleware, allowRoles("user"), returnBookForUser);

export default router;
