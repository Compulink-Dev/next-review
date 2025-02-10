import dbConnect from "@/lib/database";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { options } from "../auth/[...nextauth]/options";
import { Employee } from "@/lib/models/Employee";
import { Review } from "@/lib/models/Review";

// Fetch company employees
export async function GET(req: Request) {
  await dbConnect();
  const session = await getServerSession(options);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { companyId } = await req.json();
  const employees = await Employee.find({ company: companyId });
  return NextResponse.json({ employees });
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
