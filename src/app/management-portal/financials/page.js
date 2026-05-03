import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, DollarSign, PieChart, ArrowUpRight, Boxes, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default async function FinancialsPage() {
  let stats = { 
    ngnRevenue: 0, ngnCost: 0, ngnProfit: 0,
    usdRevenue: 0, usdCost: 0, usdProfit: 0
  };
  let productStats = [];
  let topColors = [];
  let topSizes = [];

  let orders = [];
  let products = [];
  
  try {
    await connectDB();
    const [orderDocs, productDocs] = await Promise.all([
      Order.find({ 'payment.status': 'success' }),
      Product.find().sort({ salesCount: -1 })
    ]);
    orders = orderDocs;
    products = productDocs;

    const colorPerformance = {};
    const sizePerformance = {};
    const productPerformance = {};

    orders.forEach(order => {
      // Determine currency from payment.currency, fallback to order.currency
      const isUSD = (order.payment?.currency || order.currency) === 'USD';
      
      if (isUSD) stats.usdRevenue += order.total;
      else stats.ngnRevenue += order.total;

      order.items.forEach(item => {
        const qty = item.quantity || 0;
        const rev = (item.price || 0) * qty;
        // Use costPrice from the item — this was set at order time
        const cost = (item.costPrice || 0) * qty;
        const profit = rev - cost;
        
        const pId = item.product?.toString();
        if (pId) {
          if (!productPerformance[pId]) {
            productPerformance[pId] = { ngnRev: 0, ngnProfit: 0, usdRev: 0, usdProfit: 0, salesCount: 0, name: item.productName, image: item.image };
          }
          if (isUSD) {
            productPerformance[pId].usdRev += rev;
            productPerformance[pId].usdProfit += profit;
          } else {
            productPerformance[pId].ngnRev += rev;
            productPerformance[pId].ngnProfit += profit;
          }
          productPerformance[pId].salesCount += qty;
        }

        if (item.variant?.color?.name) colorPerformance[item.variant.color.name] = (colorPerformance[item.variant.color.name] || 0) + qty;
        if (item.variant?.size) sizePerformance[item.variant.size] = (sizePerformance[item.variant.size] || 0) + qty;
      });
    });

    // Calculate profit: Revenue - (cost of items + delivery fees)
    // NGN orders
    const ngnOrders = orders.filter(o => (o.payment?.currency || o.currency) !== 'USD');
    const ngnCosts = ngnOrders.reduce((acc, o) => {
      const itemCost = o.items.reduce((ia, i) => ia + ((i.costPrice || 0) * i.quantity), 0);
      return acc + itemCost + (o.deliveryFee || 0);
    }, 0);
    stats.ngnProfit = stats.ngnRevenue - ngnCosts;

    // USD orders  
    const usdOrders = orders.filter(o => (o.payment?.currency || o.currency) === 'USD');
    const usdCosts = usdOrders.reduce((acc, o) => {
      const itemCost = o.items.reduce((ia, i) => ia + ((i.costPrice || 0) * i.quantity), 0);
      return acc + itemCost + (o.deliveryFee || 0);
    }, 0);
    stats.usdProfit = stats.usdRevenue - usdCosts;

    topColors = Object.entries(colorPerformance).sort(([, a], [, b]) => b - a).slice(0, 5);
    topSizes = Object.entries(sizePerformance).sort(([, a], [, b]) => b - a).slice(0, 5);

    productStats = Object.values(productPerformance).sort((a, b) => b.salesCount - a.salesCount);

  } catch (error) {
    console.error('Financials Page Error:', error);
  }

  const cards = [
    { label: 'NGN Revenue', value: formatCurrency(stats.ngnRevenue, 'NGN'), icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'NGN Profit', value: formatCurrency(stats.ngnProfit, 'NGN'), icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'USD Revenue', value: formatCurrency(stats.usdRevenue, 'USD'), icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'USD Profit', value: formatCurrency(stats.usdProfit, 'USD'), icon: DollarSign, color: 'text-rose-600', bg: 'bg-rose-50' }
  ];

  return (
    <div className="space-y-10 md:space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Financial Intelligence</h1>
          <p className="text-gray-500 font-bold mt-1 text-xs md:text-sm uppercase tracking-widest opacity-70">NGN & USD Dual-Currency Analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-50 flex flex-col gap-6">
             <div className={`${card.bg} w-14 h-14 rounded-2xl flex items-center justify-center`}>
                {card.label.includes('NGN') ? <span className={`font-black text-xl ${card.color}`}>₦</span> : <card.icon className={`${card.color}`} size={24} />}
             </div>
             <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{card.label}</p>
                <p className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">{card.value}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
        <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-gray-100 border border-gray-50">
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-8">Popular Colours</h3>
          <div className="space-y-6">
            {topColors.map(([color, count], i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border border-gray-100 bg-gray-50 flex items-center justify-center font-black text-xs">#{i+1}</div>
                  <span className="font-bold text-gray-700 group-hover:text-black transition-colors">{color}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-black transition-all" style={{ width: `${(count / (topColors[0]?.[1] || 1)) * 100}%` }} />
                  </div>
                  <span className="text-xs font-black text-gray-900">{count} sales</span>
                </div>
              </div>
            ))}
            {topColors.length === 0 && <p className="text-gray-400 text-sm italic">No color data yet</p>}
          </div>
        </div>

        <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-gray-100 border border-gray-50">
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-8">Size Performance</h3>
          <div className="space-y-6">
            {topSizes.map(([size, count], i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border border-gray-100 bg-gray-50 flex items-center justify-center font-black text-xs">{size}</div>
                  <span className="font-bold text-gray-700 group-hover:text-black transition-colors">Size {size}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#DAA520] transition-all" style={{ width: `${(count / (topSizes[0]?.[1] || 1)) * 100}%` }} />
                  </div>
                  <span className="text-xs font-black text-gray-900">{count} sales</span>
                </div>
              </div>
            ))}
            {topSizes.length === 0 && <p className="text-gray-400 text-sm italic">No size data yet</p>}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-100 border border-gray-50 overflow-hidden">
        <div className="p-8 md:p-10 border-b border-gray-50 flex items-center justify-between">
          <h3 className="text-lg md:text-xl font-black text-gray-900 uppercase tracking-tight">Product Costing & Performance</h3>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <Boxes size={14} /> {productStats.length} Products Tracked
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-6">Product</th>
                <th className="px-8 py-6">Sales</th>
                <th className="px-8 py-6">₦ NGN Rev</th>
                <th className="px-8 py-6 text-rose-500">₦ NGN Profit</th>
                <th className="px-8 py-6">$ USD Rev</th>
                <th className="px-8 py-6 text-emerald-600">$ USD Profit</th>
              </tr>
            </thead>
            <tbody>
              {productStats.map((p, i) => (
                <tr key={i} className="border-b border-gray-50/50 hover:bg-gray-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-12 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                        <img src={p.image || '/placeholder.png'} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-black text-gray-900 text-sm truncate max-w-[200px]">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-bold text-gray-600 text-sm">{p.salesCount}</td>
                  <td className="px-8 py-6 font-black text-gray-900 text-sm">{formatCurrency(p.ngnRev, 'NGN')}</td>
                  <td className="px-8 py-6 font-black text-rose-500 text-sm">{formatCurrency(p.ngnProfit, 'NGN')}</td>
                  <td className="px-8 py-6 font-black text-gray-900 text-sm">{formatCurrency(p.usdRev, 'USD')}</td>
                  <td className="px-8 py-6 font-black text-emerald-600 text-sm">{formatCurrency(p.usdProfit, 'USD')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
