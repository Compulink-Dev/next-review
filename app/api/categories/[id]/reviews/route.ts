// app/api/categories/[id]/reviews/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import Category from "@/lib/models/Category";

// POST: Add a review to a category
export async function POST(
  request: Request
) {

  const url = new URL(request.url);
  const employeeId = url.pathname.split("/").pop(); // Get

  try {
    await dbConnect();
    const { userId, rating, comment } = await request.json();

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const review = {
      user: userId,
      rating,
      comment,
    };

    const category = await Category.findByIdAndUpdate(
      employeeId,
      { $push: { reviews: review } },
      { new: true }
    );

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Review added", category },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    
    return NextResponse.json(
      { message: "Failed to add review" },
      { status: 500 }
    );
  }
}