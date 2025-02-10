import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import dbConnect from "@/lib/database";
import UserModel from "@/lib/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, email, password } = await req.json();
    const hashedPassword = await hash(password, 10);

    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role: "client",
    });

    return NextResponse.json(
      { message: "Client registered", user },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
