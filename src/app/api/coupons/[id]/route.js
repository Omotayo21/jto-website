import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Coupon from '@/models/Coupon';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    await connectDB();
    
    const coupon = await Coupon.findByIdAndUpdate(id, data, { new: true });
    if (!coupon) return NextResponse.json({ success: false, error: 'Coupon not found' }, { status: 404 });

    return NextResponse.json({ success: true, data: coupon }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update coupon' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await connectDB();
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) return NextResponse.json({ success: false, error: 'Coupon not found' }, { status: 404 });
    
    return NextResponse.json({ success: true, message: 'Coupon deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete coupon' }, { status: 500 });
  }
}
