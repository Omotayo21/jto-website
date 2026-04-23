import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { verifyTransaction } from '@/lib/paystack';
import { processOrderSuccess } from '@/lib/order-utils';

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
      const result = await processOrderSuccess(reference);
      
      // Redirect to confirmation page
      return NextResponse.redirect(new URL(`/order-confirmation/${result.orderId || reference}`, request.url));
    } else {
      return NextResponse.redirect(new URL('/checkout?error=Payment+Verification+Failed', request.url));
    }
  } catch (error) {
    console.error('Payment verify fallback error:', error);
    return NextResponse.redirect(new URL('/checkout?error=Verification+Error', request.url));
  }
}
