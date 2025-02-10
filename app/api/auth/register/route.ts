import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/database";
import UserModel from "@/lib/models/User";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Received data:", body); // Debugging log

    const { name, email, password, role, company } = body;

    if (!name || !email || !password || !role || !company) {
      console.error("Missing required fields");
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    await dbConnect(); // Ensure DB connection

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      console.error("User already exists:", email);
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      role,
      company,
    });

    await newUser.save();

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      {
        message: "Error creating user",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}
