import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const { status } = await request.json(); 

    if (!['active', 'banned'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findByIdAndUpdate(id, { status }, { new: true });
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Status updated' }, { status: 200 });
  } catch (error) {
    console.error('User Status PATCH error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update user status' }, { status: 500 });
  }
}
