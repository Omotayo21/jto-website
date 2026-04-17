import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Cart from '@/models/Cart';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

/**
 * GET current user's cart
 */
export async function GET() {
  try {
    await connectDB();
    const token = cookies().get('auth_token')?.value;
    const user = token ? verifyToken(token) : null;

    if (!user) {
      return NextResponse.json({ success: false, error: 'Login required' }, { status: 401 });
    }

    let cart = await Cart.findOne({ user: user.id });
    if (!cart) {
      cart = await Cart.create({ user: user.id, items: [] });
    }

    return NextResponse.json({ success: true, data: cart.items }, { status: 200 });
  } catch (error) {
    console.error('Cart GET Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch cart' }, { status: 500 });
  }
}

/**
 * POST update cart (Add/Update items)
 */
export async function POST(request) {
  try {
    await connectDB();
    const token = cookies().get('auth_token')?.value;
    const user = token ? verifyToken(token) : null;

    if (!user) {
      return NextResponse.json({ success: false, error: 'Login required' }, { status: 401 });
    }

    const { items } = await request.json();

    const cart = await Cart.findOneAndUpdate(
      { user: user.id },
      { items },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, data: cart.items }, { status: 200 });
  } catch (error) {
    console.error('Cart POST Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update cart' }, { status: 500 });
  }
}

/**
 * DELETE clear cart
 */
export async function DELETE() {
  try {
    await connectDB();
    const token = cookies().get('auth_token')?.value;
    const user = token ? verifyToken(token) : null;

    if (!user) {
      return NextResponse.json({ success: false, error: 'Login required' }, { status: 401 });
    }

    await Cart.findOneAndUpdate({ user: user.id }, { items: [] });

    return NextResponse.json({ success: true, message: 'Cart cleared' }, { status: 200 });
  } catch (error) {
    console.error('Cart DELETE Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to clear cart' }, { status: 500 });
  }
}
