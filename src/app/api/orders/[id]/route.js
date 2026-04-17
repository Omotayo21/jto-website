import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product'; // In case we need it for stock updates
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const order = await Order.findById(id)
      .populate('user', 'name email')
      .populate('items.product', 'name slug media');

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order }, { status: 200 });
  } catch (error) {
    console.error('Order GET Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const body = await request.json(); // { status, note }

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // Update status and add to history
    if (body.status && body.status !== order.status) {
      order.status = body.status;
      order.statusHistory.push({
        status: body.status,
        timestamp: new Date(),
        note: body.note || `Status updated to ${body.status}`
      });
      
      // Handle salesCount if order is delivered
      if (body.status === 'delivered') {
        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { salesCount: item.quantity }
          });
        }
      }
    }

    await order.save();

    return NextResponse.json({ success: true, data: order }, { status: 200 });
  } catch (error) {
    console.error('Order PUT Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update order' }, { status: 500 });
  }
}
