'use client';
import { useState } from 'react';

export function MediaCarousel({ media }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Sort media by order field
  const sortedMedia = [...media].sort((a, b) => (a.order || 0) - (b.order || 0));

  if (!sortedMedia.length) {
    return (
      <div className="aspect-[3/4] bg-[#f8f8f8] flex items-center justify-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">No media available</span>
      </div>
    );
  }

  const activeMedia = sortedMedia[activeIndex];

  return (
    <div className="space-y-4">
      {/* Main Display */}
      <div className="aspect-[3/4] overflow-hidden bg-[#f8f8f8] relative group">
        {activeMedia.type === 'video' ? (
          <video 
            src={activeMedia.url} 
            className="w-full h-full object-cover"
            controls
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <img 
            src={activeMedia.url} 
            alt="Product view" 
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Thumbnails */}
      {sortedMedia.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {sortedMedia.map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative w-16 h-16 transition-opacity duration-300 shrink-0 ${activeIndex === index ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
            >
              <img src={item.type === 'video' ? '/video-placeholder.png' : item.url} className="w-full h-full object-cover" alt="Thumbnail" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
