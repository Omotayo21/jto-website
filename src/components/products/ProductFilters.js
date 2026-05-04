'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, SlidersHorizontal, ChevronDown } from 'lucide-react';

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  
  // Local state for filters
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '-createdAt');

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (minPrice) params.set('minPrice', minPrice);
    else params.delete('minPrice');
    
    if (maxPrice) params.set('maxPrice', maxPrice);
    else params.delete('maxPrice');
    
    if (sort) params.set('sort', sort);
    else params.delete('sort');
    
    router.push(`/products?${params.toString()}`);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSort('-createdAt');
    router.push('/products');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-6">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.15em] hover:text-[#DAA520] transition-colors"
        >
          <SlidersHorizontal size={14} />
          Filters {(minPrice || maxPrice) && <span className="w-2 h-2 bg-[#DAA520] rounded-full" />}
        </button>

        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.15em] text-gray-500">
          Sort by:
          <select 
            value={sort}
            onChange={(e) => {
              const val = e.target.value;
              setSort(val);
              const params = new URLSearchParams(searchParams.toString());
              params.set('sort', val);
              router.push(`/products?${params.toString()}`);
            }}
            className="bg-transparent text-black font-black outline-none cursor-pointer appearance-none pr-4"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'10\' height=\'10\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2.5\' %3E%3Cpolyline points=\'6 9 12 15 18 9\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right center' }}
          >
            <option value="-createdAt">Newest First</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Filter Dropdown/Drawer */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-4 w-72 bg-[#FFFCE0] border border-gray-100 shadow-2xl z-50 p-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Filter Options</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-black">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">Price Range (NGN)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full h-10 border border-gray-100 bg-gray-50 px-3 text-xs font-bold focus:border-black outline-none transition-all"
                  />
                  <div className="w-2 h-[1px] bg-gray-300" />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full h-10 border border-gray-100 bg-gray-50 px-3 text-xs font-bold focus:border-black outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-2">
                <button 
                  onClick={applyFilters}
                  className="w-full h-12 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#DAA520] transition-colors"
                >
                  Apply Filters
                </button>
                <button 
                  onClick={clearFilters}
                  className="w-full h-12 border border-gray-100 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

