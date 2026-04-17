import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ status: 'unknown' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(id).select('status');

    if (!user) {
      return NextResponse.json({ status: 'not_found' }, { status: 404 });
    }

    return NextResponse.json({ status: user.status }, { status: 200 });
  } catch (error) {
    console.error('Status Check Error:', error);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
