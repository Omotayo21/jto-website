'use client';
import { useState } from 'react';
import { Heart, X } from 'lucide-react';
import Link from 'next/link';

export function ShopFollowButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 left-8 z-[100] h-12 px-6 bg-[#5A31F4] text-white rounded-full shadow-2xl flex items-center gap-3 hover:scale-105 transition-all active:scale-95 group font-bold text-sm"
        aria-label="Follow on Shop"
      >
        <div className="w-6 h-6 bg-[#FFFCE0]/20 rounded-full flex items-center justify-center">
          <Heart size={14} className="fill-current" />
        </div>
        Follow on shop
      </button>

      {/* Login Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative bg-[#FFFCE0] w-full max-w-sm p-8 rounded-[2rem] shadow-2xl animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#5A31F4]/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-[#5A31F4]">
                <Heart size={32} className="fill-current" />
              </div>
              <h3 className="text-2xl font-black serif-font uppercase tracking-tighter mb-2">Follow JTOtheLabel</h3>
              <p className="text-sm text-gray-500">Sign in to follow the brand and get the latest updates on shop.</p>
            </div>

            <div className="space-y-3">
              <Link
                href="/login"
                className="flex items-center justify-center h-14 bg-black text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-[#DAA520] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="flex items-center justify-center h-14 border border-gray-200 text-black rounded-full font-black uppercase tracking-widest text-xs hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Create Account
              </Link>
            </div>

            <p className="text-[10px] text-gray-400 text-center mt-6 uppercase tracking-widest font-bold">
              Powered by Shop App
            </p>
          </div>
        </div>
      )}
    </>
  );
}
