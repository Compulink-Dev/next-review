import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import { Review } from "@/lib/models/Review";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";

export async function GET(req: Request) {
  try {
    await dbConnect();

    // Extract the ID from the URL manually
    const url = new URL(req.url);
    const reviewId = url.pathname.split("/").pop(); // Get the last segment of the path

    console.log("Extracted review ID:", reviewId);

    if (!reviewId) {
      return NextResponse.json(
        { message: "Review ID is required" },
        { status: 400 }
      );
    }

    // Fetch review and populate employee and client details
    const review = await Review.findById(reviewId)
      .populate("employeeId", "name email role")
      .populate("clientId", "name email role");

    if (!review) {
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 }
      );
    }

    // Format the response to match frontend expectations
    return NextResponse.json(
      {
        _id: review._id,
        clientName: review.clientId?.name,
        employeeId: review.employeeId, // ✅ Send the full employeeId object
        date: review.date,
        department: review.department,
        rating: review.rating,
        description: review.description,
        valid: review.valid,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching review details:", error);
    return NextResponse.json(
      { message: "Failed to fetch review details", error },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  await dbConnect();

  // Extract the ID from the URL manually
  const url = new URL(req.url);
  const reviewId = url.pathname.split("/").pop(); // Get the last segment of the path

  const session = await getServerSession(options);

  if (!session?.user || session.user.role !== "companyAdmin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { valid: true },
      { new: true }
    );

    if (!updatedReview) {
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Review validated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to validate review" },
      { status: 500 }
    );
  }
}
