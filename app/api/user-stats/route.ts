import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import dbConnect from "@/lib/database";
import { options } from "../auth/[...nextauth]/options";
import { Review } from "@/lib/models/Review";
import Read from "@/lib/models/Read";
import Useful from "@/lib/models/Useful";

export async function GET() {
  try {
    await dbConnect();

    // Get logged-in user
    const session = await getServerSession(options);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch counts
    const reviewsCount = await Review.countDocuments({ userId });
    const readsCount = await Read.countDocuments({ userId });
    const usefulCount = await Useful.countDocuments({ userId });

    return NextResponse.json({
      reviews: reviewsCount,
      reads: readsCount,
      useful: usefulCount,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
