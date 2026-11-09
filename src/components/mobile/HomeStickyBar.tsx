"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon"
import { useScrollDirection } from "@/lib/hooks/useScrollDirection"

export function HomeStickyBar() {
  const isVisible = useScrollDirection()

  return (
    <div
      className={`sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-950/95 border-t border-stone-200 dark:border-stone-800 p-3 flex items-center justify-between gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:shadow-2xl backdrop-blur-sm transition-transform duration-300 ease-in-out will-change-transform ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div>
        <span className="block text-[10px] text-stone-500 dark:text-stone-400 uppercase tracking-wider font-semibold">
          Bois de chauffe H1
        </span>
        <span className="text-sm font-bold text-amber-600 dark:text-amber-500">
          Dès 399 € / palette
        </span>
      </div>

      <div className="flex items-center gap-2">
        <a
          href="https://wa.me/34672868332"
          target="_blank"
          rel="noopener noreferrer"
          className="w-11 h-11 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shrink-0 transition-colors"
          aria-label="Discuter sur WhatsApp (+34 672 86 83 32)"
        >
          <WhatsAppIcon className="w-5 h-5 text-emerald-500" />
        </a>

        <Link
          href="/catalogue"
          className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2.5 rounded-lg text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors min-h-[44px] shadow-sm"
        >
          <span>Commander</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
