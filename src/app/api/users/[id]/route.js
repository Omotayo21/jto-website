import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    await connectDB();
    const user = await User.findById(id);
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    console.error('User GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch user' }, { status: 500 });
  }
}
