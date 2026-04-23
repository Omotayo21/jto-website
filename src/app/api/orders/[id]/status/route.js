import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { sendEmail } from '@/lib/brevo';
import { NextResponse } from 'next/server';

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
        subject: `Your order #${order.orderNumber} is on the way!`,
        htmlContent: `
          <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 24px;">
            <div style="text-align: center; margin-bottom: 32px;">
               <div style="width: 24px; height: 24px; background: #EEF2FF; border-radius: 100%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                  <span style="font-size: 20px;">🚚</span>
               </div>
               <h1 style="color: #111827; font-size: 28px; font-weight: 900; margin: 0; letter-spacing: -0.02em;">It's on the way!</h1>
               <p style="color: #6B7280; font-size: 16px; margin-top: 8px;">Your order #${order.orderNumber} has been shipped.</p>
            </div>

            <div style="background: #F9FAF9; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
               <h3 style="font-size: 12px; font-weight: 900; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 16px 0;">Delivery Details</h3>
               <p style="color: #374151; font-size: 14px; margin: 0; line-height: 1.6;">
                  ${order.delivery?.fullName}<br/>
                  ${order.delivery?.address}<br/>
                  ${order.delivery?.city}, ${order.delivery?.state}<br/>
                  <strong>Note:</strong> ${note || 'Items are currently in transit.'}
               </p>
            </div>

            <div style="margin-bottom: 32px;">
               <h3 style="font-size: 12px; font-weight: 900; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 16px 0;">Items in shipment</h3>
               ${order.items.map(item => `
                  <div style="display: flex; align-items: center; gap: 16px; padding: 12px 0; border-bottom: 1px solid #F3F4F6;">
                     <img src="${item.image || ''}" width="48" height="48" style="border-radius: 8px; object-cover: cover; background: #f0f0f0;" />
                     <div style="flex: 1;">
                        <p style="margin: 0; font-size: 14px; font-weight: 700; color: #111827;">${item.productName}</p>
                        <p style="margin: 0; font-size: 12px; color: #6B7280;">${item.variant?.size || ''} ${item.variant?.color?.name || ''} x ${item.quantity}</p>
                     </div>
                  </div>
               `).join('')}
            </div>

            <p style="color: #9CA3AF; font-size: 11px; text-align: center; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; margin-top: 40px;">JTOtheLabel Premium Delivery</p>
          </div>
        `
      });
    } else if (status === 'delivered') {
      await sendEmail({
        to: order.delivery?.email || order.userEmail,
        subject: `Your order #${order.orderNumber} has been delivered!`,
        htmlContent: `
          <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 24px; text-align: center;">
            <div style="width: 20px; height: 20px; background: #ECFDF5; border-radius: 100%; display: inline-flex; align-items: center; justify-content: center; margin: 0 auto 24px auto;">
               <span style="font-size: 20px;">🎉</span>
            </div>
            <h1 style="color: #111827; font-size: 32px; font-weight: 900; margin: 0; letter-spacing: -0.02em;">Delivered!</h1>
            <p style="color: #6B7280; font-size: 18px; margin-top: 12px;">Your package has arrived. We hope you love your new items!</p>
            
            <div style="margin: 40px 0; padding: 32px; border: 2px dashed #E5E7EB; border-radius: 24px;">
               <p style="color: #374151; font-weight: 700; margin-bottom: 8px;">How was your experience?</p>
               <p style="color: #9CA3AF; font-size: 14px; margin-bottom: 24px;">Your feedback helps us improve.</p>
               <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/orders/${order._id}" style="background: #4F46E5; color: white; text-decoration: none; padding: 16px 32px; rounded: 12px; font-weight: 900; text-transform: uppercase; font-size: 12px; letter-spacing: 0.1em; border-radius: 12px; display: inline-block;">Leave a Review</a>
            </div>

            <p style="color: #9CA3AF; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em;">Thank you for shopping with us!</p>
          </div>
        `
      });
    }
    
    return NextResponse.json({ success: true, message: 'Status updated' }, { status: 200 });
  } catch (error) {
    console.error('Order status patch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update order status' }, { status: 500 });
  }
}
