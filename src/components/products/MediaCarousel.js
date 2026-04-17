'use client';
import { useState } from 'react';
import Image from 'next/image';

export function MediaCarousel({ media }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Sort media by order field
  const sortedMedia = [...media].sort((a, b) => (a.order || 0) - (b.order || 0)).slice(0, 3);

  if (!sortedMedia.length) {
    return (
      <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
        <span className="text-gray-400">No media available</span>
      </div>
    );
  }

  const activeMedia = sortedMedia[activeIndex];

  return (
    <div className="space-y-6">
      {/* Main Display */}
      <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-inner relative group select-none">
        {activeMedia.type === 'video' ? (
          <div className="relative w-full h-full">
            <video 
              src={activeMedia.url} 
              className="w-full h-full object-cover"
              controls
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest pointer-events-none">Video</div>
          </div>
        ) : (
          <img 
            src={activeMedia.url} 
            alt="Product view" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        )}
      </div>

      {/* Thumbnails */}
      {sortedMedia.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
          {sortedMedia.map((item, index) => (
            <button
              key={item.publicId || index}
              onClick={() => setActiveIndex(index)}
              className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 shrink-0 snap-start ${activeIndex === index ? 'border-indigo-600 scale-105 shadow-lg ring-4 ring-indigo-50' : 'border-transparent hover:border-gray-200'}`}
            >
              {item.type === 'video' ? (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                  <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm z-10">
                    <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-white border-b-[4px] border-b-transparent ml-0.5" />
                  </div>
                  <div className="absolute inset-0 w-full h-full bg-black/40 z-0" />
                  <video src={item.url} className="absolute inset-0 w-full h-full object-cover" muted />
                </div>
              ) : (
                <img src={item.url} className="w-full h-full object-cover" alt="Thumbnail" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
