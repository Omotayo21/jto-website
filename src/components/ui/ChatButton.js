'use client';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';

export function ChatButton() {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/management-portal');

  if (isAdminPage) return null;

  return (
    <button 
      className="fixed bottom-8 right-8 z-[100] w-14 h-14 bg-[#FFDA03] text-black rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95 group"
      aria-label="Chat with us"
    >
      <MessageCircle size={28} />
      <span className="absolute right-full mr-4 bg-black text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        How can we help?
      </span>
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
    </button>
  );
}
