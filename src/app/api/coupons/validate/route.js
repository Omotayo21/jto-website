import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Coupon from '@/models/Coupon';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { code, cartTotal } = await request.json();

    if (!code || !cartTotal) {
      return NextResponse.json({ success: false, error: 'Code and cart total are required' }, { status: 400 });
    }

    await connectDB();

    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(), 
      active: true 
    });

    if (!coupon) {
      return NextResponse.json({ success: false, error: 'Invalid or inactive coupon' }, { status: 400 });
    }

    const now = new Date();
    if (now < new Date(coupon.validFrom)) {
      return NextResponse.json({ success: false, error: 'Coupon is not yet active' }, { status: 400 });
    }
    if (now > new Date(coupon.validUntil)) {
      return NextResponse.json({ success: false, error: 'Coupon has expired' }, { status: 400 });
    }

    if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
      return NextResponse.json({ 
        success: false, 
        error: `Minimum order amount of ${coupon.minOrderAmount} required for this coupon` 
      }, { status: 400 });
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json({ success: false, error: 'Coupon usage limit reached' }, { status: 400 });
    }

    // Check if user has already used this coupon (optional, but per req "check per-user usage")
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;
    const userPayload = token ? verifyToken(token) : null;
    if (userPayload && coupon.usedBy.includes(userPayload.id)) {
      return NextResponse.json({ success: false, error: 'You have already used this coupon' }, { status: 400 });
    }

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = cartTotal * (coupon.value / 100);
    } else {
      discount = coupon.value;
    }

    return NextResponse.json({ 
      success: true, 
      data: { 
        discount: Math.min(discount, cartTotal), 
        code: coupon.code,
        type: coupon.type,
        value: coupon.value
      } 
    }, { status: 200 });
  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json({ success: false, error: 'Failed to validate coupon' }, { status: 500 });
  }
}
