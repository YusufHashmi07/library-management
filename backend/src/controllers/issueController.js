import Book from "../models/Book.js";
import Issue from "../models/Issue.js";
import Student from "../models/Student.js";
import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/User.js";

export const issueBook = asyncHandler(async (req, res) => {
  const { bookId, studentId } = req.body;

  const [book, student] = await Promise.all([Book.findById(bookId), Student.findById(studentId)]);

  if (!book) {
    return res.status(404).json({ success: false, message: "Book not found" });
  }

  if (!student) {
    return res.status(404).json({ success: false, message: "Student not found" });
  }

  if (book.quantity <= 0) {
    return res.status(400).json({ success: false, message: "Book not available for issue" });
  }

  book.quantity -= 1;
  book.availability = book.quantity > 0;
  await book.save();

  const issue = await Issue.create({
    book: book._id,
    student: student._id,
    issueDate: new Date(),
    status: "issued",
  });

  return res.status(201).json({ success: true, message: "Book issued successfully", data: issue });
});

export const returnBook = asyncHandler(async (req, res) => {
  const { issueId } = req.body;

  const issue = await Issue.findById(issueId);

  if (!issue) {
    return res.status(404).json({ success: false, message: "Issue record not found" });
  }

  if (issue.status === "returned") {
    return res.status(400).json({ success: false, message: "Book already returned" });
  }

  issue.status = "returned";
  issue.returnDate = new Date();
  await issue.save();

  const book = await Book.findById(issue.book);
  if (book) {
    book.quantity += 1;
    book.availability = true;
    await book.save();
  }

  return res.status(200).json({ success: true, message: "Book returned successfully", data: issue });
});

export const getAllIssues = asyncHandler(async (req, res) => {
  const issues = await Issue.find()
    .populate("book", "title author ISBN")
    .populate("student", "name email enrollmentNumber")
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  return res.status(200).json({ success: true, data: issues });
});

export const issueBookForUser = asyncHandler(async (req, res) => {
  const { bookId } = req.params;

  const [book, user] = await Promise.all([
    Book.findById(bookId),
    User.findById(req.user.id).select("_id name email"),
  ]);

  if (!book) {
    return res.status(404).json({ success: false, message: "Book not found" });
  }

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  if (book.quantity <= 0) {
    return res.status(400).json({ success: false, message: "Book not available for issue" });
  }

  const activeIssue = await Issue.findOne({
    user: user._id,
    book: book._id,
    status: "issued",
  });

  if (activeIssue) {
    return res.status(400).json({
      success: false,
      message: "You already have this book issued",
    });
  }

  book.quantity -= 1;
  book.availability = book.quantity > 0;
  await book.save();

  const issue = await Issue.create({
    book: book._id,
    user: user._id,
    issueDate: new Date(),
    status: "issued",
  });

  const populatedIssue = await issue.populate("book", "title author category ISBN");

  return res.status(201).json({
    success: true,
    message: "Book issued successfully",
    data: populatedIssue,
  });
});

export const returnBookForUser = asyncHandler(async (req, res) => {
  const { issueId } = req.params;

  const issue = await Issue.findOne({
    _id: issueId,
    user: req.user.id,
  });

  if (!issue) {
    return res.status(404).json({
      success: false,
      message: "Issue record not found for this user",
    });
  }

  if (issue.status === "returned") {
    return res.status(400).json({ success: false, message: "Book already returned" });
  }

  issue.status = "returned";
  issue.returnDate = new Date();
  await issue.save();

  const book = await Book.findById(issue.book);
  if (book) {
    book.quantity += 1;
    book.availability = true;
    await book.save();
  }

  return res.status(200).json({
    success: true,
    message: "Book returned successfully",
    data: issue,
  });
});

export const getMyIssues = asyncHandler(async (req, res) => {
  const issues = await Issue.find({ user: req.user.id })
    .populate("book", "title author category ISBN")
    .sort({ createdAt: -1 });

  return res.status(200).json({ success: true, data: issues });
});
