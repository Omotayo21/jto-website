import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import AbandonedCart from '@/models/AbandonedCart';
import { formatCurrency } from '@/lib/utils';
import { ShoppingBag, TrendingUp, Users, MousePointer2, ExternalLink, Package } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  let stats = { totalRevenue: 0, pendingOrders: 0, abandonedCount: 0, totalUsers: 0 };
  let recentOrders = [];
  let topProducts = [];

  try {
    await connectDB();
    const [orderDocs, userCount, productDocs, abandonedCount] = await Promise.all([
      Order.find().sort({ createdAt: -1 }).limit(5),
      User.countDocuments(),
      Product.find().sort({ salesCount: -1 }).limit(3),
      AbandonedCart.countDocuments({ converted: false })
    ]);
    
    const revenue = await Order.aggregate([
      { $match: { 'payment.status': 'success' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const pendingCount = await Order.countDocuments({ status: { $in: ['pending', 'processing'] } });

    stats = {
      totalRevenue: revenue[0]?.total || 0,
      pendingOrders: pendingCount,
      abandonedCount,
      totalUsers: userCount
    };
    recentOrders = JSON.parse(JSON.stringify(orderDocs));
    topProducts = JSON.parse(JSON.stringify(productDocs));
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
  }

  const statCards = [
    { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: ShoppingBag, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Abandoned Carts', value: stats.abandonedCount, icon: MousePointer2, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' }
  ];

  return (
    <div className="space-y-10 md:space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Admin Console</h1>
          <p className="text-gray-500 font-bold mt-1 text-xs md:text-sm uppercase tracking-widest opacity-70">Platform performance overview</p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm self-start md:self-auto">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse ring-4 ring-emerald-100" />
          <span className="text-[10px] md:text-xs font-black text-gray-600 uppercase tracking-widest">{new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-50 flex flex-col gap-6 group hover:-translate-y-1 transition-all duration-300">
             <div className={`${stat.bg} w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                <stat.icon className={`${stat.color}`} size={24} />
             </div>
             <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                <p className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8 md:gap-12 pb-10">
        <div className="lg:col-span-2 bg-white rounded-[3rem] shadow-2xl shadow-gray-100 border border-gray-50 overflow-hidden">
          <div className="p-8 md:p-10 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-lg md:text-xl font-black text-gray-900 uppercase tracking-tight">Recent Transactions</h3>
            <Link href="/management-portal/orders" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all">
               View All <ExternalLink size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left min-w-[500px]">
              <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-6">Ref</th>
                  <th className="px-8 py-6">Customer</th>
                  <th className="px-8 py-6">Amount</th>
                  <th className="px-8 py-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, i) => (
                  <tr key={i} className="border-b border-gray-50/50 hover:bg-gray-50/30 transition-colors group">
                    <td className="px-8 py-6 font-black text-gray-900 group-hover:text-indigo-600 transition-colors text-sm whitespace-nowrap">{order.orderNumber}</td>
                    <td className="px-8 py-6 text-gray-400 font-bold text-sm truncate max-w-[150px]">{order.userEmail}</td>
                    <td className="px-8 py-6 font-black text-gray-900 text-sm whitespace-nowrap">{formatCurrency(order.total)}</td>
                    <td className="px-8 py-6 text-right">
                       <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full whitespace-nowrap ${
                         order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
                       }`}>
                         {order.status}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] p-3 md:p-5 shadow-2xl shadow-gray-100 border border-gray-50 h-fit w-fit">
           <h3 className="text-lg md:text-xl font-black text-gray-900 uppercase tracking-tight mb-10 pb-6 border-b border-gray-50">Best Sellers</h3>
           <div className="space-y-8">
              {topProducts.map((p, i) => (
                <div key={i} className="flex items-center gap-6 group cursor-pointer">
                   <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                      <img src={p.media?.[0]?.url || p.images?.[0]?.url || '/placeholder.png'} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="font-black text-gray-900 group-hover:text-indigo-600 transition-colors truncate text-sm">{p.name}</p>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 whitespace-nowrap">{p.salesCount || 0} Sales <span className="mx-2 opacity-20">|</span> {formatCurrency(p.price)}</p>
                   </div>
                   <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                      <ExternalLink size={14} className="text-gray-300 group-hover:text-indigo-400" />
                   </div>
                </div>
              ))}
              <div className="pt-6">
                <Link href="/management-portal/products" className="block w-full py-3 bg-gray-900 text-white text-center rounded-[1.5rem] font-black uppercase text-[10px] hover:bg-black transition-all shadow-xl shadow-gray-200 md:w-40 ">
                   Inventory Report
                </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
