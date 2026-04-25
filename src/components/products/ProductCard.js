import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

export function ProductCard({ product }) {
  const thumbnail = product.media?.[0]?.url || product.images?.[0]?.url || '/placeholder.png';
  const outOfStock = Object.values(product.inventory || {}).every(qty => qty === 0);

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
      <div className="space-y-1 text-center">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-black transition-colors">{product.name}</h3>
        <p className="text-sm font-medium serif-font italic">{formatCurrency(product.price, product.currency)}</p>
      </div>
    </Link>
  );
}
