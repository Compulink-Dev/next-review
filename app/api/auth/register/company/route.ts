import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import dbConnect from "@/lib/database";
import UserModel from "@/lib/models/User";
import Company from "@/lib/models/Company";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, email, password } = await req.json();

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
    });

    const company = await Company.create({ name, admin: user._id });
    user.company = company._id;
    await user.save();

    return NextResponse.json(
      { message: "Company registered", user, company },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
