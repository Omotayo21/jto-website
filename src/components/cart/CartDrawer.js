'use client';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { X, Plus, Minus, Trash, ShoppingCart } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, Lock } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function CartDrawer() {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/management-portal');
  const router = useRouter();
  const { user } = useAuthStore();
  const { isOpen, closeCart, items, updateQuantity, removeItem, isLoading } = useCartStore();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  if (!isOpen || isAdminPage) return null;

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    // Add artificial delay for premium loading experience
    await new Promise(resolve => setTimeout(resolve, 800));
    router.push('/checkout');
    closeCart();
    setCheckoutLoading(false);
  };

  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity opacity-100 animate-in fade-in" onClick={closeCart} />
      
      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 rounded-l-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-900">Your Cart</h2>
          <button onClick={closeCart} className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-all bg-gray-50 border border-transparent shadow-sm">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-white/50">
          {!user ? (
            <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in fill-mode-both duration-500">
              <div className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                <Lock size={48} className="text-indigo-400" />
              </div>
              <p className="text-2xl font-black text-gray-900 tracking-tight">Login Required</p>
              <p className="text-gray-500 mt-3 mb-8 max-w-[250px] font-bold">Please sign in to your account to view and manage your cart.</p>
              <Link href="/login" onClick={closeCart} className="w-full bg-indigo-600 text-white h-14 rounded-2xl flex items-center justify-center font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-100 transition-all hover:-translate-y-1">
                 Sign In Now
              </Link>
            </div>
          ) : items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in fill-mode-both duration-500 delay-100">
              <div className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                {isLoading ? <Loader2 className="w-12 h-12 text-indigo-400 animate-spin" /> : <ShoppingCart size={48} className="text-indigo-300" />}
              </div>
              <p className="text-2xl font-semibold text-gray-900 font-display">Your cart is empty</p>
              <p className="text-gray-500 mt-3 mb-8 max-w-[250px]">Looks like you haven&apos;t added any products to your cart yet.</p>
              <Button onClick={closeCart} className="min-w-[200px] h-12 text-base">Continue Shopping</Button>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item, idx) => (
                <li key={`${item.productId}-${idx}`} className="flex gap-5 group py-2">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-gray-100 shrink-0 shadow-sm">
                    <img src={item.image || '/placeholder.png'} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 flex flex-col pt-1">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="font-semibold text-gray-900 leading-tight line-clamp-2">{item.name}</h3>
                      <button onClick={() => removeItem(item.productId, item.variant)} className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100">
                        <Trash size={16} />
                      </button>
                    </div>
                    
                    {(item.variant?.color || item.variant?.size) && (
                      <div className="flex gap-3 text-xs text-gray-500 mt-2 bg-gray-50 self-start px-2 py-1 rounded-md">
                        {item.variant?.color && <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: item.variant.color.hex || 'gray' }} />{item.variant.color.name}</span>}
                        {item.variant?.color && item.variant?.size && <span className="text-gray-300">|</span>}
                        {item.variant?.size && <span className="font-medium text-gray-700">{item.variant.size}</span>}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-auto pt-4">
                      <div className="flex items-center bg-gray-50 rounded-xl p-1 shadow-inner border border-gray-100">
                        <button onClick={() => updateQuantity(item.productId, item.variant, item.quantity - 1)} className="p-1 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all shadow-sm focus:outline-none"><Minus size={14}/></button>
                        <span className="text-sm font-semibold w-8 text-center text-gray-900">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, item.variant, item.quantity + 1)} className="p-1 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all shadow-sm focus:outline-none"><Plus size={14}/></button>
                      </div>
                      <p className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg text-sm">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-100 p-6 bg-white shrink-0 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
            <div className="flex justify-between items-end mb-6">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">{formatCurrency(total)}</span>
            </div>
            <Button 
               onClick={handleCheckout} 
               disabled={checkoutLoading}
               className="flex group w-full justify-center items-center text-center bg-indigo-600 text-white hover:bg-indigo-700 py-4 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-100 transition-all border-none"
            >
              {checkoutLoading ? <Loader2 className="animate-spin" /> : <>Proceed to Checkout <ShoppingCart className="ml-2 w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" /></>}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
