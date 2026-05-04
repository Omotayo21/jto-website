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
    <section className="relative h-[650px] flex items-center overflow-hidden">
      {/* Background Image */}
      <img
        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
        alt="Luxury Couture Background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Dark Overlay - slightly heavier for readability on left-aligned text */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

      {/* Content */}
      <div className="container mx-auto px-8 md:px-16 lg:px-24 relative z-10">
        <div className="max-w-2xl text-left">
          {/* Icon */}
          <div className="mb-10">
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#daa520" strokeWidth="1">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
          </div>
          
          <h2 className="text-4xl md:text-6xl  text-white mb-6 tracking-wide uppercase">
            For Exclusive Access
          </h2>
          
          <p className="text-gray-200 text-lg md:text-xl mb-16 font-light">
            News and promotions straight to your mailbox.
          </p>

          <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-md"
          >
            <div className="relative group">
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full bg-transparent border-b border-white/40 pb-6 text-xl text-white focus:border-white outline-none transition-all placeholder:text-gray-400 disabled:opacity-50 font-light"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-0 bottom-6 text-white hover:translate-x-2 transition-transform disabled:opacity-50"
                aria-label="Subscribe"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
            
            <p className="mt-8 text-xs text-gray-400 font-light ">
              Unsubscribe easily, whenever you like.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

