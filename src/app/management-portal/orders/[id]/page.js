'use client';
import { useState, useEffect } from 'react';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import toast from 'react-hot-toast';


export default function AdminOrderDetailsPage({ params }) {
  const { id } = params;
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`);
        const data = await res.json();
        if (data.success) {
          setOrder(data.data);
        } else {
          toast.error(data.error || 'Failed to fetch order');
        }
      } catch (err) {
        toast.error('Network error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const updateStatus = async (newStatus) => {
    if (newStatus === order.status) return;
    
    setIsUpdating(true);
    const t = toast.loading(`Updating order to ${newStatus}...`);
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, note: `Status updated by admin to ${newStatus}` })
      });
      const data = await res.json();
      if (data.success) {
        setOrder(prev => ({ ...prev, status: newStatus }));
        toast.success(`Order status: ${newStatus.toUpperCase()}`, { id: t });
      } else {
        toast.error(data.error || 'Failed to update status', { id: t });
      }
    } catch (err) {
      toast.error('Network error', { id: t });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-black animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Order not found</h2>
        <Link href="/management-portal/orders" className="text-black mt-4 block">Back to Orders</Link>
      </div>
    );
  }

  // Determine the currency this order was paid in
  const orderCurrency = order.payment?.currency || order.currency || 'NGN';

  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/management-portal/orders" className="p-3 bg-white rounded-2xl text-gray-500 hover:text-black transition-all shadow-sm border border-gray-100">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Order {order.orderNumber}</h1>
          <p className="text-gray-500 font-bold text-sm">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        {/* Currency Badge */}
        <div className={`ml-auto px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-widest ${
          orderCurrency === 'USD' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
        }`}>
          {orderCurrency === 'USD' ? '$ USD Order' : '₦ NGN Order'}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Status Control */}
          <section className="bg-[#fffce0] p-10 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100">
             <h2 className="text-xl font-black text-gray-900 mb-8 border-l-4 border-black pl-4 uppercase tracking-tight">Fulfillment Status</h2>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { id: 'pending', label: 'Pending', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                  { id: 'processing', label: 'Processing', icon: Package, color: 'text-black', bg: 'bg-gray-100' },
                  { id: 'shipped', label: 'Shipped', icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { id: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                ].map((s) => (
                  <button 
                    key={s.id}
                    disabled={isUpdating}
                    onClick={() => updateStatus(s.id)}
                    className={`flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all ${order.status === s.id ? `${s.bg} border-black shadow-lg` : 'bg-gray-50 border-transparent hover:border-gray-200'} ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <s.icon size={24} className={order.status === s.id ? s.color : 'text-gray-400'} />
                    <span className={`text-xs font-black uppercase tracking-widest ${order.status === s.id ? s.color : 'text-gray-400'}`}>{s.label}</span>
                  </button>
                ))}
             </div>
          </section>

          {/* Items */}
          <section className="bg-[#fffce0] rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
             <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Order Items</h2>
             </div>
             <div className="p-8 space-y-6">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-6 group">
                    <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 shrink-0 overflow-hidden">
                       <img src={item.image || '/placeholder.png'} alt={item.productName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                       <h4 className="font-bold text-gray-900">{item.productName}</h4>
                       <div className="flex gap-4 mt-1">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Qty: {item.quantity}</span>
                          {item.variant && (
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                              {item.variant.size} {item.variant.color?.name ? `/ ${item.variant.color.name}` : ''}
                            </span>
                          )}
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="font-black text-gray-900">{formatCurrency(item.price * item.quantity, orderCurrency)}</p>
                       <p className="text-[10px] text-gray-400 font-bold uppercase">{formatCurrency(item.price, orderCurrency)} each</p>
                    </div>
                  </div>
                ))}
             </div>
             <div className="p-8 bg-gray-50 border-t border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-bold text-gray-400">Subtotal</span>
                  <span className="font-black text-gray-900">{formatCurrency(order.subtotal, orderCurrency)}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-bold text-gray-400">Delivery ({order.delivery?.zone || 'Standard'})</span>
                  <span className="font-black text-gray-900">{formatCurrency(order.deliveryFee, orderCurrency)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-emerald-500">Discount</span>
                    <span className="font-black text-emerald-500">-{formatCurrency(order.discount, orderCurrency)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="font-black text-gray-500 uppercase tracking-widest">Grand Total</span>
                  <span className="text-3xl font-black text-black">{formatCurrency(order.total, orderCurrency)}</span>
                </div>
             </div>
          </section>
        </div>

        <div className="space-y-10">
          <section className="bg-[#fffce0] p-10 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100">
             <h2 className="text-xl font-black text-gray-900 mb-8 border-l-4 border-rose-600 pl-4 uppercase tracking-tight">Customer Info</h2>
             <div className="space-y-6">
                <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Email Address</p>
                   <p className="font-bold text-gray-900">{order.userEmail || order.delivery?.email}</p>
                </div>
                <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Payment Status</p>
                   <Badge variant={order.payment?.status === 'success' ? 'success' : 'warning'} className="uppercase tracking-widest text-[10px] px-3 py-1.5">
                     {order.payment?.status || 'Pending'}
                   </Badge>
                   {order.payment?.reference && (
                      <p className="text-[10px] mt-2 text-gray-400 font-mono">Ref: {order.payment.reference}</p>
                   )}
                </div>
                <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Payment Currency</p>
                   <p className="font-bold text-gray-900">{orderCurrency}</p>
                </div>
                <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Amount Paid</p>
                   <p className="font-black text-gray-900 text-lg">{formatCurrency(order.payment?.amount || order.total, orderCurrency)}</p>
                </div>
             </div>
          </section>

          <section className="bg-[#fffce0] p-10 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100">
             <h2 className="text-xl font-black text-gray-900 mb-8 border-l-4 border-amber-600 pl-4 uppercase tracking-tight">Shipping</h2>
             <div className="space-y-4 text-sm text-gray-600 font-medium leading-relaxed">
                <p>
                   {order.delivery?.fullName}<br/>
                   {order.delivery?.address}<br/>
                   {order.delivery?.city}, {order.delivery?.state}<br/>
                   {order.delivery?.country}
                </p>
                <div className="pt-4 border-t border-gray-50">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Phone</p>
                   <p className="font-bold text-gray-900">{order.delivery?.phone}</p>
                </div>
                <div className="pt-4 border-t border-gray-50">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Zone</p>
                   <p className="font-bold text-gray-900 uppercase">{order.delivery?.zone || 'Standard'}</p>
                </div>
                <div className="pt-4 border-t border-gray-50">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Delivery Fee</p>
                   <p className="font-bold text-gray-900">{formatCurrency(order.deliveryFee, orderCurrency)}</p>
                </div>
                {order.delivery?.notes && (
                  <div className="pt-4 border-t border-gray-50 bg-amber-50/50 p-4 rounded-2xl">
                     <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Customer Note</p>
                     <p className="text-gray-900 font-bold ">&quot;{order.delivery.notes}&quot;</p>
                  </div>
                )}
             </div>
          </section>
        </div>
      </div>
    </div>
  );
}
