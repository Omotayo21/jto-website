import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function POST(request) {
  try {
    const { items } = await request.json();
    
    await connectDB();
    let validatedTotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (product) {
        const price = product.price; 
        validatedTotal += price * item.quantity;
        validatedItems.push({
          ...item,
          validatedPrice: price
        });
      }
    }

    return NextResponse.json({ success: true, data: { validatedTotal, items: validatedItems } }, { status: 200 });
  } catch (error) {
    console.error('Cart validate error:', error);
    return NextResponse.json({ success: false, error: 'Failed to validate cart' }, { status: 500 });
  }
}
