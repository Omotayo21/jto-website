'use client';

export function NewsletterSection() {
  return (
    <section className="bg-black text-white">
      <div className="max-w-[1440px] mx-auto grid md:grid-cols-2">
        {/* Left — text + form */}
        <div className="px-12 md:px-20 py-20 flex flex-col justify-center">
          {/* Email icon */}
          <div className="mb-8">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#800020" strokeWidth="1.5">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4 leading-tight">
            For Exclusive Access
          </h2>
          <p className="text-gray-400 text-sm mb-10 leading-relaxed">
            News and promotions straight to your mailbox.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="relative max-w-sm group"
          >
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-transparent border-b border-gray-600 pb-4 text-sm text-white focus:border-white outline-none transition-all placeholder:text-gray-500"
            />
            <button
              type="submit"
              className="absolute right-0 bottom-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/>
              </svg>
            </button>
          </form>
          <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-6 font-medium">
            Unsubscribe easily, whenever you like.
          </p>
        </div>

        {/* Right — fashion image */}
        <div className="hidden md:block relative min-h-[400px]">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=987&auto=format&fit=crop"
            alt="Exclusive fashion"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
        </div>
      </div>
    </section>
  );
}
