import mongoose, { Schema, Document } from "mongoose";

interface IUseful extends Document {
  userId: string;
  reviewId: string;
  createdAt: Date;
}

const UsefulSchema = new Schema<IUseful>(
  {
    userId: { type: String, required: true },
    reviewId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Useful ||
  mongoose.model<IUseful>("Useful", UsefulSchema);
