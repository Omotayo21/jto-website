import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import AbandonedCart from '@/models/AbandonedCart';
import Product from '@/models/Product';
import Coupon from '@/models/Coupon';
import Cart from '@/models/Cart';
import { sendEmail } from '@/lib/brevo';
import { formatCurrency } from '@/lib/utils';

export async function POST(request) {
  try {
    const bodyText = await request.text();
    const signature = request.headers.get('x-paystack-signature');
    const secret = process.env.PAYSTACK_SECRET_KEY;

    // 1. Verify Paystack Signature
    const hash = crypto.createHmac('sha512', secret).update(bodyText).digest('hex');
    if (hash !== signature) {
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(bodyText);
    if (event.event === 'charge.success') {
      await connectDB();
      const reference = event.data.reference;
      
      // Find order by payment reference
      const order = await Order.findOne({ 'payment.reference': reference });

      if (order && order.status === 'pending') {
        // Update Order Status
        order.status = 'processing';
        order.payment.status = 'success';
        order.payment.paidAt = new Date();
        order.statusHistory.push({
          status: 'processing',
          timestamp: new Date(),
          note: 'Payment confirmed via Paystack'
        });

        await order.save();

        // Increment Product Sales Count
        for (const item of order.items) {
           await Product.findByIdAndUpdate(item.product, { $inc: { salesCount: item.quantity } });
        }

        // Clear the Backend Cart for the user
        if (order.user) {
          await Cart.findOneAndUpdate(
            { user: order.user },
            { items: [] }
          );
        }

        // Update Coupon Usage count if used
        if (order.coupon && order.coupon.code) {
           await Coupon.findOneAndUpdate(
             { code: order.coupon.code.toUpperCase() },
             { $inc: { usageCount: 1 }, $push: { usedBy: order.user } }
           );
        }

        // Send confirmation email
        await sendEmail({
          to: order.userEmail,
          subject: `Order Confirmed — ${order.orderNumber}`,
          htmlContent: `
            <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 24px;">
              <h1 style="color: #4F46E5; font-size: 28px; font-weight: 900; margin-bottom: 24px;">Payment Received!</h1>
              <p style="font-size: 16px; color: #374151; line-height: 1.5;">Hello,</p>
              <p style="font-size: 16px; color: #374151; line-height: 1.5;">Your payment for order <strong>#${order.orderNumber}</strong> has been confirmed. We are now preparing your items for delivery.</p>
              
              <div style="margin: 32px 0; background: #f9fafb; padding: 24px; border-radius: 16px;">
                 <h3 style="font-size: 14px; font-weight: 900; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 16px;">Order Summary</h3>
                 <table style="width: 100%; border-collapse: collapse;">
                    ${order.items.map(item => `
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
                           <p style="margin: 0; font-weight: 700; color: #111827;">${item.productName}</p>
                           <p style="margin: 0; font-size: 12px; color: #6b7280;">${item.variant?.size || ''} ${item.variant?.color?.name || ''} x ${item.quantity}</p>
                        </td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: 700; color: #4F46E5;">
                           NGN ${(item.price * item.quantity).toLocaleString()}
                        </td>
                      </tr>
                    `).join('')}
                    <tr>
                      <td style="padding: 16px 0 8px; color: #6b7280; font-size: 14px;">Subtotal</td>
                      <td style="padding: 16px 0 8px; text-align: right; font-weight: 700; color: #111827;">NGN ${order.subtotal.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 0; color: #6b7280; font-size: 14px;">Shipping (${order.delivery?.zone || 'Standard'})</td>
                      <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #111827;">NGN ${(order.delivery?.fee || 0).toLocaleString()}</td>
                    </tr>
                    ${order.discount > 0 ? `
                      <tr>
                        <td style="padding: 4px 0; color: #10b981; font-size: 14px;">Discount Applied</td>
                        <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #10b981;">-NGN ${order.discount.toLocaleString()}</td>
                      </tr>
                    ` : ''}
                    <tr>
                      <td style="padding: 24px 0 0; font-weight: 900; color: #111827; font-size: 18px;">Total</td>
                      <td style="padding: 24px 0 0; text-align: right; font-weight: 900; color: #4F46E5; font-size: 20px;">NGN ${order.total.toLocaleString()}</td>
                    </tr>
                 </table>
              </div>

              <div style="margin-bottom: 32px;">
                 <h3 style="font-size: 14px; font-weight: 900; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;">Shipping Address</h3>
                 <p style="margin: 0; font-size: 14px; color: #374151; line-height: 1.6;">
                    ${order.delivery.fullName}<br/>
                    ${order.delivery.address}<br/>
                    ${order.delivery.city}, ${order.delivery.state}<br/>
                    ${order.delivery.phone}
                 </p>
              </div>

              <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
              <p style="color: #9ca3af; font-size: 12px; text-align: center; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em;">Premium Shopping Experience</p>
            </div>
          `
        });
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ success: false, error: 'Webhook processing failed' }, { status: 500 });
  }
}
