import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { OrderStatusTracker } from '@/components/orders/OrderStatusTracker';
import { redirect } from 'next/navigation';


export default async function AccountOrdersPage() {
  const token = cookies().get('auth_token')?.value;
  if (!token) redirect('/login');

  const payload = verifyToken(token);
  if (!payload) redirect('/login');

  await connectDB();
  const ordersDocs = await Order.find({ user: payload.id }).sort({ createdAt: -1 });
  const orders = JSON.parse(JSON.stringify(ordersDocs));

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">Order History</h1>
      {orders.length === 0 ? (
        <div className="bg-[#FFFCE0] p-16 text-center shadow-lg shadow-gray-200/40 rounded-[2rem] border border-gray-100 flex flex-col items-center">
          <p className="text-xl text-gray-500 mb-6 font-medium">You have no past orders.</p>
          <Link href="/products" className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-12">
          {orders.map(order => (
            <div key={order._id} className="bg-[#FFFCE0] rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-500">
               <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                 <div>
                   <div className="flex items-center gap-4 mb-2">
                     <h3 className="font-extrabold text-2xl text-gray-900 tracking-tight">#{order.orderNumber}</h3>
                     <Badge 
                       variant={order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'destructive' : 'brand'} 
                       className="uppercase px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest shadow-sm"
                     >
                       {order.status}
                     </Badge>
                   </div>
                   <p className="text-sm font-bold text-gray-400">{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                 </div>
                 <div className="flex flex-col items-end">
                   <p className="font-black text-3xl text-indigo-600 tracking-tight">NGN {order.total.toLocaleString()}</p>
                   <Link href={`/order-confirmation/${order._id}`} className="mt-2 text-indigo-600 text-sm font-bold hover:underline">Full Details</Link>
                 </div>
               </div>
               
               <div className="p-8 lg:p-12">
                 <OrderStatusTracker status={order.status} history={order.statusHistory} />
               </div>

               <div className="p-8 border-t border-gray-50 bg-gray-50/20 flex flex-wrap gap-4">
                 {order.items.slice(0, 4).map((item, idx) => (
                   <div key={idx} className="w-16 h-16 rounded-xl overflow-hidden bg-[#FFFCE0] border border-gray-100">
                     <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                   </div>
                 ))}
                 {order.items.length > 4 && (
                   <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-sm">
                     +{order.items.length - 4}
                   </div>
                 )}
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
