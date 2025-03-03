import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import Notification from "@/lib/models/Notifications";

export async function GET() {
  try {
    await dbConnect();
    const notifications = await Notification.find().sort({ createdAt: -1 });

    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
