import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import dbConnect from "@/lib/database";
import UserModel from "@/lib/models/User";
import Company from "@/lib/models/Company";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { companyId, name, email, password } = await req.json();
    const hashedPassword = await hash(password, 10);

    const employee = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role: "employee",
      company: companyId,
    });
    await Company.findByIdAndUpdate(companyId, {
      $push: { employees: employee._id },
    });

    return NextResponse.json(
      { message: "Employee added", employee },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
