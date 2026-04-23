'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { ShoppingCart, Menu, User, LogOut, Search, X, ChevronRight, Package, LayoutDashboard, Heart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { usePathname, useRouter } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isAdminPage = pathname?.startsWith('/management-portal');
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/forgot-password' || pathname?.startsWith('/reset-password');
  
  const { items, openCart, fetchCart } = useCartStore();
  const { user, clearUser } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = async () => {
    clearUser();
    await fetch('/api/auth/logout', { method: 'POST' });
    toast.success('Logged out successfully');
    window.location.href = '/login';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  if (isAuthPage) return null;

  if (isAdminPage) {
    return (
      <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 border-b border-gray-100 shadow-sm lg:hidden">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
            <Link href="/" className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tighter">
              JTOtheLabel <span className="text-gray-400 text-[10px] uppercase ml-1">Admin</span>
            </Link>
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-1" />
               <button onClick={() => window.location.href = '/'} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest px-3 py-2 bg-indigo-50 rounded-lg">Store</button>
            </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 border-b border-gray-100/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 md:h-24">
            {/* Logo & Desktop Nav */}
            <div className="flex items-center gap-10">
              <Link href="/" className="text-2xl md:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tighter">
                JTOtheLabel
              </Link>
              <div className="hidden lg:flex items-center space-x-8">
                <Link href="/products" className="text-gray-500 hover:text-indigo-600 font-bold text-sm uppercase tracking-widest transition-all hover:-translate-y-0.5">Products</Link>
                {/* Admin Link is now always accessible via direct URL or footer, but we hide it from main nav to keep it clean for customers */}
              </div>
            </div>
            
            {/* Action Icons */}
            <div className="flex items-center gap-2 md:gap-5">
              {/* Desktop Search Bar */}
              <form onSubmit={handleSearch} className="hidden md:flex items-center relative group">
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-50 border-gray-100 rounded-full py-2.5 pl-5 pr-10 text-sm font-bold w-48 focus:w-64 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all border outline-none"
                />
                <button type="submit" className="absolute right-3 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                  <Search size={18} />
                </button>
              </form>

              {/* Mobile Search Trigger */}
              <button onClick={() => setIsSearchOpen(true)} className="md:hidden p-3 text-gray-500 hover:text-indigo-600 transition-colors">
                <Search size={22} />
              </button>

              <Link href="/favourites" className="p-3 text-gray-500 hover:text-rose-500 transition-all hover:scale-110">
                <Heart size={24} />
              </Link>

              <button onClick={openCart} className="relative p-3 text-gray-500 hover:text-indigo-600 transition-all hover:scale-110">
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute top-2 right-2 inline-flex items-center justify-center p-2 text-[10px] font-black leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-rose-500 rounded-full border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </button>
              
              {user ? (
                <div className="relative group cursor-pointer hidden md:block">
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 hover:border-indigo-100 hover:bg-white transition-all shadow-sm">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-black">
                       {user.name?.[0] || 'U'}
                    </div>
                    <span className="leading-none font-black text-gray-700 text-xs uppercase tracking-widest">{user.name?.split(' ')[0] || 'Account'}</span>
                  </div>
                  <div className="absolute right-0 top-full pt-4 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-[60]">
                    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                      <div className="p-5 border-b border-gray-50 bg-gray-50/50">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Signed in as</p>
                         <p className="font-bold text-gray-900 truncate text-sm">{user.email}</p>
                      </div>
                      <Link href="/account" className="flex items-center gap-3 px-5 py-4 text-sm font-bold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors group">
                         <User size={18} className="text-gray-400 group-hover:text-indigo-600" /> My Profile
                      </Link>
                      <Link href="/account/orders" className="flex items-center gap-3 px-5 py-4 text-sm font-bold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors group">
                         <Package size={18} className="text-gray-400 group-hover:text-indigo-600" /> Order History
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-4 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors group">
                        <LogOut size={18} className="text-rose-400 group-hover:text-rose-600"/> Sign out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="hidden md:block text-xs font-black uppercase tracking-widest text-white bg-indigo-600 px-8 py-3.5 rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all hover:-translate-y-0.5 active:scale-95">
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-100 transition-all lg:hidden"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[60] bg-white transition-all duration-500 lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full bg-gray-50/50">
          <div className="p-6 flex justify-between items-center bg-white border-b border-gray-100">
            <Link href="/" className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tighter">
              JTOtheLabel
            </Link>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-gray-50 rounded-2xl text-gray-500 shadow-sm border border-gray-100">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <Link href="/products" className="flex items-center justify-between p-6 bg-white rounded-3xl shadow-sm border border-transparent hover:border-indigo-100 transition-all">
                <span className="font-black text-xl text-gray-900">Products</span>
                <ChevronRight className="text-indigo-600" />
             </Link>
             <Link href="/favourites" className="flex items-center justify-between p-6 bg-white rounded-3xl shadow-sm border border-transparent hover:border-rose-100 transition-all">
                <span className="font-black text-xl text-gray-900">Favourites</span>
                <Heart className="text-rose-500" />
             </Link>
             {/* Management link removed from mobile menu to keep customer experience clean. Access via /management-portal direct URL. */}
             
             {!user && (
               <Link href="/login" className="flex items-center justify-between p-6 bg-gray-900 rounded-3xl shadow-xl shadow-gray-200">
                  <span className="font-black text-xl text-white">Sign In</span>
                  <User className="text-indigo-400" />
               </Link>
             )}

             {user && (
               <>
                 <div className="pt-6 pb-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-4">Account</p>
                    <div className="grid grid-cols-2 gap-4">
                       <Link href="/account" className="flex flex-col gap-4 p-6 bg-white rounded-3xl border border-gray-50">
                          <User className="text-indigo-600" />
                          <span className="font-bold text-gray-900">Profile</span>
                       </Link>
                       <Link href="/account/orders" className="flex flex-col gap-4 p-6 bg-white rounded-3xl border border-gray-50">
                          <Package className="text-indigo-600" />
                          <span className="font-bold text-gray-900">Orders</span>
                       </Link>
                    </div>
                 </div>
                 <button onClick={handleLogout} className="w-full p-6 text-rose-600 font-black text-xl flex justify-between items-center bg-rose-50 rounded-3xl">
                    Logout <LogOut />
                 </button>
               </>
             )}
          </div>

          <div className="p-8 border-t border-gray-100 bg-white text-center">
             <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Premium Experience</p>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[70] bg-white/95 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="p-6">
              <div className="flex justify-between items-center mb-10">
                 <h2 className="text-xl font-black text-gray-900">Search Products</h2>
                 <button onClick={() => setIsSearchOpen(false)} className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-indigo-600">
                    <X size={24} />
                 </button>
              </div>
              <form onSubmit={handleSearch} className="relative">
                 <input 
                    autoFocus
                    type="text" 
                    placeholder="What are you looking for?" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-2xl font-black border-b-4 border-gray-100 focus:border-indigo-600 outline-none pb-6 transition-all placeholder:text-gray-200"
                 />
                 <button type="submit" className="absolute right-0 bottom-6 p-4 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-100">
                    <Search size={24} />
                 </button>
              </form>
              <div className="mt-12">
                 <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Popular Suggestions</p>
                 <div className="flex flex-wrap gap-3">
                    {['Classic Hoodie', 'Tech Windbreaker', 'Accessories', 'New Arrivals'].map(tag => (
                      <button key={tag} onClick={() => { setSearchQuery(tag); router.push(`/search?q=${tag}`); setIsSearchOpen(false); }} className="px-5 py-3 bg-gray-50 rounded-xl text-sm font-bold text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-gray-100">{tag}</button>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}
    </>
  );
}
