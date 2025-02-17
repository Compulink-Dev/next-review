// API Route: /api/auth/register
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import dbConnect from "@/lib/database";
import UserModel from "@/lib/models/User";
import Company from "@/lib/models/Company";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const {
      name,
      email,
      password,
      role,
      company,
      phone,
      address,
      imageUrl,
      status,
    } = await req.json();

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);

    let newUser;
    if (role === "companyAdmin") {
      // Register a company admin and create the company
      const newCompany = await Company.create({ name: company });
      newUser = await UserModel.create({
        name,
        email,
        password: hashedPassword,
        role,
        company: newCompany._id,
        phone,
        address,
        imageUrl,
        status: status || "inactive",
      });
      newCompany.admin = newUser._id;
      await newCompany.save();
    } else if (role === "employee") {
      // Ensure company exists before registering employee
      const existingCompany = await Company.findById(company);
      if (!existingCompany) {
        return NextResponse.json(
          { message: "Company not found" },
          { status: 400 }
        );
      }
      newUser = await UserModel.create({
        name,
        email,
        password: hashedPassword,
        role,
        company: existingCompany._id,
        phone,
        address,
        imageUrl,
        status: status || "inactive",
      });
      existingCompany.employees.push(newUser._id);
      await existingCompany.save();
    } else {
      // Register clients without a company
      newUser = await UserModel.create({
        name,
        email,
        password: hashedPassword,
        role,
        phone,
        address,
        imageUrl,
        status: status || "inactive",
      });
    }

    return NextResponse.json(
      { message: "User registered successfully", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
