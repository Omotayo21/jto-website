'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search as SearchIcon, ArrowLeft, Loader2, Package, ChevronRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      setLoading(true);
      fetch(`/api/products/search?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setResults(data.data);
          setLoading(false);
        });
    }
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 md:py-20 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
           <Link href="/products" className="inline-flex items-center gap-2 text-xs font-black text-indigo-600 uppercase tracking-widest mb-6 hover:-translate-x-2 transition-transform">
             <ArrowLeft size={16} /> Back to Catalog
           </Link>
           <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Search Results</h1>
           <p className="text-gray-500 font-bold mt-4">Showing results for <span className="text-indigo-600">&quot;{query}&quot;</span></p>
        </div>
        <div className="px-8 py-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
           <SearchIcon className="text-indigo-600" size={20} />
           <span className="text-sm font-black text-gray-600 uppercase tracking-widest">{results.length} Matches Found</span>
        </div>
      </div>

      {loading ? (
        <div className="py-40 text-center flex flex-col items-center gap-6">
           <Loader2 className="animate-spin text-indigo-600" size={48} />
           <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Hunting for the best products...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
          {results.map((product) => (
            <Link 
               href={`/products/${product.slug}`} 
               key={product._id || product.id}
               className="group bg-[#FFFCE0] rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl hover:shadow-indigo-100 hover:-translate-y-2 transition-all duration-500 flex flex-col"
            >
              <div className="aspect-[4/5] relative overflow-hidden bg-gray-50">
                 <img 
                    src={product.media?.[0]?.url || product.images?.[0]?.url || '/placeholder.png'} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                 />
                 <div className="absolute top-6 left-6">
                    <span className="bg-[#FFFCE0]/90 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                       {typeof product.category === 'object' ? product.category?.name : product.category}
                    </span>
                 </div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                 <h3 className="text-lg font-black text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{product.name}</h3>
                 <p className="text-xs text-gray-400 font-bold mt-2 line-clamp-2 leading-relaxed">{product.description}</p>
                 <div className="mt-auto pt-8 flex justify-between items-center">
                    <span className="text-2xl font-black text-gray-900">{formatCurrency(product.price)}</span>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                       <ChevronRight size={20} />
                    </div>
                 </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-40 bg-[#FFFCE0] rounded-[3rem] border border-gray-50 text-center flex flex-col items-center gap-8 shadow-xl shadow-gray-100/50">
           <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-200">
              <Package size={48} />
           </div>
           <div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">No matches found</h3>
              <p className="text-gray-400 font-bold max-w-xs mx-auto">We couldn&apos;t find anything matching your search. Try adjusting your query or keywords.</p>
           </div>
           <Link href="/products" className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200">
              Browse All Products
           </Link>
        </div>
      )}
    </div>
  );
}
