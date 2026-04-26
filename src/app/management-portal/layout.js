'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Package, ShoppingBag, Users, Tag, LayoutDashboard, Truck, Menu, X, ExternalLink, ShieldAlert } from 'lucide-react';
import SecretGate from '@/components/admin/SecretGate';
import { usePathname } from 'next/navigation';
import { logoutAdmin } from '@/lib/actions';

export default function AdminLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/management-portal', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/management-portal/products', label: 'Products', icon: Package },
    { href: '/management-portal/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/management-portal/shipping', label: 'Shipping', icon: Truck },
    { href: '/management-portal/users', label: 'Customers', icon: Users },
    { href: '/management-portal/coupons', label: 'Coupons', icon: Tag },
  ];

  return (
    <SecretGate>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 overflow-x-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
          <Link href="/" className="text-xl font-black    text-black tracking-tighter">
            JTOtheLabel <span className="text-gray-400 text-[10px] uppercase ml-1">Admin</span>
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 bg-gray-50 rounded-xl text-gray-500 hover:text-black transition-all border border-gray-100"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-white border-r border-gray-100 p-8 flex flex-col gap-2 
          transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="hidden lg:block mb-10">
            <Link href="/" className="text-2xl font-black    text-black tracking-tighter">
              JTOtheLabel <span className="block text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">Global Admin Suite</span>
            </Link>
          </div>

          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-4">Management</h2>
          <nav className="flex flex-col gap-1.5 flex-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.href}
                  href={link.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold transition-all duration-200 ${
                    isActive 
                      ? 'bg-black text-white shadow-lg shadow-gray-200' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-black hover:translate-x-1'
                  }`}
                >
                  <link.icon size={20} className={isActive ? 'opacity-100' : 'opacity-60'} /> 
                  <span className="text-sm">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-8 border-t border-gray-50 flex flex-col gap-2">
             <Link href="/" className="flex items-center justify-between gap-4 px-5 py-4 rounded-2xl font-bold text-gray-400 hover:text-black hover:bg-gray-100/50 transition-all group">
                <span className="text-xs uppercase tracking-widest font-black">View Storefront</span>
                <ExternalLink size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
             </Link>
             
             <button 
                onClick={async () => {
                  await logoutAdmin();
                  localStorage.removeItem('admin_gate_key');
                  window.location.reload();
                }}
                className="flex items-center justify-between gap-4 px-5 py-4 rounded-2xl font-bold text-rose-400 hover:text-rose-600 hover:bg-rose-50/50 transition-all group"
             >
                <span className="text-xs uppercase tracking-widest font-black">Lock Dashboard</span>
                <ShieldAlert size={16} className="group-hover:scale-110 transition-transform" />
             </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-12 overflow-x-hidden min-h-screen">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </SecretGate>
  );
}
