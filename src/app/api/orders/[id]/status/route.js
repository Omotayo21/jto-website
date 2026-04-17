import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { sendEmail } from '@/lib/brevo';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const { status, note } = await request.json();
    
    await connectDB();
    const order = await Order.findById(id);
    
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    order.status = status;
    order.statusHistory.push({ status, note, timestamp: new Date() });
    await order.save();

    if (status === 'shipped') {
      await sendEmail({
        to: order.delivery?.email || order.userEmail,
        subject: `Order Shipped — ${order.orderNumber}`,
        htmlContent: `<p>Your order has been shipped!</p><p>Expected delivery info: ${note}</p>`
      });
    } else if (status === 'delivered') {
      await sendEmail({
        to: order.delivery?.email || order.userEmail,
        subject: `Order Delivered — ${order.orderNumber}`,
        htmlContent: `<p>Your order has been delivered! Please consider leaving a review.</p>`
      });
    }
    
    return NextResponse.json({ success: true, message: 'Status updated' }, { status: 200 });
  } catch (error) {
    console.error('Order status patch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update order status' }, { status: 500 });
  }
}
