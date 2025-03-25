// app/api/users/route.ts
import { NextResponse } from 'next/server'
import dbConnect from '@/lib/database'
import User from '@/lib/models/User'

export async function GET(request: Request) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')

    const query = role ? { role } : {}
    const users = await User.find(query).populate('company', 'name')

    return NextResponse.json(users)
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Error fetching users' },
      { status: 500 }
    )
  }
}