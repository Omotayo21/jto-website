import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;
    const userPayload = token ? verifyToken(token) : null;

    if (!userPayload) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findById(userPayload.id).populate({
      path: 'favourites',
      populate: { path: 'category', select: 'name' }
    });

    return NextResponse.json({ success: true, data: user.favourites }, { status: 200 });
  } catch (error) {
    console.error('Favourites GET Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch favourites' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const { productId } = await request.json();
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;
    const userPayload = token ? verifyToken(token) : null;

    if (!userPayload) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findById(userPayload.id);
    const index = user.favourites.indexOf(productId);

    if (index > -1) {
      user.favourites.splice(index, 1); // Remove if exists
    } else {
      user.favourites.push(productId); // Add if not present
    }

    await user.save();

    return NextResponse.json({ success: true, data: user.favourites }, { status: 200 });
  } catch (error) {
    console.error('Favourites POST Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update favourites' }, { status: 500 });
  }
}
