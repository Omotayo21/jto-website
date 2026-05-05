import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { notFound } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { OrderStatusTracker } from '@/components/orders/OrderStatusTracker';
import { CartClearer } from '@/components/cart/CartClearer';

export default async function OrderConfirmationPage({ params }) {
  const { id } = params;
  
  await connectDB();
  const orderDoc = await Order.findOne({
    $or: [
      { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
      { orderNumber: id }
    ]
  });
  if (!orderDoc) return notFound();
  
  const order = JSON.parse(JSON.stringify(orderDoc));

  return (
    <div className="max-w-4xl mx-auto mt-20 bg-[#FFFCE0] p-16 rounded-[3rem] shadow-2xl shadow-emerald-200/20 border border-emerald-50 text-center">
      <CartClearer />
      <div className="w-28 h-28 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-xl shadow-emerald-200">
        <CheckCircle2 size={56} className="animate-in zoom-in duration-500 delay-200" />
      </div>
      
      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Payment Successful!</h1>
      <p className="text-lg text-gray-500 mb-12 max-w-xl mx-auto">Thank you for your order. We are processing it now and have sent an email confirmation.</p>
      
      <div className="bg-gray-50 rounded-[2.5rem] p-10 text-left mb-12 border border-gray-100 shadow-inner">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="font-bold text-gray-900 text-xl border-b pb-4">Order Summary</h3>
            <div className="grid grid-cols-2 gap-y-4 text-sm font-medium">
              <p className="text-gray-500">Order Number:</p>
              <p className="font-bold text-gray-900 text-right">#{order.orderNumber}</p>
              <p className="text-gray-500">Amount Paid:</p>
              <p className="font-bold text-emerald-600 text-right text-lg">NGN {order.total.toLocaleString()}</p>
              <p className="text-gray-500">Date:</p>
              <p className="font-bold text-gray-900 text-right">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="font-bold text-gray-900 text-xl border-b pb-4">Shipping To</h3>
            <div className="text-sm font-medium text-gray-600 leading-relaxed">
               <p className="font-bold text-gray-900 mb-1">{order.delivery?.fullName}</p>
               <p>{order.delivery?.address}</p>
               <p>{order.delivery?.city}, {order.delivery?.state}</p>
               <p>{order.delivery?.country}</p>
               <p className="mt-2 text-indigo-600">{order.delivery?.phone}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <h3 className="font-bold text-gray-900 text-2xl mb-8">Order Status Tracking</h3>
        <OrderStatusTracker status={order.status} history={order.statusHistory} />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/account/orders" className="bg-gray-900 text-white font-bold py-5 px-10 rounded-2xl shadow-xl hover:bg-black transition-all hover:-translate-y-1">
          My Order History
        </Link>
        <Link href="/products" className="bg-white text-gray-900 border-2 border-gray-100 font-bold py-5 px-10 rounded-2xl shadow-lg hover:bg-gray-50 transition-all hover:-translate-y-1">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
