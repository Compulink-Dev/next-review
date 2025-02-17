import mongoose from "mongoose";

// Review Model
const ReviewSchema = new mongoose.Schema({
  employeeName: { type: String, required: true },
  department: { type: String, required: true },
  clientName: { type: String, required: true },
  date: { type: Date, default: Date.now },
  rating: { type: Number, required: true, min: 1, max: 5 },
  description: { type: String, required: true },
});

export const Review =
  mongoose.models.Review || mongoose.model("Review", ReviewSchema);
