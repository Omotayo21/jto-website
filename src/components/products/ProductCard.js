"use client"
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { useCurrencyStore } from '@/store/currencyStore';

function StarRating({ average = 0, count = 0, light = false }) {
  return (
    <div className="flex items-center gap-1.5 justify-center">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <svg
            key={star}
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill={average >= star ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.5"
            className={average >= star ? 'text-amber-400' : (light ? 'text-white/20' : 'text-gray-200')}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>
      {count > 0 && (
        <span className={`text-[9px] font-medium ${light ? 'text-white/50' : 'text-gray-400'}`}>({count})</span>
      )}
    </div>
  );
}

export function ProductCard({ product, light = false }) {
  const currency = useCurrencyStore((s) => s.currency);
  const thumbnail = product.media?.[0]?.url || product.images?.[0]?.url || '/placeholder.png';
  const outOfStock = Object.values(product.inventory || {}).every(qty => qty === 0);
  const colors = product.variants?.colors || [];

  const displayPrice = currency === 'USD' && product.priceUSD ? product.priceUSD : product.price;
  const displayCurrency = currency === 'USD' && product.priceUSD ? 'USD' : 'NGN';

  return (
    <Link href={`/products/${product.slug}`} className="group block mb-12">
      <div className="relative aspect-[3/4] w-full bg-[#f8f8f8] overflow-hidden mb-6">
        <img 
          src={thumbnail} 
          alt={product.name} 
          className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
        />
        {outOfStock && (
           <div className="absolute top-4 left-4">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-black text-white px-3 py-1.5">Out of Stock</span>
           </div>
        )}
      </div>
      <div className="space-y-2 text-center">
        <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
          light ? 'text-white/60 group-hover:text-white' : 'text-gray-400 group-hover:text-black'
        }`}>
          {product.name}
        </h3>
        <p className={`text-sm font-medium serif-font italic ${light ? 'text-white' : 'text-black'}`}>
          {formatCurrency(displayPrice, displayCurrency)}
        </p>

        {/* Star Rating */}
        <StarRating average={product.ratings?.average || 0} count={product.ratings?.count || 0} light={light} />

        {/* Color Swatches */}
        {colors.length > 0 && (
          <div className="flex items-center justify-center gap-1.5 pt-1">
            {colors.map(c => (
              <span
                key={c.name}
                className={`w-3.5 h-3.5 rounded-full border ${light ? 'border-white/20' : 'border-gray-200'}`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
