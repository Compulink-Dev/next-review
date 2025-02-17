import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import dbConnect from "@/lib/database";
import UserModel from "@/lib/models/User";
import Company from "@/lib/models/Company";

// POST: Create a new company
export async function POST(req: Request) {
  try {
    await dbConnect();
    const {
      name,
      email,
      password,
      website,
      phone,
      address,
      category,
      description,
      imageUrl,
      service,
    } = await req.json();

    const existingUser = await UserModel.findOne({ email });
    if (existingUser)
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );

    const hashedPassword = await hash(password, 10);
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role: "companyAdmin",
      phone,
      address,
      imageUrl,
    });

    const company = await Company.create({
      name,
      email,
      website,
      phone,
      imageUrl,
      service,
      category,
      address,
      description,
      admin: user._id,
    });

    console.log("Company : ", company);

    user.company = company._id;
    await user.save();

    return NextResponse.json(
      { message: "Company registered", user, company },
      { status: 201 }
    );
  } catch (error) {
    console.log("Server error while creating company:", error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

// GET: Fetch all companies
export async function GET() {
  try {
    await dbConnect();
    const companies = await Company.find();
    return NextResponse.json(companies, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
