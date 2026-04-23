import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/lib/mongodb';
import { processOrderSuccess } from '@/lib/order-utils';

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
    
    // 2. Handle successful charge
    if (event.event === 'charge.success') {
      await connectDB();
      const reference = event.data.reference;
      
      // processOrderSuccess handles order status, stock deduction, cart clearing, and email
      await processOrderSuccess(reference);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ success: false, error: 'Webhook processing failed' }, { status: 500 });
  }
}
