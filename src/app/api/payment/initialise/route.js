import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';
import Coupon from '@/models/Coupon';
import DeliveryZone from '@/models/DeliveryZone';
import AbandonedCart from '@/models/AbandonedCart';
import { initializePayment } from '@/lib/paystack';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    const limitResult = rateLimit(ip, 5, 60000); // 5 per min

    if (!limitResult.success) {
      return NextResponse.json({ success: false, error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const { items, delivery, couponCode, email, currency = 'NGN' } = await request.json();
    
    await connectDB();

    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;
    const userPayload = token ? verifyToken(token) : null;
    const userId = userPayload?.id;

    let subtotal = 0;
    const orderItems = [];

    // 1. Validate Products & Calculate Subtotal
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || product.status !== 'active') {
        return NextResponse.json({ success: false, error: `Product ${item.name} not found or inactive` }, { status: 400 });
      }

      // Stock check
      const variantKey = item.variant?.color 
        ? `${item.variant.size}-${item.variant.color.name}`
        : `${item.variant.size}`;
      
      const availableStock = product.inventory?.get(variantKey) || product.inventory?.get('total') || 0;
      
      if (availableStock < item.quantity) {
        return NextResponse.json({ success: false, error: `Insufficient stock for ${product.name} (${item.variant.size})` }, { status: 400 });
      }

      const price = currency === 'USD' ? (product.priceUSD || product.price) : product.price;
      subtotal += price * item.quantity;

      orderItems.push({
        product: product._id,
        productName: product.name,
        image: product.media?.[0]?.url || '/placeholder.png',
        price: price,
        costPrice: product.costPrice || 0,
        quantity: item.quantity,
        variant: item.variant
      });
    }

    // 2. Validate Coupon & Discount
    let discount = 0;
    let appliedCoupon = null;
    if (couponCode) {
       const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), active: true });
       if (coupon) {
         const now = new Date();
         const isDateValid = now >= coupon.validFrom && now <= coupon.validUntil;
         const isUsageValid = !coupon.usageLimit || coupon.usageCount < coupon.usageLimit;
         const isUserValid = !userId || !coupon.usedBy.includes(userId);
         const isMinAmountValid = !coupon.minOrderAmount || subtotal >= coupon.minOrderAmount;

         if (isDateValid && isUsageValid && isUserValid && isMinAmountValid) {
            discount = coupon.type === 'percentage' ? (subtotal * coupon.value / 100) : coupon.value;
            appliedCoupon = { code: coupon.code, discount };
         }
       }
    }

    // 3. Validate Delivery Fee
    let deliveryFee = 0;
    if (delivery.zone) {
       const zone = await DeliveryZone.findOne({ slug: delivery.zone, active: true });
       if (zone) {
          const now = new Date();
          const hasOverride = zone.pricingOverride?.active && 
                             zone.pricingOverride.validFrom && 
                             zone.pricingOverride.validUntil &&
                             now >= zone.pricingOverride.validFrom && 
                             now <= zone.pricingOverride.validUntil;
          
          if (currency === 'USD') {
            deliveryFee = zone.feeUSD || (hasOverride ? zone.pricingOverride.fee : zone.fee);
          } else {
            deliveryFee = hasOverride ? zone.pricingOverride.fee : zone.fee;
          }
       }
    }

    const total = Math.max(subtotal - discount + deliveryFee, 0);
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 4. Initialise Paystack
    const paystackRes = await initializePayment(
       email, 
       Math.round(total * 100), 
       orderNumber,
       { 
         userId,
         orderNumber,
         couponCode: appliedCoupon?.code,
         currency
       },
       currency // Pass currency to Paystack lib
    );

    if (!paystackRes.status) {
      return NextResponse.json({ success: false, error: 'Payment provider error' }, { status: 500 });
    }

    // 5. Create Pending Order
    const order = await Order.create({
      orderNumber,
      user: userId,
      userEmail: email,
      items: orderItems,
      delivery: {
        ...delivery,
        fee: deliveryFee
      },
      coupon: appliedCoupon,
      subtotal,
      deliveryFee,
      discount,
      total,
      currency,
      status: 'pending',
      payment: {
        provider: 'paystack',
        reference: orderNumber,
        status: 'pending',
        amount: total,
        currency
      },
      statusHistory: [{
        status: 'pending',
        timestamp: new Date(),
        note: `Order initiated in ${currency}, awaiting payment confirmation.`
      }]
    });

    // 6. Track as Abandoned Cart (will be marked converted on success)
    try {
      await AbandonedCart.create({
        user: userId,
        userEmail: email,
        items: orderItems.map(i => ({
          product: i.product,
          productName: i.productName,
          image: i.image,
          price: i.price,
          variant: { size: i.variant?.size, color: i.variant?.color?.name },
          quantity: i.quantity
        })),
        totalValue: total,
        lastUpdated: new Date()
      });
    } catch (e) {
      console.error('Abandoned cart logging failed:', e);
    }

    return NextResponse.json({ 
      success: true, 
      data: paystackRes.data,
      orderId: order._id 
    }, { status: 200 });

  } catch (error) {
    console.error('Payment Init Error:', error);
    if (error.name === 'ValidationError') {
      return NextResponse.json({ success: false, error: 'Order validation failed', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Internal Server Error', message: error.message }, { status: 500 });
  }
}
