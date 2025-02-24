import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/database";
import { options } from "../auth/[...nextauth]/options";
import { Review } from "@/lib/models/Review";

export async function POST(req: Request) {
  await dbConnect();
  const session = await getServerSession(options);

  if (!session?.user || session.user.role !== "client") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { employeeId, department, date, rating, description } =
      await req.json();
    if (!employeeId)
      return NextResponse.json(
        { error: "Employee ID is required" },
        { status: 400 }
      );

    const review = await Review.create({
      employeeId,
      clientId: session.user.id,
      department,
      date,
      rating,
      description,
      valid: false, // Ensure valid starts as false
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}

// API route to get all reviews
export async function GET() {
  await dbConnect();
  const session = await getServerSession(options);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let reviews;

    if (session.user.role === "companyAdmin") {
      // Fetch all reviews for employees under the company
      reviews = await Review.find()
        .populate({
          path: "employeeId",
          match: { company: session.user.company }, // Filter employees by company
          select: "name email role company",
        })
        .populate("clientId", "name email")
        .lean();

      // Remove reviews where employeeId is null (i.e., not in the company)
      reviews = reviews.filter((review) => review.employeeId !== null);
    } else if (session.user.role === "client") {
      // Fetch reviews only created by this client
      reviews = await Review.find({ clientId: session.user.id })
        .populate("employeeId", "_id name email role")
        .populate("clientId", "_id name email")
        .lean();
    } else if (session.user.role === "employee") {
      // Fetch only valid reviews for this employee
      reviews = await Review.find({ employeeId: session.user.id, valid: true })
        .populate("employeeId", "_id name email role")
        .populate("clientId", "_id name email")
        .lean();
    } else {
      return NextResponse.json({ error: "Invalid role" }, { status: 403 });
    }

    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { message: "Error fetching reviews", error },
      { status: 500 }
    );
  }
}
