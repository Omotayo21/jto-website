export default function AdminLoading() {
  return (
    <div className="h-[70vh] w-full flex flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
        <div className="absolute inset-0 border-4 border-transparent border-t-black rounded-full animate-spin" />
      </div>
      <p className="mt-6 text-xs font-black uppercase tracking-[0.4em] text-gray-400 animate-pulse">Syncing Portal</p>
    </div>
  );
}
