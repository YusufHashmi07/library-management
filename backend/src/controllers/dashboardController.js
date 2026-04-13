import Book from "../models/Book.js";
import Issue from "../models/Issue.js";
import Student from "../models/Student.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalBooks, totalStudents, issuedBooks, returnedBooks] = await Promise.all([
    Book.countDocuments(),
    Student.countDocuments(),
    Issue.countDocuments({ status: "issued" }),
    Issue.countDocuments({ status: "returned" }),
  ]);

  return res.status(200).json({
    success: true,
    data: { totalBooks, totalStudents, issuedBooks, returnedBooks },
  });
});
