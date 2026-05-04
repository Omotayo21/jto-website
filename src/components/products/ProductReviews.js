'use client';
import { useState, useEffect } from 'react';
import { Star, MessageSquare, Loader2, Send } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export function ProductReviews({ productId }) {
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.comment.trim()) return toast.error('Please add a comment');
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          rating: newReview.rating,
          comment: newReview.comment
        })
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success('Review submitted successfully!');
        setNewReview({ rating: 5, comment: '' });
        fetchReviews(); // Refresh list
      } else {
        toast.error(data.error || 'Failed to submit review');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-10 flex justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="mt-20 space-y-12">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl serif-font italic text-gray-900 tracking-tight flex items-center gap-4">
          Customer Reviews
          <span className="text-xs font-bold bg-black text-white px-3 py-1 uppercase tracking-widest">{reviews.length} total</span>
        </h2>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Review Form */}
        <div className="lg:col-span-1">
          {user ? (
            <div className="bg-[#FFFCE0] p-8 border border-gray-200 sticky top-24">
              <h3 className="font-black text-gray-900 text-xl mb-6 serif-font italic">Leave a Review</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-3">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className={`transition-all hover:scale-110 ${newReview.rating >= star ? 'text-[#DAA520]' : 'text-gray-200'}`}
                      >
                        <Star size={32} fill={newReview.rating >= star ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-3">Your Feedback</label>
                  <textarea 
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    required
                    rows="4"
                    placeholder="Tell others what you think..."
                    className="w-full bg-[#FFFCE0] border-gray-200 p-4 text-sm font-medium focus:ring-1 focus:ring-black transition-all outline-none border"
                  />
                </div>
                <Button disabled={isSubmitting} type="submit" className="w-full h-14 rounded-none bg-black hover:bg-[#DAA520] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3">
                  {isSubmitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Submit Review</>}
                </Button>
                <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-wider">Only verified purchasers can submit</p>
              </form>
            </div>
          ) : (
            <div className="bg-gray-50 p-8 border border-gray-200 text-center">
              <p className="text-gray-500 font-bold mb-4">Log in to leave a review</p>
              <Button onClick={() => window.location.href = '/login'} className="bg-black hover:bg-[#DAA520] rounded-none">Sign In</Button>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-6">
          {reviews.length === 0 ? (
            <div className="py-20 text-center bg-gray-50/50 border border-gray-100">
               <Star size={48} className="text-gray-200 mx-auto mb-4" />
               <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Be the first to review this product</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="bg-[#FFFCE0] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 flex items-center justify-center text-black font-black">
                      {review.userName[0]}
                    </div>
                    <div>
                      <p className="font-black text-gray-900">{review.userName}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 text-[#DAA520]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={14} fill={review.rating >= star ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 font-medium leading-relaxed italic">&quot;{review.comment}&quot;</p>
                <div className="mt-6 flex items-center gap-2">
                   <div className="w-4 h-4 bg-black rounded-full flex items-center justify-center">
                      <CheckCircle2 size={10} className="text-white" />
                   </div>
                   <span className="text-[9px] font-black text-black uppercase tracking-widest">Verified Purchase</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function CheckCircle2({ size, className }) {
   return (
     <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
       <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
       <polyline points="22 4 12 14.01 9 11.01" />
     </svg>
   );
}

