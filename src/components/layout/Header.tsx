"use client"

import Link from "next/link"
import { Flame, Phone, ShieldCheck } from "lucide-react"
import { CartDrawer } from "@/components/mobile/CartDrawer"

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-stone-950 border-b border-stone-800">
      {/* Top Banner Réassurance */}
      <div className="bg-stone-900 border-b border-stone-800 text-stone-300 text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Bois dur H1 séché sous abri (&lt; 20% humidité garanti) • Livraison chariot tout-terrain</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between gap-4">
        {/* Logo Solide & Artisanal */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center shadow-sm">
            <Flame className="w-6 h-6 fill-stone-950" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-stone-100 group-hover:text-amber-400 transition-colors">
              Lena<span className="text-amber-500">Direta</span>
            </span>
            <span className="block text-[10px] text-stone-400 uppercase tracking-widest font-bold">
              Exploitation &amp; Bois de Chauffage
            </span>
          </div>
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-stone-300">
          <Link href="/catalogue" className="hover:text-amber-400 transition-colors">
            Nos Combustibles
          </Link>
          <Link href="/#simulateur" className="hover:text-amber-400 transition-colors">
            Calculateur de Stères
          </Link>
          <Link href="/livraison-et-acces" className="hover:text-amber-400 transition-colors">
            Livraison &amp; Accès 19T
          </Link>
          <Link href="/guide-du-bois" className="hover:text-amber-400 transition-colors">
            Guide du Bois
          </Link>
          <Link href="/qui-sommes-nous" className="hover:text-amber-400 transition-colors">
            L'Exploitation
          </Link>
        </nav>

        {/* Contact direct & Panier */}
        <div className="flex items-center gap-3">
          <a
            href="tel:0189000000"
            className="hidden sm:flex items-center gap-2.5 text-xs font-bold text-stone-200 bg-stone-900 border border-stone-800 hover:border-amber-500 px-4 py-2.5 rounded-lg transition-colors min-h-[44px]"
          >
            <Phone className="w-4 h-4 text-amber-500" />
            <span>01 89 00 00 00</span>
          </a>

          <CartDrawer />
        </div>
      </div>
    </header>
  )
}
