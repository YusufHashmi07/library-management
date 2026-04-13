import { Router } from "express";
import { addStudent, deleteStudent, getAllStudents, updateStudent } from "../controllers/studentController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";
import validateRequest from "../middleware/validationMiddleware.js";
import { studentSchema } from "../middleware/validators.js";

const router = Router();

router.use(authMiddleware, allowRoles("admin"));
router.post("/add", validateRequest(studentSchema), addStudent);
router.get("/all", getAllStudents);
router.put("/update/:id", validateRequest(studentSchema), updateStudent);
router.delete("/delete/:id", deleteStudent);

export default router;
