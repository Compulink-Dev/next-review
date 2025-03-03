import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import UserModel from "@/lib/models/User";
import bcrypt from "bcryptjs"; // Ensure passwords are hashed before storing
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import Company from "@/lib/models/Company";

export async function GET(req: Request) {
  await dbConnect();
  const session = await getServerSession(options);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const companyId =
    session.user.role === "admin"
      ? searchParams.get("companyId")
      : session.user.company;

  if (!companyId) {
    return NextResponse.json(
      { error: "Company ID is required" },
      { status: 400 }
    );
  }

  try {
    const employees = await UserModel.find({ company: companyId });
    return NextResponse.json(employees, { status: 200 });
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

    await Company.findByIdAndUpdate(companyId, {
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

export async function PUT(req: Request) {
  await dbConnect();
  const session = await getServerSession(options);

  if (!session || session.user.role !== "companyAdmin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, ...updates } = await req.json();
    const updatedEmployee = await UserModel.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedEmployee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedEmployee, { status: 200 });
  } catch (error) {
    console.error("Error updating employee:", error);
    return NextResponse.json(
      { error: "Failed to update employee" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  await dbConnect();
  const session = await getServerSession(options);

  if (!session || session.user.role !== "companyAdmin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    const deletedEmployee = await UserModel.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Employee deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return NextResponse.json(
      { error: "Failed to delete employee" },
      { status: 500 }
    );
  }
}
