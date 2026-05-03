import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import DeliveryZone from '@/models/DeliveryZone';
import { cookies } from 'next/headers';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    await connectDB();
    const cookieStore = cookies();
    const adminPasskey = cookieStore.get('admin_passkey')?.value;
    const secret = process.env.ADMIN_PASSKEY;

    if (!adminPasskey || adminPasskey !== secret) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();

    // Auto-generate slug if name is provided and slug is missing
    if (!body.slug && body.name) {
      body.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const zone = await DeliveryZone.findByIdAndUpdate(id, body, { new: true });

    if (!zone) {
      return NextResponse.json({ success: false, error: 'Zone not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: zone }, { status: 200 });
  } catch (error) {
    console.error('Delivery Zone PUT Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update delivery zone' }, { status: 500 });
  }
}
