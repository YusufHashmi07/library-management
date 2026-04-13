import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", default: null },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    issueDate: { type: Date, default: Date.now },
    returnDate: { type: Date, default: null },
    status: { type: String, enum: ["issued", "returned"], default: "issued" },
  },
  { timestamps: true }
);

const Issue = mongoose.model("Issue", issueSchema);

export default Issue;
