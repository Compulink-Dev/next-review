import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  department: { type: String, required: true },
  date: { type: Date, default: Date.now },
  rating: { type: Number, required: true, min: 1, max: 5 },
  description: { type: String, required: true },
  valid: { type: Boolean, default: false }, // New field with default value
});

export const Review =
  mongoose.models.Review || mongoose.model("Review", ReviewSchema);
