import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import Company from "@/lib/models/Company";
import UserModel from "@/lib/models/User";

export async function GET(req: Request) {
  try {
    await dbConnect();

    // Extract the ID from the URL manually
    const url = new URL(req.url);
    const companyId = url.pathname.split("/").pop(); // Get the last segment of the path

    console.log("Extracted company ID:", companyId);

    if (!companyId) {
      return NextResponse.json(
        { message: "Company ID is required" },
        { status: 400 }
      );
    }

    // Fetch company details
    const company = await Company.findById(companyId);
    if (!company) {
      return NextResponse.json(
        { message: "Company not found" },
        { status: 404 }
      );
    }

    // Fetch employees associated with the company
    const employees = await UserModel.find({ company: companyId });

    return NextResponse.json({ company, employees }, { status: 200 });
  } catch (error) {
    console.error("Error fetching company details:", error);
    return NextResponse.json(
      { message: "Failed to fetch company details", error },
      { status: 500 }
    );
  }
}
