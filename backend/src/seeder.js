import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import connectDB from "./config/db.js";
import Admin from "./models/Admin.js";
import Book from "./models/Book.js";
import Student from "./models/Student.js";
import Issue from "./models/Issue.js";
import User from "./models/User.js";
import { sampleBooks, sampleIssueTemplates, sampleStudents, sampleUsers } from "./seeds/seedData.js";

dotenv.config();

const insertData = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@library.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin12345";

  await Promise.all([
    Issue.deleteMany(),
    Book.deleteMany(),
    Student.deleteMany(),
    User.deleteMany(),
    Admin.deleteMany(),
  ]);

  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  await Admin.create({
    email: adminEmail,
    password: hashedPassword,
    role: "admin",
  });

  const books = await Book.insertMany(sampleBooks);
  const students = await Student.insertMany(sampleStudents);
  await User.insertMany(
    await Promise.all(
      sampleUsers.map(async (user) => ({
        name: user.name,
        email: user.email.toLowerCase(),
        password: await bcrypt.hash(user.password, 12),
        role: "user",
      }))
    )
  );

  const booksByISBN = new Map(books.map((book) => [book.ISBN, book]));
  const studentsByEnrollment = new Map(
    students.map((student) => [student.enrollmentNumber, student])
  );

  const activeIssueCountByBookId = new Map();
  const issueDocuments = [];

  sampleIssueTemplates.forEach((template) => {
    const book = booksByISBN.get(template.bookISBN);
    const student = studentsByEnrollment.get(template.studentEnrollment);

    if (!book || !student) {
      return;
    }

    const issueDate = new Date();
    issueDate.setDate(issueDate.getDate() - template.issueDaysAgo);

    const isReturned = Number.isInteger(template.returnedDaysAfterIssue);
    const returnDate = isReturned
      ? new Date(issueDate.getTime() + template.returnedDaysAfterIssue * 24 * 60 * 60 * 1000)
      : null;

    issueDocuments.push({
      book: book._id,
      student: student._id,
      issueDate,
      returnDate,
      status: isReturned ? "returned" : "issued",
    });

    if (!isReturned) {
      const currentCount = activeIssueCountByBookId.get(book._id.toString()) || 0;
      activeIssueCountByBookId.set(book._id.toString(), currentCount + 1);
    }
  });

  await Issue.insertMany(issueDocuments);

  const stockUpdates = books.map((book) => {
    const activeIssues = activeIssueCountByBookId.get(book._id.toString()) || 0;
    const updatedQuantity = Math.max(book.quantity - activeIssues, 0);

    return Book.findByIdAndUpdate(book._id, {
      quantity: updatedQuantity,
      availability: updatedQuantity > 0,
    });
  });

  await Promise.all(stockUpdates);

  const issuedCount = issueDocuments.filter((item) => item.status === "issued").length;
  const returnedCount = issueDocuments.filter((item) => item.status === "returned").length;

  console.log(
    `Seed data inserted successfully: ${books.length} books, ${students.length} students, ${sampleUsers.length} users, ${issuedCount} issued, ${returnedCount} returned`
  );
};

const destroyData = async () => {
  await Promise.all([
    Issue.deleteMany(),
    Book.deleteMany(),
    Student.deleteMany(),
    User.deleteMany(),
    Admin.deleteMany(),
  ]);

  console.log("Seed data destroyed successfully");
};

const runSeeder = async () => {
  try {
    await connectDB();

    if (process.argv[2] === "-d") {
      await destroyData();
    } else {
      await insertData();
    }

    process.exit(0);
  } catch (error) {
    console.error("Seeder failed:", error.message);
    process.exit(1);
  }
};

runSeeder();
