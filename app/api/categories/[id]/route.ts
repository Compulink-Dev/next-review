// app/api/categories/[id]/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import Category from "@/lib/models/Category";

// GET: Fetch single category by ID
export async function GET(
  request: Request
) {

  // Extract the ID from the URL manually
  const url = new URL(request.url);
  const categoryId = url.pathname.split("/").pop();

  try {
    await dbConnect();
    const category = await Category.findById(categoryId).populate("companies");
    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.log(error);
    
    return NextResponse.json(
      { message: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

// PUT: Update a category
export async function PUT(
  request: Request
) {

    // Extract the ID from the URL manually
    const url = new URL(request.url);
    const categoryId = url.pathname.split("/").pop();

  try {
    await dbConnect();
    const { name, description, imageUrl } = await request.json();

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name, description, imageUrl },
      { new: true }
    );

    if (!updatedCategory) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Category updated", category: updatedCategory },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a category
export async function DELETE(
  request: Request
) {

    // Extract the ID from the URL manually
    const url = new URL(request.url);
    const categoryId = url.pathname.split("/").pop();

  try {
    await dbConnect();
    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Category deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to delete category" },
      { status: 500 }
    );
  }
}