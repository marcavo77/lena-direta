"use client"

import Link from "next/link"
import { Flame, Phone, ShieldCheck } from "lucide-react"
import { CartDrawer } from "@/components/mobile/CartDrawer"

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-stone-950/80 backdrop-blur-md border-b border-stone-800/80">
      {/* Top Banner Réassurance */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-300 text-[11px] sm:text-xs py-1 px-4 text-center font-medium flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Bois dur H1 séché sous abri (&lt; 20% humidité garanti) • Livraison avec chariot élévateur tout-terrain</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg group-hover:shadow-amber-500/20 transition-all">
            <Flame className="w-6 h-6 text-stone-950 fill-stone-950" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-stone-100 group-hover:text-amber-400 transition-colors">
              Lena<span className="text-amber-500">Direta</span>
            </span>
            <span className="block text-[10px] text-stone-400 uppercase tracking-widest font-semibold">
              Bois &amp; Biocombustibles
            </span>
          </div>
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-300">
          <Link href="#catalogue" className="hover:text-amber-400 transition-colors">
            Nos Combustibles
          </Link>
          <Link href="#simulateur" className="hover:text-amber-400 transition-colors">
            Calculateur de Stères
          </Link>
          <Link href="#livraison" className="hover:text-amber-400 transition-colors">
            Zones &amp; Livraison
          </Link>
        </nav>

        {/* Contact rapide & Panier */}
        <div className="flex items-center gap-3">
          <a
            href="tel:0189000000"
            className="hidden sm:flex items-center gap-2 text-xs font-semibold text-stone-300 bg-stone-900 border border-stone-800 px-3 py-2 rounded-xl hover:border-amber-500/50 transition-all min-h-[44px]"
          >
            <Phone className="w-3.5 h-3.5 text-amber-500" />
            <span>01 89 00 00 00</span>
          </a>

          <CartDrawer />
        </div>
      </div>
    </header>
  )
}
