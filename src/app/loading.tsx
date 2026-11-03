export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 px-4">
      <div className="relative w-12 h-12 flex items-center justify-center">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border-2 border-amber-500/40 animate-pulse" />
        <div className="absolute inset-0 rounded-xl border-t-2 border-amber-500 animate-spin" />
      </div>
      <div className="text-xs font-bold uppercase tracking-widest text-stone-400 animate-pulse">
        Chargement scierie...
      </div>
    </div>
  )
}
