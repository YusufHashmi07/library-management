import Student from "../models/Student.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const addStudent = asyncHandler(async (req, res) => {
  const existing = await Student.findOne({
    $or: [{ email: req.body.email.toLowerCase() }, { enrollmentNumber: req.body.enrollmentNumber }],
  });

  if (existing) {
    return res.status(409).json({ success: false, message: "Student already exists with email or enrollment number" });
  }

  const student = await Student.create(req.body);
  return res.status(201).json({ success: true, message: "Student added", data: student });
});

export const getAllStudents = asyncHandler(async (req, res) => {
  const students = await Student.find().sort({ createdAt: -1 });
  return res.status(200).json({ success: true, data: students });
});

export const updateStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    return res.status(404).json({ success: false, message: "Student not found" });
  }

  Object.assign(student, req.body);
  await student.save();

  return res.status(200).json({ success: true, message: "Student updated", data: student });
});

export const deleteStudent = asyncHandler(async (req, res) => {
  const deleted = await Student.findByIdAndDelete(req.params.id);

  if (!deleted) {
    return res.status(404).json({ success: false, message: "Student not found" });
  }

  return res.status(200).json({ success: true, message: "Student deleted" });
});
