import mongoose from "mongoose";

// Employee Model
const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
});
export const Employee =
  mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);
