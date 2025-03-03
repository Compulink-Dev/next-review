import { Schema, model, models } from "mongoose";

const NotificationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["review", "employee", "company"],
      required: true,
    },
    message: { type: String, required: true },
    relatedId: { type: Schema.Types.ObjectId, required: true, refPath: "type" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Notification =
  models.Notification || model("Notification", NotificationSchema);

export default Notification;
