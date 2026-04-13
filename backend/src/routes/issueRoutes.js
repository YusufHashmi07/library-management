import { Router } from "express";
import { getAllIssues, issueBook, returnBook } from "../controllers/issueController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";
import validateRequest from "../middleware/validationMiddleware.js";
import { issueSchema, returnSchema } from "../middleware/validators.js";

const router = Router();

router.use(authMiddleware, allowRoles("admin"));
router.post("/issue", validateRequest(issueSchema), issueBook);
router.post("/return", validateRequest(returnSchema), returnBook);
router.get("/all", getAllIssues);

export default router;
