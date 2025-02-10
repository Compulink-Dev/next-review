import mongoose from "mongoose";

// Review Model
const ReviewSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  rating: { type: Number, required: true, min: 1, max: 5 },
  feedback: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
export const Review =
  mongoose.models.Review || mongoose.model("Review", ReviewSchema);
