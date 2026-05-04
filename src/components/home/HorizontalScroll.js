'use client';
import { useRef } from 'react';
import { ProductCard } from '@/components/products/ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function HorizontalScroll({ products, title }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="py-24 bg-[#DAA520] text-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-8 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl serif-font italic mb-6">Client Favourites</h2>
          <div className="w-20 h-[1px] bg-[#FFFCE0]/30 mx-auto" />
        </div>

        <div className="relative group">
          <div 
            ref={scrollRef}
            className="flex gap-4 md:gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-12"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => (
              <div key={product._id} className="min-w-[280px] md:min-w-[380px] snap-start">
                <div className="bg-[#FFFCE0] p-4 md:p-8 text-black">
                  <ProductCard product={product} />
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/10 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-black transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/10 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-black transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {products.slice(0, 5).map((_, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-[#FFFCE0]' : 'bg-[#FFFCE0]/30'}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
