import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
export default async function AdminOrdersPage() {
  let orders = [];

  try {
    await connectDB();
    const docs = await Order.find().sort({ createdAt: -1 });
    orders = JSON.parse(JSON.stringify(docs));
  } catch (error) {
    console.error('Failed to fetch orders:', error);
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Order Management</h1>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-sm font-semibold tracking-wider">
                <th className="p-5 pl-8 border-b border-gray-100">Order Ref</th>
                <th className="p-5 border-b border-gray-100">Customer</th>
                <th className="p-5 border-b border-gray-100">Date</th>
                <th className="p-5 border-b border-gray-100">Total</th>
                <th className="p-5 border-b border-gray-100">Status</th>
                <th className="p-5 pr-8 border-b border-gray-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                 <tr key={order._id} className="hover:bg-gray-50 transition-colors border-b border-gray-50">
                   <td className="p-5 pl-8 font-extrabold text-gray-900 whitespace-nowrap">{order.orderNumber}</td>
                   <td className="p-5 text-gray-600 font-medium">{order.delivery?.email || order.userEmail}</td>
                   <td className="p-5 text-gray-500 text-sm font-semibold whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()}</td>
                   <td className="p-5 font-extrabold text-black whitespace-nowrap">{formatCurrency(order.total, order.payment?.currency || order.currency || 'NGN')}</td>
                   <td className="p-5">
                      <Badge variant={order.status === 'delivered' ? 'success' : order.status === 'pending' ? 'warning' : 'brand'} className="uppercase tracking-widest text-[10px] px-2 py-1">
                        {order.status}
                      </Badge>
                   </td>
                   <td className="p-5 pr-8 text-right">
                     <Link href={`/management-portal/orders/${order._id}`} className="text-black font-bold hover:text-black bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors inline-block whitespace-nowrap">
                       Details
                     </Link>
                   </td>
                 </tr>
               ))}
            </tbody>
          </table>
          {orders.length === 0 && <div className="p-12 text-center text-gray-500 font-medium">No orders found in the database.</div>}
        </div>
      </div>
    </div>
  );
}
