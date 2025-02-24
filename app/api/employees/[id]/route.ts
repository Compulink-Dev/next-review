//@ts-nocheck
import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import UserModel from "@/lib/models/User";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";

export async function GET(req: Request) {
  await dbConnect();

  // Extract the ID from the URL manually
  const url = new URL(req.url);
  const employeeId = url.pathname.split("/").pop(); // Get the last segment of the path

  const session = await getServerSession(options);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (employeeId) {
    // Fetch single employee by ID
    try {
      const employee = await UserModel.findById(employeeId);
      if (!employee) {
        return NextResponse.json(
          { error: "Employee not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ employee }, { status: 200 });
    } catch (error) {
      console.log(error);

      return NextResponse.json(
        { error: "Failed to fetch employee" },
        { status: 500 }
      );
    }
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
    return NextResponse.json(employees);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  await dbConnect();

  // Extract the ID from the URL manually
  const url = new URL(req.url);
  const employeeId = url.pathname.split("/").pop(); // Get the last segment of the path

  const session = await getServerSession(options);

  if (!session || session.user.role !== "companyAdmin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updates = await req.json();
    const updatedEmployee = await UserModel.findByIdAndUpdate(
      employeeId,
      updates,
      { new: true }
    );

    if (!updatedEmployee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedEmployee, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to update employee" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  await dbConnect();

  // Extract the ID from the URL manually
  const url = new URL(req.url);
  const employeeId = url.pathname.split("/").pop(); // Get the last segment of the path
  const session = await getServerSession(options);

  if (!session || session.user.role !== "companyAdmin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const deletedEmployee = await UserModel.findByIdAndDelete(employeeId);

    if (!deletedEmployee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Employee deleted" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to delete employee" },
      { status: 500 }
    );
  }
}
