import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';
import User from '@/models/User';
import AbandonedCart from '@/models/AbandonedCart';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;
    const user = token ? verifyToken(token) : null;

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // 1. Top Selling Products
    const topProducts = await Product.find({ status: 'active' })
      .sort({ salesCount: -1 })
      .limit(10)
      .select('name media salesCount price');

    // 2. Abandoned Carts (unconverted)
    const abandonedCarts = await AbandonedCart.find({ converted: false })
      .sort({ lastUpdated: -1 })
      .limit(50);

    // 3. Revenue Stats
    const deliveredOrders = await Order.find({ status: { $in: ['delivered', 'processing'] } });
    const totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.total, 0);

    const thisMonthOrders = deliveredOrders.filter(order => order.createdAt >= firstDayOfMonth);
    const lastMonthOrders = deliveredOrders.filter(order => order.createdAt >= firstDayOfLastMonth && order.createdAt < firstDayOfMonth);

    const revenueThisMonth = thisMonthOrders.reduce((sum, order) => sum + order.total, 0);
    const revenueLastMonth = lastMonthOrders.reduce((sum, order) => sum + order.total, 0);

    // 4. Orders by Status
    const statusCounts = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // 5. New Users
    const newUsersCount = await User.countDocuments({ createdAt: { $gte: firstDayOfMonth } });

    return NextResponse.json({
      success: true,
      data: {
        topProducts,
        abandonedCarts,
        stats: {
          totalRevenue,
          revenueThisMonth,
          revenueLastMonth,
          newUsersCount,
          statusCounts: statusCounts.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
          }, {})
        }
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Admin Analytics GET Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
