import dbConnect from "@/lib/database";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { options } from "../auth/[...nextauth]/options";
import { Review } from "@/lib/models/Review";
import UserModel from "@/lib/models/User";

// Fetch employees (all if admin, company-specific otherwise)
export async function GET(req: Request) {
  await dbConnect();
  const session = await getServerSession(options);

  console.log("Session data:", session); // Debugging

  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (session.user.role === "admin") {
    console.log("Fetching all employees for admin...");

    const employees = await UserModel.find({});

    console.log("Employees found:", employees); // Debugging

    if (employees.length === 0) {
      return NextResponse.json(
        { message: "No employees found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ employees });
  } else {
    const { companyId } = await req.json();

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    console.log(`Fetching employees for company ID: ${companyId}`);
    const employees = await UserModel.find({ company: companyId });

    return NextResponse.json({ employees });
  }
}

// Submit a new employee review
export async function POST(req: Request) {
  await dbConnect();
  const session = await getServerSession(options);

  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { employeeId, rating, feedback } = await req.json();

  const review = await Review.create({
    employee: employeeId,
    rating,
    feedback,
  });

  return NextResponse.json({ review });
}
