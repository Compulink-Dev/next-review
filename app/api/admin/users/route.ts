import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import UserModel from "@/lib/models/User";
import CompanyModel from "@/lib/models/Company";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";

export async function GET() {
  await dbConnect();
  const session = await getServerSession(options);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const employees = await UserModel.find().populate("company");
    return NextResponse.json(employees || [], { status: 200 });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  await dbConnect();
  const session = await getServerSession(options);

  if (!session || session.user.role !== "companyAdmin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, email, phone, address, password, companyId, status } =
      await req.json();

    if (!name || !email || !password || !companyId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = await UserModel.create({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      company: companyId,
      role: "employee",
      status,
    });

    await CompanyModel.findByIdAndUpdate(companyId, {
      $push: { employees: newEmployee._id },
    });

    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json(
      { error: "Failed to create employee" },
      { status: 500 }
    );
  }
}
