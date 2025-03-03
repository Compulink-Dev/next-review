import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import { Review } from "@/lib/models/Review";

export async function GET(req: Request) {
  await dbConnect();

  // Extract the ID from the URL manually
  const url = new URL(req.url);
  const employeeId = url.pathname.split("/").pop(); // Get the last segment of the path

  if (!employeeId) {
    return NextResponse.json(
      { message: "Employee ID is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch all reviews for the given id
    const reviews = await Review.find({ employeeId: employeeId })
      .populate("clientId", "name email")
      .sort({ createdAt: -1 }); // Sort by latest reviews

    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error("Error fetching employee reviews:", error);
    return NextResponse.json(
      { message: "Failed to fetch reviews", error },
      { status: 500 }
    );
  }
}
