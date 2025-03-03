import mongoose, { Schema, Document } from "mongoose";

interface IRead extends Document {
  userId: string;
  postId: string;
  createdAt: Date;
}

const ReadSchema = new Schema<IRead>(
  {
    userId: { type: String, required: true },
    postId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Read ||
  mongoose.model<IRead>("Read", ReadSchema);
