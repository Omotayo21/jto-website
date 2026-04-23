import Order from '@/models/Order';
import Product from '@/models/Product';
import Cart from '@/models/Cart';
import Coupon from '@/models/Coupon';
import AbandonedCart from '@/models/AbandonedCart';
import { sendEmail } from '@/lib/brevo';

const ADMIN_EMAIL = process.env.BREVO_SENDER_EMAIL; // Admin email for notifications

/**
 * Processes a successful payment for an order.
 * This can be called from both the callback and the webhook.
 */
export async function processOrderSuccess(orderIdOrNumber) {
  // Find the order
  const order = await Order.findOne({
    $or: [
      { _id: orderIdOrNumber.match(/^[0-9a-fA-F]{24}$/) ? orderIdOrNumber : null },
      { orderNumber: orderIdOrNumber }
    ]
  });

  if (!order || order.status !== 'pending') {
    return { success: false, message: 'Order not found or already processed' };
  }

  // 1. Update Order Status
  order.status = 'processing';
  order.payment.status = 'success';
  order.payment.paidAt = new Date();
  order.statusHistory.push({
    status: 'processing',
    timestamp: new Date(),
    note: 'Payment confirmed and processed'
  });

  await order.save();

  // 2. Mark Abandoned Cart as converted
  try {
    await AbandonedCart.findOneAndUpdate(
      { userEmail: order.userEmail, converted: false },
      { converted: true },
      { sort: { createdAt: -1 } }
    );
  } catch (e) {
    console.error('Abandoned cart conversion update failed:', e);
  }

  // 3. Deduct Stock & Increment Sales Count
  for (const item of order.items) {
    const product = await Product.findById(item.product);
    if (product && product.inventory) {
      const variantKey = item.variant?.color?.name 
        ? `${item.variant.size}-${item.variant.color.name}`
        : `${item.variant.size}`;

      if (product.inventory.has(variantKey)) {
        product.inventory.set(variantKey, Math.max(0, product.inventory.get(variantKey) - item.quantity));
      } else if (product.inventory.has('total')) {
        product.inventory.set('total', Math.max(0, product.inventory.get('total') - item.quantity));
      }
      
      product.salesCount += item.quantity;
      await product.save();
    }
  }

  // 4. Clear the Backend Cart for the user
  if (order.user) {
    await Cart.findOneAndUpdate(
      { user: order.user },
      { items: [] }
    );
  }

  // 5. Update Coupon Usage count
  if (order.coupon && order.coupon.code) {
    await Coupon.findOneAndUpdate(
      { code: order.coupon.code.toUpperCase() },
      { $inc: { usageCount: 1 }, $push: { usedBy: order.user } }
    );
  }

  // 6. Send emails (Customer & Admin)
  try {
    // Customer Email
    await sendEmail({
      to: order.userEmail,
      subject: `Order Confirmed — ${order.orderNumber}`,
      htmlContent: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 24px;">
          <h1 style="color: #4F46E5; font-size: 28px; font-weight: 900; margin-bottom: 24px;">Payment Received!</h1>
          <p style="font-size: 16px; color: #374151; line-height: 1.5;">Your payment for order <strong>#${order.orderNumber}</strong> has been confirmed. We are now preparing your items for delivery.</p>
          <div style="margin: 32px 0; background: #f9fafb; padding: 24px; border-radius: 16px;">
             <table style="width: 100%; border-collapse: collapse;">
                ${order.items.map(item => `
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #eee; width: 64px;">
                       <img src="${item.image || ''}" width="48" height="48" style="border-radius: 8px; object-fit: cover; background: #f0f0f0; display: block;" />
                    </td>
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
                  <td colspan="2" style="padding: 16px 0 8px; color: #6b7280; font-size: 14px;">Total Paid</td>
                  <td style="padding: 16px 0 8px; text-align: right; font-weight: 900; color: #4F46E5; font-size: 20px;">NGN ${order.total.toLocaleString()}</td>
                </tr>
             </table>
          </div>
          <p style="color: #9ca3af; font-size: 12px; text-align: center; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em;">JTOtheLabel Premium Experience</p>
        </div>
      `
    });

    // Admin Notification Email
    if (ADMIN_EMAIL) {
      await sendEmail({
        to: ADMIN_EMAIL,
        subject: `🚨 New Order Received: #${order.orderNumber}`,
        htmlContent: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2 style="color: #4F46E5;">New Sale Alert!</h2>
            <p>You have a new order from <strong>${order.userEmail}</strong>.</p>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Total Amount:</strong> NGN ${order.total.toLocaleString()}</p>
            <p>Check the admin dashboard for details.</p>
          </div>
        `
      });
    }
  } catch (err) {
    console.error('Email notification error:', err);
  }

  return { success: true, orderId: order._id };
}
