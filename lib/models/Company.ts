import mongoose from "mongoose";

// Company Model
const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Company =
  mongoose.models.Company || mongoose.model("Company", CompanySchema);

export default Company;
