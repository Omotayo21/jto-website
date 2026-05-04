export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#FFFCE0]/80 backdrop-blur-sm transition-all duration-300">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 border-2 border-gray-200 rounded-full" />
          <div className="absolute inset-0 border-2 border-transparent border-t-black rounded-full animate-spin" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 animate-pulse">Loading</p>
      </div>
    </div>
  );
}
