import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Review from '@/models/Review';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { productId, rating, comment } = await request.json();
    
    // 1. Auth check
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;
    const userPayload = token ? verifyToken(token) : null;
    
    if (!userPayload) {
      return NextResponse.json({ success: false, error: 'Please login to leave a review' }, { status: 401 });
    }

    await connectDB();

    // Fallback: If name is missing from token (older logins), fetch it from DB
    let userName = userPayload.name;
    if (!userName) {
       const userDoc = await User.findById(userPayload.id);
       userName = userDoc?.name || 'Customer';
    }

    // 2. Verified Purchase check
    const order = await Order.findOne({
      user: userPayload.id,
      status: 'delivered',
      'items.product': productId
    });

    if (!order) {
      return NextResponse.json({ 
        success: false, 
        error: 'Only customers who have purchased and received this product can leave a review.' 
      }, { status: 403 });
    }

    // 3. Prevent duplicate reviews
    const existingReview = await Review.findOne({
      user: userPayload.id,
      product: productId,
      order: order._id
    });

    if (existingReview) {
      return NextResponse.json({ success: false, error: 'You have already reviewed this product for this order.' }, { status: 400 });
    }

    // 4. Create Review
    const review = await Review.create({
      user: userPayload.id,
      userName: userName,
      product: productId,
      order: order._id,
      rating,
      comment,
      status: 'approved'
    });

    // 5. Update Product Rating Stats
    const product = await Product.findById(productId);
    if (product) {
       const reviews = await Review.find({ product: productId, status: 'approved' });
       const count = reviews.length;
       const average = reviews.reduce((acc, item) => acc + item.rating, 0) / count;
       
       product.ratings = { average, count };
       await product.save();
    }

    return NextResponse.json({ success: true, data: review }, { status: 201 });

  } catch (error) {
    console.error('Review Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit review' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });
    }

    await connectDB();
    const reviews = await Review.find({ product: productId, status: 'approved' })
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json({ success: true, data: reviews }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
