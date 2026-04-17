import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit')) || 0;
    
    // Auth Check
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;
    const user = token ? verifyToken(token) : null;

    let query = {};
    if (userId) query.user = userId;
    if (status) query.status = status;
    
    // If user is not admin, they can only see their own orders
    if (user && user.role !== 'admin' && userId && userId !== user.id) {
       return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    let orders = Order.find(query).sort({ createdAt: -1 });
    if (limit > 0) orders = orders.limit(limit);

    const data = await orders.populate('user', 'name email').populate('items.product', 'name slug media');

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Orders GET Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    // Generate random order number if not present
    if (!body.orderNumber) {
      body.orderNumber = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    // Initialize status history
    body.statusHistory = [{
      status: 'pending',
      timestamp: new Date(),
      note: 'Order placed'
    }];

    const order = await Order.create(body);
    
    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    console.error('Orders POST Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
  }
}
