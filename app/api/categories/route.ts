// app/api/categories/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import Category from "@/lib/models/Category";

// GET: Fetch all categories
export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find().populate("companies");
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST: Create a new category
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, description, imageUrl } = await req.json();

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return NextResponse.json(
        { message: "Category already exists" },
        { status: 400 }
      );
    }

    const category = await Category.create({
      name,
      description,
      imageUrl,
    });

    return NextResponse.json(
      { message: "Category created", category },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to create category" },
      { status: 500 }
    );
  }
}