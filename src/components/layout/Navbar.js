'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useCurrencyStore } from '@/store/currencyStore';
import { useAuthStore } from '@/store/authStore';
import { usePathname, useRouter } from 'next/navigation';

/* ─── Search Overlay ─── */
function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  if (!isOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[300] bg-[#FFFCE0] animate-in fade-in duration-300 flex flex-col">
      <div className="flex justify-between items-center p-8 border-b border-gray-100">
        <span className="text-xl font-black  uppercase tracking-tighter">Search</span>
        <button onClick={onClose} className="p-2 hover:opacity-60 transition-opacity">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <form onSubmit={handleSearch} className="w-full max-w-2xl relative">
          <input 
            autoFocus
            type="text" 
            placeholder="WHAT ARE YOU LOOKING FOR?" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border-b-2 border-black text-2xl md:text-4xl py-4 bg-transparent outline-none font-black   placeholder:text-gray-300 text-black"
          />
          <button type="submit" className="absolute right-0 bottom-6 text-black hover:opacity-60 transition-opacity">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

const SHOP_CATEGORIES = [
  { label: 'Dresses', href: '/products?category=dresses', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80&auto=format&fit=crop' },
  { label: 'Jackets', href: '/products?category=jackets', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80&auto=format&fit=crop' },
  { label: 'Sets', href: '/products?category=sets', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80&auto=format&fit=crop' },
  { label: 'Shorts', href: '/products?category=shorts', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&q=80&auto=format&fit=crop' },
  { label: 'T-Shirts', href: '/products?category=tshirts', image: 'https://images.unsplash.com/photo-1521577352947-9bb58764b69a?w=400&q=80&auto=format&fit=crop' },
  { label: 'All Products', href: '/products', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80&auto=format&fit=crop' },
];

const SALE_COLLECTIONS = [
  { label: 'Audacious Blacks', href: '/products?category=black', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80&auto=format&fit=crop' },
  { label: 'Best Sellers', href: '/products?category=bestsellers', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80&auto=format&fit=crop' },
  { label: 'Wedding Guest', href: '/products?category=wedding', image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&q=80&auto=format&fit=crop' },
  { label: 'Work Wear', href: '/products?category=workwear', image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&q=80&auto=format&fit=crop' },
   { label: 'Sets', href: '/products?category=sets', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80&auto=format&fit=crop' },
  { label: 'Dresses', href: '/products?category=dresses', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80&auto=format&fit=crop' },
];

const NAV_ITEMS = [
  { label: 'New In', href: '/products?category=new' },
  { label: 'Shop', href: '/products', megaMenu: 'shop' },
  { label: 'Kids', href: '/products?category=kids' },
  { label: 'Gift Card', href: '#' },
  { label: 'SALE', href: '/products?category=sale', sale: false, megaMenu: 'sale' },
];

/* ─── Mega Menu for Shop ─── */
function ShopMegaMenu({ onClose }) {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 bg-white shadow-2xl border border-gray-100 z-[200] w-[90vw] max-w-[900px]">
      <div className="p-8">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">Shop by Category</p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {SHOP_CATEGORIES.map(cat => (
            <Link
              key={cat.label}
              href={cat.href}
              onClick={onClose}
              className="group block text-center"
            >
              <div className="aspect-[3/4] w-full bg-[#f8f8f8] overflow-hidden mb-3">
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-600 group-hover:text-[#DAA520] transition-colors">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Mega Menu for Sale ─── */
function SaleMegaMenu({ onClose }) {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 bg-white shadow-2xl border border-gray-100 z-[200] w-[90vw] max-w-[700px]">
      <div className="p-8">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#DAA520] mb-6">Sale Collections</p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {SALE_COLLECTIONS.map(col => (
            <Link
              key={col.label}
              href={col.href}
              onClick={onClose}
              className="group block text-center"
            >
              <div className="aspect-[3/4] w-full bg-[#f8f8f8] overflow-hidden mb-3">
                <img
                  src={col.image}
                  alt={col.label}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-600 group-hover:text-[#DAA520] transition-colors">
                {col.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Nav Item (with dropdown or mega menu) ─── */
function DropdownItem({ item, isTransparent }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Simple link (no dropdown or mega menu)
  if (!item.dropdown && !item.megaMenu) {
    return (
      <Link
        href={item.href}
        className={`text-[11px] font-medium uppercase tracking-[0.15em] hover:text-[#DAA520] transition-colors whitespace-nowrap ${
          item.sale ? 'text-[#DAA520] font-bold' : 'text-black'
        }`}
      >
        {item.label}
      </Link>
    );
  }

  // Mega Menu
  if (item.megaMenu) {
    return (
      <div
        ref={ref}
        className="relative static"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <button
          className={`flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.15em] hover:text-[#DAA520] transition-colors whitespace-nowrap ${
            item.sale ? 'text-[#DAA520] font-bold' : 'text-black'
          }`}
          onClick={() => setOpen(o => !o)}
        >
          {item.label}
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {open && (
          item.megaMenu === 'shop'
            ? <ShopMegaMenu onClose={() => setOpen(false)} />
            : <SaleMegaMenu onClose={() => setOpen(false)} />
        )}
      </div>
    );
  }

  // Regular dropdown
  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.15em] hover:text-[#DAA520] transition-colors whitespace-nowrap text-black"
        onClick={() => setOpen(o => !o)}
      >
        {item.label}
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-3 bg-white shadow-xl border border-gray-100 min-w-[200px] z-[200] py-3">
          {item.dropdown.map(sub => (
            <Link
              key={sub.label}
              href={sub.href}
              className="block px-6 py-2.5 text-sm text-gray-700 hover:text-[#DAA520] hover:bg-gray-50 transition-colors tracking-wide"
              onClick={() => setOpen(false)}
            >
              {sub.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/management-portal');
  const isAuthPage =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname?.startsWith('/reset-password');

  const { items, openCart, fetchCart } = useCartStore();
  const { user } = useAuthStore();
  const currency = useCurrencyStore((s) => s.currency);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (user) fetchCart();
  }, [user, fetchCart]);


  if (isAdminPage) {
    return (
      <nav className="sticky top-0 z-40 w-full bg-[#FFFCE0] border-b border-gray-100 lg:hidden">
        <div className="px-6 h-16 flex justify-between items-center">
          
          <Link href="/" className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-black text-white rounded-full">
            Store
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* ── ANNOUNCEMENT BAR ── */}
      <div className="w-full bg-[#FFDA03] text-black text-center py-2.5  flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest">
        <span>{currency === 'USD' ? 'Free Shipping on Orders $250+' : 'Free Shipping on Orders ₦350,000+'}</span>
        <span>→</span>
      </div>

      {/* ── MAIN NAVBAR ── */}
      <nav
        className={`sticky top-0 left-0 right-0 z-50 w-full bg-[#FFDA03] text-black transition-all duration-300 border-b border-black/10 ${
          isScrolled ? 'shadow-md' : ''
        }`}
      >
        {/* Row 1: Search / Logo / Icons */}
        <div className="bg-white">
          <div className="max-w-[1440px] mx-auto px-8 flex items-center justify-between h-16">
          {/* Left — Brand Logo */}
          <Link
            href="/"
            className="text-2xl md:text-3xl font-black tracking-tighter poppins-font uppercase select-none"
          >
         <img src='/without text.png' alt='logo' className='w-[60px] md:w-[60px] h-[60px] md:h-[60px] ' />
          </Link>
          
            <div className='flex  flex-col items-center'>
              <h1 className='font-black md:block hidden md:text-[30px] uppercase -pl-20'>JTOtheLabel</h1>
            </div>
            
          {/* Right — Search + Account + Cart */}
          <div className="flex items-center gap-5">
            <button onClick={() => setIsSearchOpen(true)} className="p-1 hover:opacity-60 transition-opacity" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>

            <Link
              href={user ? '/account' : '/login'}
              className="hidden md:block hover:opacity-60 transition-opacity"
              aria-label="Account"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>

            <button
              onClick={openCart}
              className="relative hover:opacity-60 transition-opacity"
              aria-label="Cart"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-black text-white text-[8px] font-black flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className="md:hidden p-1 hover:opacity-60 transition-opacity"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>

        {/* Row 2: Navigation Links (desktop only) */}
        <div className="hidden md:block border-t border-black/10">
          <div className="max-w-[1440px] mx-auto px-8 flex items-center justify-center gap-8 h-11">
            {NAV_ITEMS.map(item => (
              <DropdownItem key={item.label} item={item} />
            ))}
          </div>
        </div>
      </nav>

      {/* ── MOBILE MENU OVERLAY ── */}
      <div
        className={`fixed inset-0 z-[100] bg-white transition-transform duration-500 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-12">
             <img src='/without text.png' alt='logo' className='w-[60px] h-[60px] -mt-2' />
            <div className="flex items-center gap-3">
              {/* Profile icon in mobile sidebar */}
              <Link
                href={user ? '/account' : '/login'}
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 hover:opacity-60 transition-opacity"
                aria-label="Account"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu" className="p-1 hover:opacity-60">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-0 flex-1">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-2xl font-black poppins-font uppercase tracking-tighter border-b border-gray-100 py-5 ${
                  item.sale ? 'text-black' : 'text-black'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="pt-8 border-t border-gray-100 flex flex-col gap-4 mt-8">
            <Link href={user ? '/account' : '/login'} className="text-xs font-bold uppercase tracking-[0.2em]">
              {user ? 'My Account' : 'Sign In'}
            </Link>
          </div>
        </div>
      </div>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

