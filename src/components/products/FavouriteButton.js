'use client';
import { useState, useEffect } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-hot-toast';

export function FavouriteButton({ productId }) {
  const { user, toggleFavourite } = useAuthStore();
  const [isFavourite, setIsFavourite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.favourites) {
      setIsFavourite(user.favourites.includes(productId));
    }
  }, [user, productId]);

  const handleToggle = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to add to favourites');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/favourites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
      
      const data = await res.json();
      if (data.success) {
        toggleFavourite(productId); 
        setIsFavourite(!isFavourite);
        toast.success(isFavourite ? 'Removed from favourites' : 'Added to favourites');
      } else {
        toast.error(data.error || 'Failed to update favourites');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={loading}
      className={`p-3 rounded-2xl shadow-lg border transition-all hover:scale-110 active:scale-95 ${isFavourite ? 'bg-rose-50 border-rose-100 text-rose-500 shadow-rose-200' : 'bg-white border-gray-100 text-gray-400 shadow-gray-100 hover:text-rose-400'}`}
    >
      {loading ? (
        <Loader2 className="w-6 h-6 animate-spin" />
      ) : (
        <Heart className={`w-6 h-6 ${isFavourite ? 'fill-current' : ''}`} />
      )}
    </button>
  );
}
