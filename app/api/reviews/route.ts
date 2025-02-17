import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import { Review } from "@/lib/models/Review";

// API route to create a new review
export async function POST(req: Request) {
  try {
    await dbConnect();

    const { employeeName, department, clientName, date, rating, description } =
      await req.json();

    // Validate input
    if (
      !employeeName ||
      !department ||
      !clientName ||
      !rating ||
      !description
    ) {
      return NextResponse.json(
        { message: "All fields except date are required." },
        { status: 400 }
      );
    }

    // Create and save the review
    const newReview = new Review({
      employeeName,
      department,
      clientName,
      date: date || new Date(),
      rating,
      description,
    });

    await newReview.save();

    return NextResponse.json(
      { message: "Review created successfully", review: newReview },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating review", error },
      { status: 500 }
    );
  }
}

// API route to get all reviews
export async function GET() {
  try {
    await dbConnect();
    const reviews = await Review.find();
    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching reviews", error },
      { status: 500 }
    );
  }
}
