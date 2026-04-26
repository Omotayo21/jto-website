'use client';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { X, Plus, Minus, Trash, ShoppingCart } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
    await new Promise(resolve => setTimeout(resolve, 800));
    router.push('/checkout');
    closeCart();
    setCheckoutLoading(false);
  };

  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity opacity-100 animate-in fade-in" onClick={closeCart} />
      
      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white z-10">
          <h2 className="text-xl font-black serif-font italic text-black">Your Cart</h2>
          <button onClick={closeCart} className="p-2 text-gray-400 hover:text-black rounded-full hover:bg-gray-50 transition-all border border-gray-100">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {!user ? (
            <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in fill-mode-both duration-500">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <p className="text-xl font-black serif-font italic text-black">Sign In Required</p>
              <p className="text-gray-400 mt-3 mb-8 max-w-[250px] text-sm font-medium">Please sign in to view and manage your cart.</p>
              <Link href="/login" onClick={closeCart} className="w-full bg-black text-white h-12 flex items-center justify-center font-black uppercase tracking-widest text-[10px] hover:bg-[#800020] transition-colors">
                 Sign In
              </Link>
            </div>
          ) : items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in fill-mode-both duration-500 delay-100">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100">
                {isLoading ? (
                  <div className="w-8 h-8 border-2 border-transparent border-t-black rounded-full animate-spin" />
                ) : (
                  <ShoppingCart size={36} className="text-gray-300" />
                )}
              </div>
              <p className="text-xl serif-font italic text-black">Your cart is empty</p>
              <p className="text-gray-400 mt-3 mb-8 max-w-[250px] text-sm font-medium">Looks like you haven&apos;t added any products yet.</p>
              <button onClick={closeCart} className="px-8 py-3 bg-black text-white font-black uppercase tracking-widest text-[10px] hover:bg-[#800020] transition-colors">Continue Shopping</button>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item, idx) => (
                <li key={`${item.productId}-${idx}`} className="flex gap-5 group py-2">
                  <div className="relative w-20 h-24 overflow-hidden border border-gray-100 shrink-0 bg-[#f8f8f8]">
                    <img src={item.image || '/placeholder.png'} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 flex flex-col pt-1">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="font-medium text-sm text-black leading-tight line-clamp-2">{item.name}</h3>
                      <button onClick={() => removeItem(item.productId, item.variant)} className="p-1 text-gray-300 hover:text-[#800020] transition-colors">
                        <Trash size={14} />
                      </button>
                    </div>
                    
                    {(item.variant?.color || item.variant?.size) && (
                      <div className="flex gap-3 text-[10px] text-gray-400 mt-1.5 uppercase tracking-wider font-medium">
                        {item.variant?.color && <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full border border-gray-200" style={{ backgroundColor: item.variant.color.hex || 'gray' }} />{item.variant.color.name}</span>}
                        {item.variant?.color && item.variant?.size && <span className="text-gray-200">|</span>}
                        {item.variant?.size && <span>{item.variant.size}</span>}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-auto pt-3">
                      <div className="flex items-center border border-gray-200">
                        <button onClick={() => updateQuantity(item.productId, item.variant, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-black transition-colors"><Minus size={12}/></button>
                        <span className="text-xs font-bold w-7 text-center text-black border-x border-gray-200">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, item.variant, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-black transition-colors"><Plus size={12}/></button>
                      </div>
                      <p className="font-medium text-sm text-black">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-100 p-6 bg-white shrink-0 z-10">
            <div className="flex justify-between items-end mb-6">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Subtotal</span>
              <span className="text-xl font-black text-black">{formatCurrency(total)}</span>
            </div>
            <button 
               onClick={handleCheckout} 
               disabled={checkoutLoading}
               className="flex group w-full justify-center items-center text-center bg-black text-white hover:bg-[#800020] py-4 h-14 font-black uppercase tracking-widest text-[10px] transition-all disabled:opacity-50"
            >
              {checkoutLoading ? (
                <div className="w-5 h-5 border-2 border-transparent border-t-white rounded-full animate-spin" />
              ) : (
                <>Proceed to Checkout <ShoppingCart className="ml-2 w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" /></>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
