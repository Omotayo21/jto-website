'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop',
    title: 'The Modern Silhouette',
    subtitle: 'Limited Edition Collection'
  },
  {
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2076&auto=format&fit=crop',
    title: 'Wearable Art',
    subtitle: 'That Commands Attention'
  },
  {
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop',
    title: 'Pure Elegance',
    subtitle: 'Discover Premium Essentials'
  }
];

export function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setCurrent(c => (c + 1) % SLIDES.length);

  return (
    <section className="relative h-[90vh] w-full overflow-hidden">
      {SLIDES.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="absolute inset-0 bg-black/25 z-10" />
          <img
            src={slide.image}
            alt={slide.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center px-6">
            <p className="text-xs font-medium uppercase tracking-[0.4em] mb-4 opacity-90">
              {slide.subtitle}
            </p>
            <h1 className="text-5xl md:text-7xl serif-font italic mb-10 leading-tight">
              {slide.title}
            </h1>
            <Link
              href="/products"
              className="px-12 py-4 border border-white text-white uppercase text-[10px] font-bold tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-500"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      ))}

      {/* Arrow Buttons — bottom right, grouped in a pill like imad-eduso */}
      <div className="absolute bottom-10 right-12 z-30 flex items-center gap-1">
        <button
          onClick={prev}
          className="w-10 h-10 bg-white/20 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 rounded-full"
          aria-label="Previous slide"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button
          onClick={next}
          className="w-10 h-10 bg-white/20 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 rounded-full"
          aria-label="Next slide"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>

        {/* Dot indicators right next to arrows */}
        <div className="flex gap-1.5 ml-3">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`rounded-full transition-all duration-500 ${idx === current ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
