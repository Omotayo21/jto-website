'use client';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

const NAV_TABS = ['Overview', 'Orders', 'Wishlist', 'Settings'];

export default function AccountPage() {
  const { user, setUser } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Overview');
  const [loggingOut, setLoggingOut] = useState(false);

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
          className="px-10 py-4 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#800020] transition-colors"
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
          {/* subtle texture pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.03) 4px, rgba(255,255,255,0.03) 8px)'
          }} />
        </div>
        <div className="max-w-[1440px] mx-auto px-8 md:px-12 py-16 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-8">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-[#800020] flex items-center justify-center shrink-0 border-4 border-white/10">
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
              className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors border border-white/10 px-5 py-3 rounded-full hover:border-white/30 disabled:opacity-40"
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
              { label: 'Total Orders', value: '—', icon: '📦' },
              { label: 'Wishlist Items', value: '—', icon: '♡' },
              { label: 'Loyalty Points', value: '0 pts', icon: '✦' },
            ].map(card => (
              <div key={card.label} className="bg-white p-8 border border-gray-100">
                <span className="text-2xl block mb-4">{card.icon}</span>
                <p className="text-3xl font-black serif-font italic mb-1">{card.value}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{card.label}</p>
              </div>
            ))}

            {/* Account Details Card */}
            <div className="md:col-span-3 bg-white border border-gray-100 p-8">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Account Details</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-1">Full Name</p>
                    <p className="text-sm font-medium text-black">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-1">Email Address</p>
                    <p className="text-sm font-medium text-black">{user.email}</p>
                  </div>
                </div>
                <div className="flex flex-col justify-end">
                  <Link
                    href="/account?tab=settings"
                    className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors border-b border-gray-200 pb-1 w-fit"
                  >
                    Edit Profile →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders */}
        {activeTab === 'Orders' && (
          <div className="bg-white border border-gray-100">
            <div className="p-8 border-b border-gray-100">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Order History</h2>
            </div>
            <div className="p-16 text-center">
              <p className="text-3xl serif-font italic text-gray-200 mb-3">No orders yet</p>
              <p className="text-xs uppercase tracking-widest text-gray-300 mb-8 font-black">Your order history will appear here</p>
              <Link
                href="/products"
                className="inline-block px-10 py-4 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#800020] transition-colors"
              >
                Shop the Collection
              </Link>
            </div>
          </div>
        )}

        {/* Wishlist */}
        {activeTab === 'Wishlist' && (
          <div className="bg-white border border-gray-100">
            <div className="p-8 border-b border-gray-100">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Saved Pieces</h2>
            </div>
            <div className="p-16 text-center">
              <p className="text-3xl serif-font italic text-gray-200 mb-3">Your wishlist is empty</p>
              <p className="text-xs uppercase tracking-widest text-gray-300 mb-8 font-black">Save pieces you love to revisit later</p>
              <Link
                href="/products"
                className="inline-block px-10 py-4 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#800020] transition-colors"
              >
                Explore the Collection
              </Link>
            </div>
          </div>
        )}

        {/* Settings */}
        {activeTab === 'Settings' && (
          <div className="max-w-lg space-y-8">
            <div className="bg-white border border-gray-100 p-8">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-8">Profile Information</h3>
              <div className="space-y-6">
                {[
                  { label: 'Full Name', value: user.name, type: 'text' },
                  { label: 'Email Address', value: user.email, type: 'email' },
                ].map(field => (
                  <div key={field.label} className="border-b border-gray-200 focus-within:border-black transition-colors">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{field.label}</label>
                    <input
                      type={field.type}
                      defaultValue={field.value}
                      className="w-full bg-transparent py-3 text-sm text-black outline-none"
                    />
                  </div>
                ))}
                <button
                  className="w-full py-4 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#800020] transition-colors mt-4"
                  onClick={() => toast.success('Profile updated!')}
                >
                  Save Changes
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-100 p-8">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Danger Zone</h3>
              <button
                onClick={handleLogout}
                className="text-[10px] font-black uppercase tracking-widest text-[#800020] border border-[#800020]/20 px-6 py-3 hover:bg-[#800020] hover:text-white transition-all rounded-full"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
