'use client';
import { useCartStore } from '@/store/cartStore';

export function CurrencySwitcher({ className = "" }) {
  const { currency, setCurrency } = useCartStore();

  return (
    <div className={`flex items-center gap-1 bg-gray-100 p-1 rounded-full border border-gray-200 ${className}`}>
      <button
        onClick={() => setCurrency('NGN')}
        className={`px-3 py-1 rounded-full text-[10px] font-black transition-all ${
          currency === 'NGN' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'
        }`}
      >
        NGN
      </button>
      <button
        onClick={() => setCurrency('USD')}
        className={`px-3 py-1 rounded-full text-[10px] font-black transition-all ${
          currency === 'USD' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'
        }`}
      >
        USD
      </button>
    </div>
  );
}
