import { Loader2 } from 'lucide-react';

export default function AdminLoading() {
  return (
    <div className="h-[70vh] w-full flex flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-indigo-100 rounded-full" />
        <Loader2 className="w-20 h-20 text-indigo-600 animate-spin absolute inset-0" />
      </div>
      <p className="mt-6 text-xs font-black uppercase tracking-[0.4em] text-gray-400 animate-pulse">Syncing Portal</p>
    </div>
  );
}
