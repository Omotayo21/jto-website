import { connectDB } from '@/lib/mongodb';
import Review from '@/models/Review';
import Order from '@/models/Order';
import Product from '@/models/Product';

export async function GET(request, { params }) {
  try {
    const { productId } = params;
    await connectDB();
    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: reviews }, { status: 200 });
  } catch (error) {
    console.error('Reviews GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { productId } = params;
    const { userId, userName, rating, title, body } = await request.json();

    await connectDB();

    const orders = await Order.find({ 
      userId, 
      'payment.status': 'success',
      'items.productId': productId
    });
      
    const verified = orders.length > 0;

    const newReview = await Review.create({
      productId,
      userId,
      userName,
      rating: Number(rating),
      title,
      body,
      verified,
    });

    const product = await Product.findById(productId);
    if (product) {
      const currentAvg = product.ratings?.average || 0;
      const currentCount = product.ratings?.count || 0;
      const newCount = currentCount + 1;
      const newAvg = ((currentAvg * currentCount) + Number(rating)) / newCount;
      
      product.ratings = { average: newAvg, count: newCount };
      await product.save();
    }

    return NextResponse.json({ success: true, data: newReview }, { status: 201 });
  } catch (error) {
    console.error('Reviews POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create review' }, { status: 500 });
  }
}
