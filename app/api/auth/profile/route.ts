import UserModel from "@/lib/models/UserModel";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { options } from "../[...nextauth]/options";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";

export async function PUT(req: Request) {
  const session = await getServerSession(options);

  if (!session || !session.user?.role) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { name, email, password } = await req.json();
  await dbConnect();
  try {
    const dbUser = await UserModel.findById(session.user.id);
    if (!dbUser) {
      return Response.json(
        { message: "User not found" },
        {
          status: 404,
        }
      );
    }
    dbUser.name = name;
    dbUser.email = email;
    dbUser.password = password
      ? await bcrypt.hash(password, 5)
      : dbUser.password;
    await dbUser.save();
    return Response.json({ message: "User has been updated" });
  } catch (err: any) {
    return Response.json(
      { message: err.message },
      {
        status: 500,
      }
    );
  }
}
