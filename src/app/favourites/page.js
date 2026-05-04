'use client';
import { useState, useEffect } from 'react';
import { Heart, Loader2, ShoppingBag } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

export default function FavouritesPage() {
  const { user } = useAuthStore();
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const res = await fetch('/api/favourites');
        const data = await res.json();
        if (data.success) {
          setFavourites(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch favourites');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchFavourites();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="relative w-10 h-10 mb-4">
          <div className="absolute inset-0 border-2 border-gray-200 rounded-full" />
          <div className="absolute inset-0 border-2 border-transparent border-t-black rounded-full animate-spin" />
        </div>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 animate-pulse">Loading</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 animate-in fade-in zoom-in-95 duration-700">
        <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-6 text-rose-500 shadow-inner">
          <Heart size={40} className="fill-current" />
        </div>
        <h1 className="text-3xl serif-font italic text-gray-900 tracking-tight mb-4">Login Required</h1>
        <p className="text-gray-500 font-bold mb-8 max-w-sm leading-relaxed">Please sign in to view and manage your favorited items across all your devices.</p>
        <Link href="/login" className="bg-black text-white h-14 px-10 rounded-2xl flex items-center justify-center font-black uppercase tracking-widest text-[10px] shadow-xl shadow-gray-200 transition-all hover:bg-[#DAA520] hover:-translate-y-1 active:scale-95">
           Sign In Now
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-1000">
      <div className="mb-12">
        <h1 className="text-4xl serif-font italic text-gray-900 tracking-tight flex items-center gap-4">
          <Heart className="text-[#DAA520] fill-current" size={32} /> Your Favourites
        </h1>
        <p className="text-gray-500 font-bold mt-2">All the items you&apos;ve fallen in love with</p>
      </div>

      {favourites.length === 0 ? (
        <div className="bg-[#FFFCE0] rounded-[3rem] p-16 text-center border border-gray-100 shadow-2xl shadow-gray-50 flex flex-col items-center max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mb-8 text-gray-300">
             <Heart size={32} />
          </div>
          <h2 className="text-2xl serif-font italic text-gray-900 mb-4 tracking-tight">Your collection is empty</h2>
          <p className="text-gray-500 font-bold mb-10 leading-relaxed">Start exploring our premium collection and save the items you like for later.</p>
          <Link href="/products" className="bg-black text-white h-14 px-10 rounded-2xl flex items-center justify-center font-black uppercase tracking-widest text-[10px] shadow-xl shadow-gray-200 transition-all hover:bg-[#DAA520] hover:-translate-y-1 active:scale-95">
             <ShoppingBag className="mr-2" size={16} /> Explore Collection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {favourites.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

