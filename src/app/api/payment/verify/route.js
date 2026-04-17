import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { verifyTransaction } from '@/lib/paystack';

/**
 * GET handler to verify transaction reference.
 * This acts as the callback URL for Paystack.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('trxref') || searchParams.get('reference');
    
    if (!reference) {
      return NextResponse.redirect(new URL('/checkout?error=Missing+Reference', request.url));
    }

    await connectDB();
    const verification = await verifyTransaction(reference);

    if (verification.data.status === 'success') {
      // Find the order by reference (which is the orderNumber in our case)
      const order = await Order.findOne({ 'payment.reference': reference });
      
      if (order && order.status === 'pending') {
         order.status = 'processing';
         order.payment.status = 'success';
         order.payment.paidAt = new Date();
         order.statusHistory.push({
           status: 'processing',
           timestamp: new Date(),
           note: 'Payment verified via callback'
         });
         await order.save();
      }
      
      // Redirect to confirmation page
      return NextResponse.redirect(new URL(`/order-confirmation/${order?._id || reference}`, request.url));
    } else {
      return NextResponse.redirect(new URL('/checkout?error=Payment+Verification+Failed', request.url));
    }
  } catch (error) {
    console.error('Payment verify fallback error:', error);
    return NextResponse.redirect(new URL('/checkout?error=Verification+Error', request.url));
  }
}
