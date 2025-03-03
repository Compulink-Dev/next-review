// models/User.ts
import mongoose, { Schema } from "mongoose";

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["client", "companyAdmin", "employee"],
      required: true,
    },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    phone: { type: String },
    address: { type: String },
    imageUrl: { type: String },
    status: { type: String, default: "inactive" },
  },
  { timestamps: true }
);
const UserModel = mongoose.models?.User || mongoose.model("User", UserSchema);

export default UserModel;
