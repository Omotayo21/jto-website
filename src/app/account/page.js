'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { OrderStatusTracker } from '@/components/orders/OrderStatusTracker';
import { formatCurrency } from '@/lib/utils';
import { Loader2, Package } from 'lucide-react';

import { ProductCard } from '@/components/products/ProductCard';

const NAV_TABS = ['Overview', 'Orders', 'Favorites'];

export default function AccountPage() {
  const { user, setUser } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Overview');
  const [loggingOut, setLoggingOut] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  useEffect(() => {
    if (user && activeTab === 'Orders') {
      fetchOrders();
    }
    if (user && (activeTab === 'Favorites' || activeTab === 'Overview')) {
      fetchFavorites();
    }
  }, [user, activeTab]);

  const fetchFavorites = async () => {
    if (favorites.length > 0) return; // already fetched
    setLoadingFavorites(true);
    try {
      const res = await fetch('/api/favourites');
      const data = await res.json();
      if (data.success) {
        setFavorites(data.data);
      }
    } catch {
      // Handle error silently
    } finally {
      setLoadingFavorites(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch(`/api/orders?userId=${user._id || user.id}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      toast.success('Signed out successfully.');
      router.push('/');
    } catch {
      toast.error('Sign out failed.');
    } finally {
      setLoggingOut(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
        <h2 className="text-3xl serif-font italic text-center">Your Account</h2>
        <p className="text-sm text-gray-500 text-center max-w-xs">
          Sign in to access your profile, orders, and wishlist.
        </p>
        <Link
          href="/login"
          className="px-10 py-4 bg-black text-white rounded-none text-xs font-black uppercase tracking-widest hover:bg-[#800020] transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'JT';

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      {/* ── Hero Banner ── */}
      <div className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.03) 4px, rgba(255,255,255,0.03) 8px)'
          }} />
        </div>
        <div className="max-w-[1440px] mx-auto px-8 md:px-12 py-16 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-8">
            {/* Avatar */}
            <div className="w-24 h-24 bg-[#800020] flex items-center justify-center shrink-0 border-4 border-white/10 rounded-none">
              <span className="text-2xl font-black text-white serif-font">{initials}</span>
            </div>

            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-2">Member since {new Date().getFullYear()}</p>
              <h1 className="text-3xl md:text-4xl font-black serif-font italic">{user.name || 'Valued Customer'}</h1>
              <p className="text-sm text-white/50 mt-1">{user.email}</p>
            </div>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors border border-white/10 px-5 py-3 hover:border-white/30 disabled:opacity-40"
            >
              {loggingOut ? 'Signing out…' : 'Sign Out'}
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-8 mt-10 border-t border-white/10 pt-6">
            {NAV_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[11px] font-black uppercase tracking-[0.2em] pb-2 border-b-2 transition-all ${
                  activeTab === tab
                    ? 'border-white text-white'
                    : 'border-transparent text-white/40 hover:text-white/70'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content Area ── */}
      <div className="max-w-[1440px] mx-auto px-8 md:px-12 py-12">

        {/* Overview */}
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quick stat cards */}
            {[
              { label: 'Total Orders', value: orders.length || '—', icon: '📦' },
              { label: 'Saved Favorites', value: favorites.length || '0', icon: '♡' },
            ].map(card => (
              <div key={card.label} className="bg-white p-8 border border-gray-200">
                <span className="text-2xl block mb-4">{card.icon}</span>
                <p className="text-3xl font-black serif-font italic mb-1">{card.value}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{card.label}</p>
              </div>
            ))}

            {/* Account Details Card */}
            <div className="md:col-span-2 bg-white border border-gray-200 p-8">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Account Details</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Full Name</p>
                    <p className="text-sm font-medium text-black">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Email Address</p>
                    <p className="text-sm font-medium text-black">{user.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders */}
        {activeTab === 'Orders' && (
          <div className="bg-white border border-gray-200">
            <div className="p-8 border-b border-gray-200">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Order History</h2>
            </div>
            
            {loadingOrders ? (
              <div className="p-20 flex justify-center">
                <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="p-16 text-center">
                <p className="text-3xl serif-font italic text-gray-300 mb-3">No orders yet</p>
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-8 font-black">Your order history will appear here</p>
                <Link
                  href="/products"
                  className="inline-block px-10 py-4 bg-black text-white rounded-none text-xs font-black uppercase tracking-widest hover:bg-[#800020] transition-colors"
                >
                  Shop the Collection
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {orders.map(order => (
                  <div key={order._id} className="p-8">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
                      <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Order Placed</p>
                        <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total</p>
                        <p className="font-bold">{formatCurrency(order.total)}</p>
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Order #</p>
                        <p className="font-bold">{order.orderNumber}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-3 py-1 bg-gray-100 text-black text-[10px] font-black uppercase tracking-widest">
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#fafaf9] p-6 border border-gray-100 mb-8">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Items Summary</h4>
                      <div className="space-y-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4">
                            <div className="w-12 h-16 bg-gray-200 shrink-0">
                              <img src={item.image || item.product?.media?.[0]?.url || '/placeholder.png'} className="w-full h-full object-cover" alt={item.name} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold line-clamp-1">{item.name}</p>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                Qty: {item.quantity} {item.variant?.size && `| Size: ${item.variant.size}`}
                              </p>
                            </div>
                            <p className="text-sm font-medium">{formatCurrency(item.price)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Order Status</h4>
                      <OrderStatusTracker status={order.status} history={order.statusHistory} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Favorites */}
        {activeTab === 'Favorites' && (
          <div className="bg-white border border-gray-200">
            <div className="p-8 border-b border-gray-200">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Saved Favorites</h2>
            </div>
            
            {loadingFavorites ? (
              <div className="p-20 flex justify-center">
                <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
              </div>
            ) : favorites.length === 0 ? (
              <div className="p-16 text-center">
                <p className="text-3xl serif-font italic text-gray-300 mb-3">Your favorites list is empty</p>
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-8 font-black">Save pieces you love to revisit later</p>
                <Link
                  href="/products"
                  className="inline-block px-10 py-4 bg-black text-white rounded-none text-xs font-black uppercase tracking-widest hover:bg-[#800020] transition-colors"
                >
                  Explore the Collection
                </Link>
              </div>
            ) : (
              <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {favorites.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
