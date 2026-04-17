import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';


export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const status = searchParams.get('status') || 'active';
    const limit = parseInt(searchParams.get('limit')) || 0;
    const sort = searchParams.get('sort') || '-createdAt';

    let query = { status };
    if (category) query.category = category;
    if (featured) query.featured = featured === 'true';

    let products = Product.find(query).sort(sort);
    if (limit > 0) products = products.limit(limit);

    const data = await products;
    
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Products GET Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    // Generate slug from name if not provided
    if (!body.slug && body.name) {
      body.slug = body.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }

    const product = await Product.create(body);
    
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error('Products POST Error:', error);
    if (error.code === 11000) {
      return NextResponse.json({ success: false, error: 'Product with this slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message || 'Failed to create product' }, { status: 500 });
  }
}
