import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import Company from "@/lib/models/Company";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const company = await Company.find();

    return NextResponse.json(company, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching company", error },
      { status: 500 }
    );
  }
}
