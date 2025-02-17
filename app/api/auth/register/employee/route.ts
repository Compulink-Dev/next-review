import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import dbConnect from "@/lib/database";
import User from "@/lib/models/User";
import Company from "@/lib/models/Company";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { companyId, name, email, password, phone, address, imageUrl } =
      await req.json();

    // Validate input
    if (!companyId || !name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if the employee already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Employee already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create employee
    const employee = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "employee",
      company: companyId,
      phone,
      address,
      imageUrl,
    });

    // Add employee to company's employee list
    await Company.findByIdAndUpdate(companyId, {
      $push: { employees: employee._id },
    });

    return NextResponse.json(
      { message: "Employee added successfully", employee },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering employee:", error);
    return NextResponse.json(
      { message: "Error registering employee" },
      { status: 500 }
    );
  }
}
