import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Newsletter from '@/models/Newsletter';

export async function GET() {
  try {
    await connectDB();
    const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });
    return NextResponse.json({ success: true, data: subscribers }, { status: 200 });
  } catch (error) {
    console.error('Newsletter GET Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    const existingSubscriber = await Newsletter.findOne({ email });
    if (existingSubscriber) {
      return NextResponse.json({ 
        success: false, 
        message: 'You are already signed up for our updates!' 
      }, { status: 400 });
    }

    const subscriber = await Newsletter.create({ email });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Successfully subscribed to JTOtheLabel updates!',
      data: subscriber 
    }, { status: 201 });
  } catch (error) {
    console.error('Newsletter POST Error:', error);
    return NextResponse.json({ success: false, error: 'Subscription failed' }, { status: 500 });
  }
}
