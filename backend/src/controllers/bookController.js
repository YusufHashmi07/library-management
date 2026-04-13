import Book from "../models/Book.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const getPublicBooks = asyncHandler(async (req, res) => {
  const books = await Book.find({ availability: true }, "title author category ISBN quantity availability").sort({ title: 1 });
  return res.status(200).json({ success: true, data: books });
});

export const addBook = asyncHandler(async (req, res) => {
  const existing = await Book.findOne({ ISBN: req.body.ISBN });

  if (existing) {
    return res.status(409).json({ success: false, message: "Book with this ISBN already exists" });
  }

  const book = await Book.create(req.body);
  return res.status(201).json({ success: true, message: "Book added", data: book });
});

export const getAllBooks = asyncHandler(async (req, res) => {
  const books = await Book.find().sort({ createdAt: -1 });
  return res.status(200).json({ success: true, data: books });
});

export const updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    return res.status(404).json({ success: false, message: "Book not found" });
  }

  Object.assign(book, req.body);
  await book.save();

  return res.status(200).json({ success: true, message: "Book updated", data: book });
});

export const deleteBook = asyncHandler(async (req, res) => {
  const deleted = await Book.findByIdAndDelete(req.params.id);

  if (!deleted) {
    return res.status(404).json({ success: false, message: "Book not found" });
  }

  return res.status(200).json({ success: true, message: "Book deleted" });
});
