import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

export function ProductCard({ product }) {
  const thumbnail = product.media?.[0]?.url || product.images?.[0]?.url || '/placeholder.png';
  const outOfStock = Object.values(product.inventory || {}).every(qty => qty === 0);

  return (
    <Link href={`/products/${product.slug}`} className="group relative block overflow-hidden rounded-3xl bg-white shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-1 hover:border-indigo-100 transition-all duration-300">
      <div className="relative h-72 w-full bg-gray-50 overflow-hidden">
        <img 
          src={thumbnail} 
          alt={product.name} 
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
        />
        {outOfStock && (
           <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
             <Badge variant="danger" className="text-sm px-4 py-1">Out of Stock</Badge>
           </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 leading-tight">{product.name}</h3>
          <p className="text-lg font-bold text-indigo-600 whitespace-nowrap bg-indigo-50 px-2 py-1 rounded-lg">{formatCurrency(product.price, product.currency)}</p>
        </div>
        <p className="mt-2 text-sm text-gray-500 line-clamp-2 leading-relaxed">{product.description}</p>
        {product.comparePrice > product.price && (
          <p className="mt-3 text-sm text-gray-400 line-through">{formatCurrency(product.comparePrice, product.currency)}</p>
        )}
      </div>
    </Link>
  );
}
