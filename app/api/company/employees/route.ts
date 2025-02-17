import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/database";
import UserModel from "@/lib/models/User";
import Company from "@/lib/models/Company";
import { options } from "../../auth/[...nextauth]/options";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(options);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const companyId = url.searchParams.get("companyId");

    let employees;

    if (session.user.role === "admin") {
      // Admin sees all employees
      employees = await UserModel.find({ role: "employee" });
    } else {
      // Normal users see only employees in their company
      if (!companyId) {
        return NextResponse.json(
          { message: "Company ID is required" },
          { status: 400 }
        );
      }

      employees = await UserModel.find({
        company: companyId,
        role: "employee",
      });
    }

    return NextResponse.json(employees, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching employees", error },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { companyId, name, email, password, phone, address, imageUrl } =
      await req.json();
    const hashedPassword = await hash(password, 10);

    const employee = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role: "employee",
      company: companyId,
      phone,
      address,
      imageUrl,
    });

    await Company.findByIdAndUpdate(companyId, {
      $push: { employees: employee._id },
    });

    return NextResponse.json(
      { message: "Employee added", employee },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error adding employee", error },
      { status: 500 }
    );
  }
}
