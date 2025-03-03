import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import Company from "@/lib/models/Company";
import { Review } from "@/lib/models/Review";
import UserModel from "@/lib/models/User";

export async function GET() {
  await dbConnect();

  const reviews = await Review.countDocuments();
  const companies = await Company.countDocuments();
  const users = await UserModel.countDocuments();

  const reviewChartData = await Review.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const userChartData = await UserModel.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return NextResponse.json({
    reviews,
    companies,
    users,
    reviewChartData: reviewChartData.map((d) => ({
      date: d._id,
      count: d.count,
    })),
    userChartData: userChartData.map((d) => ({ date: d._id, count: d.count })),
  });
}
