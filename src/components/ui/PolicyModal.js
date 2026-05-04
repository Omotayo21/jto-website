'use client';
import { useEffect } from 'react';

export function PolicyModal({ isOpen, onClose, title, content }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-[#FFFCE0] w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-[2rem] shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="sticky top-0 bg-[#FFFCE0] px-8 py-6 border-b border-gray-100 flex justify-between items-center z-10">
          <h2 className="text-xl font-black poppins-font uppercase tracking-tighter">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        
        <div className="p-8 md:p-12 text-sm text-gray-600 leading-relaxed space-y-6">
          {content}
        </div>
      </div>
    </div>
  );
}
