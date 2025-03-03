import { NextResponse } from "next/server";
import { Types } from "mongoose";
import dbConnect from "@/lib/database";
import UserModel from "@/lib/models/User";

export async function GET(req: Request) {
  await dbConnect();

  // Extract the ID from the URL manually
  const url = new URL(req.url);
  const workerId = url.pathname.split("/").pop(); // Get the last segment of the path

  // Validate if 'id' is provided and is a valid MongoDB ObjectId
  if (!workerId || !Types.ObjectId.isValid(workerId)) {
    return NextResponse.json({ error: "Invalid employee ID" }, { status: 400 });
  }

  try {
    const employee = await UserModel.findById(workerId);
    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(employee, { status: 200 });
  } catch (error) {
    console.error("Error fetching employee:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
