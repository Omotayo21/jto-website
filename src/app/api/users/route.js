import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const users = await User.find().sort({ createdAt: -1 });
    // Map to the format expected by the frontend
    const formattedUsers = users.map(user => ({
      uid: user._id,
      email: user.email,
      displayName: user.name,
      role: user.role,
      status: user.status,
      creationTime: user.createdAt
    }));

    return NextResponse.json({ success: true, data: formattedUsers }, { status: 200 });
  } catch (error) {
    console.error('Users GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch users' }, { status: 500 });
  }
}
