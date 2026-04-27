'use client';

export function VideoQuote() {
  return (
    <section className="relative w-full h-[80vh] overflow-hidden bg-black">
      {/* Background Video using local files for maximum reliability */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-70 z-0"
      >
        <source 
          src="/fashion-bg.mp4" 
          type="video/mp4" 
        />
        <source 
          src="/Recording%20%2312.mp4" 
          type="video/mp4" 
        />
      </video>

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-12 md:p-24 bg-gradient-to-t from-black/80 to-transparent z-10">
        <div className="max-w-4xl self-end text-right">
          <p className="text-2xl md:text-4xl lg:text-5xl serif-font italic text-white leading-tight mb-6">
            &ldquo;Creating pieces that empower presence, inspire confidence, and move culture forward.&rdquo;
          </p>
          <div className="flex flex-col items-end">
            <span className="w-12 h-[1px] bg-[#DAA520] mb-4" />
            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-[#DAA520]">
              Kemi Onsanya <span className="text-white/60 ml-2">CEO</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
