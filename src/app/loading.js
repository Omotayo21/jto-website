import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-sm transition-all duration-300">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 animate-pulse">Loading Experience</p>
      </div>
    </div>
  );
}
