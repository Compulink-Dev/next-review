import { NextResponse } from 'next/server'
import dbConnect from '@/lib/database'
import User from '@/lib/models/User'

export async function GET(
  req: Request
) {
  try {
    await dbConnect()

      // Extract the ID from the URL manually
      const url = new URL(req.url);
      const userId = url.pathname.split("/").pop(); // Get the last segment of the path
  

    // Validate ID
    if (!userId || userId.length !== 24) {
      return NextResponse.json(
        { message: 'Invalid user ID' },
        { status: 400 }
      )
    }

    // Fetch user with company details
    const user = await User.findById(userId)
      .populate('company', 'name email phone website')
      .select('-password') // Exclude sensitive data

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { message: 'Failed to fetch user details' },
      { status: 500 }
    )
  }
}