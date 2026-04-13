import { Router } from "express";
import { addBook, deleteBook, getAllBooks, getPublicBooks, updateBook } from "../controllers/bookController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";
import validateRequest from "../middleware/validationMiddleware.js";
import { bookSchema } from "../middleware/validators.js";

const router = Router();

router.get("/public", getPublicBooks);
router.use(authMiddleware, allowRoles("admin"));
router.post("/add", validateRequest(bookSchema), addBook);
router.get("/all", getAllBooks);
router.put("/update/:id", validateRequest(bookSchema), updateBook);
router.delete("/delete/:id", deleteBook);

export default router;
