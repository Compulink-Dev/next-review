import mongoose from "mongoose";

// Company Model
const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  email: { type: String, required: true },
  website: { type: String, required: true },
  phone: { type: String, required: true },
  imageUrl: { type: String, required: true },
  service: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  address: { type: String, required: true },
  description: { type: String, required: true },
});

const Company =
  mongoose.models.Company || mongoose.model("Company", CompanySchema);

export default Company;
