import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/lib/mongodb';
import { processOrderSuccess } from '@/lib/order-utils';

/**
 * POST handler for Paystack webhooks.
 * This ensures payments are confirmed even if the user never returns to the site.
 */
export async function POST(request) {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    const signature = request.headers.get('x-paystack-signature');
    const body = await request.text();

    if (!signature) {
      return NextResponse.json({ message: 'No signature' }, { status: 400 });
    }

    // Verify signature
    const hash = crypto.createHmac('sha512', secret).update(body).digest('hex');

    if (hash !== signature) {
      console.error('Webhook Signature Mismatch');
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);

    // Only process successful charges
    if (event.event === 'charge.success') {
      await connectDB();
      const reference = event.data.reference;
      
      console.log(`Webhook: Processing successful payment for ${reference}`);
      const result = await processOrderSuccess(reference);
      
      if (result.success) {
        console.log(`Webhook: Order ${reference} confirmed successfully`);
      } else {
        console.log(`Webhook: Order ${reference} was already processed or not found`);
      }
    }

    return NextResponse.json({ message: 'Webhook received' }, { status: 200 });
  } catch (error) {
    console.error('Webhook Runtime Error:', error);
    return NextResponse.json({ message: 'Internal error' }, { status: 500 });
  }
}
