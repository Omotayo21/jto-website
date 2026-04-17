'use client';
import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { openCart } = useCartStore();
  const router = useRouter();
  
  useEffect(() => {
    openCart();
    router.replace('/');
  }, []);

  return null;
}
