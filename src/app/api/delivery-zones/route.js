import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import DeliveryZone from '@/models/DeliveryZone';
import { cookies } from 'next/headers';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'domestic' or 'international'

    const filter = { active: true };
    if (type) {
      if (type === 'domestic') {
        // Find either 'domestic' or zones with no type set (legacy)
        filter.$or = [
          { type: 'domestic' },
          { type: { $exists: false } }
        ];
      } else {
        filter.type = type;
      }
    }

    const zones = await DeliveryZone.find(filter);
    
    // Process zones to apply override if active and within date range
    const processedZones = zones.map(zone => {
      let finalFee = zone.fee;
      const now = new Date();
      
      if (zone.pricingOverride && 
          zone.pricingOverride.active && 
          zone.pricingOverride.validFrom && 
          zone.pricingOverride.validUntil &&
          now >= new Date(zone.pricingOverride.validFrom) && 
          now <= new Date(zone.pricingOverride.validUntil)) {
        finalFee = zone.pricingOverride.fee;
      }
      
      return {
        ...zone.toObject(),
        effectiveFee: finalFee
      };
    });
    
    return NextResponse.json({ success: true, data: processedZones }, { status: 200 });
  } catch (error) {
    console.error('Delivery Zones GET Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch delivery zones' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const cookieStore = cookies();
    const adminPasskey = cookieStore.get('admin_passkey')?.value;
    const secret = process.env.ADMIN_PASSKEY;

    if (!adminPasskey || adminPasskey !== secret) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    
    // Auto-generate slug if not provided
    if (!body.slug && body.name) {
      body.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const zone = await DeliveryZone.create(body);
    
    return NextResponse.json({ success: true, data: zone }, { status: 201 });
  } catch (error) {
    console.error('Delivery Zone POST Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create delivery zone' }, { status: 500 });
  }
}
