import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AbandonedCart from '@/models/AbandonedCart';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json(); // { items, totalValue }
    
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;
    const userPayload = token ? verifyToken(token) : null;

    if (!userPayload) {
      return NextResponse.json({ success: false, error: 'User must be logged in to track abandoned cart' }, { status: 401 });
    }

    const { items, totalValue } = body;

    // Update or create abandoned cart for this user
    const abandonedCart = await AbandonedCart.findOneAndUpdate(
      { user: userPayload.id, converted: false },
      {
        user: userPayload.id,
        userEmail: userPayload.email,
        items,
        totalValue,
        lastUpdated: new Date()
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, data: abandonedCart }, { status: 200 });
  } catch (error) {
    console.error('Abandoned Cart POST Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to save abandoned cart' }, { status: 500 });
  }
}
