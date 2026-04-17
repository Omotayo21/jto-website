'use client';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[3rem] p-10 shadow-2xl shadow-gray-100 border border-gray-100 text-center">
        <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 mx-auto mb-8 shadow-inner">
          <AlertTriangle size={40} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Something went wrong</h1>
        <p className="text-gray-500 font-bold mb-10 leading-relaxed text-sm">
          {error.message || "An unexpected error occurred. Don't worry, our team has been notified."}
        </p>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95"
          >
            <RotateCcw size={16} /> Try Again
          </button>
          <Link 
            href="/"
            className="flex items-center justify-center gap-2 bg-gray-50 text-gray-500 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-100 transition-all active:scale-95 border border-gray-100"
          >
            <Home size={16} /> Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
