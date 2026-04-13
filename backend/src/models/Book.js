import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    ISBN: { type: String, required: true, unique: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    availability: { type: Boolean, default: true },
  },
  { timestamps: true }
);

bookSchema.pre("save", function saveAvailability(next) {
  this.availability = this.quantity > 0;
  next();
});

const Book = mongoose.model("Book", bookSchema);

export default Book;
