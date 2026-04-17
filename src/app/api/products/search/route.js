import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
      return Response.json({ success: false, error: 'Query required' }, { status: 400 });
    }

    await connectDB();
    const results = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ],
      status: 'active'
    }).populate('category').sort({ createdAt: -1 });

    return Response.json({ success: true, data: results });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
