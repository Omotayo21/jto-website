'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(data.message);
        setEmail('');
      } else {
        toast.error(data.message || data.error);
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <img
        src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1920&auto=format&fit=crop"
        alt="Luxury Couture Background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-8 text-center flex flex-col items-center">
        <div className="mb-8 p-4 bg-white/5 rounded-full backdrop-blur-xl border border-white/10">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFDA03" strokeWidth="1.5">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
        </div>
        
        <h2 className="text-4xl md:text-6xl font-black poppins-font uppercase tracking-tighter mb-6 leading-none text-white">
          For Exclusive Access
        </h2>
        
        <p className="text-gray-300 text-sm md:text-base mb-12 leading-relaxed max-w-md font-medium">
          Join our elite circle for private previews, limited collections, and the heartbeat of luxury fashion.
        </p>

        <form
          onSubmit={handleSubmit}
          className="relative w-full max-w-md group"
        >
          <input
            type="email"
            placeholder="ENTER YOUR EMAIL"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full bg-white/5 border border-white/20 px-8 py-5 rounded-full text-sm text-white focus:border-[#FFDA03] focus:bg-white/10 outline-none transition-all placeholder:text-gray-500 disabled:opacity-50 text-center tracking-widest font-black"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-6 px-10 py-4 bg-[#FFDA03] text-black rounded-full font-black uppercase text-[10px] tracking-[0.2em] hover:scale-105 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Subscribing...' : 'Subscribe Now'}
          </button>
        </form>

        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-8 font-black opacity-60">
          Unsubscribe easily · Privacy guaranteed
        </p>
      </div>
    </section>
  );
}

