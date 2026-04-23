'use client';
import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';

export function CartClearer() {
  const { clearCart } = useCartStore();

  useEffect(() => {
    // Only clear the local state, the backend was already cleared by the verify API
    // We call a simpler clear to avoid another DELETE request if possible, 
    // but the store's clearCart is fine too.
    const resetCart = async () => {
       // We just want to clear the local items
       // The store's clearCart also hits DELETE /api/cart which is fine/safe
       await clearCart();
    };
    resetCart();
  }, [clearCart]);

  return null;
}
