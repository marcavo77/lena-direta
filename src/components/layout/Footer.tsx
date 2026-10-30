import Link from "next/link"
import { Flame, ShieldCheck, Truck, Clock, Award } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-stone-950 border-t border-stone-800 text-stone-400 text-sm mt-20">
      {/* 4 Piliers de Réassurance */}
      <div className="border-b border-stone-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-semibold text-stone-200 text-xs sm:text-sm">Qualité H1 Certifiée</h5>
              <p className="text-[11px] text-stone-400">Humidité &lt; 20% contrôlée</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-semibold text-stone-200 text-xs sm:text-sm">Livraison Précise</h5>
              <p className="text-[11px] text-stone-400">Chariot tout-terrain au garage</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-semibold text-stone-200 text-xs sm:text-sm">Créneau Fixé</h5>
              <p className="text-[11px] text-stone-400">Rendez-vous téléphonique</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-semibold text-stone-200 text-xs sm:text-sm">Paiement Sécurisé</h5>
              <p className="text-[11px] text-stone-400">Stripe 3D Secure &amp; CB</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col md:flex-row justify-between gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center">
              <Flame className="w-4 h-4 text-stone-950 fill-stone-950" />
            </div>
            <span className="font-bold text-stone-100 text-lg">
              Lena<span className="text-amber-500">Direta</span>
            </span>
          </div>
          <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
            Fournisseur de référence en bois de chauffage dur (Chêne, Charme, Hêtre), granulés Din+ et bûches compressées. Livraison soignée directe producteur.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 text-xs">
          <div>
            <h6 className="font-semibold text-stone-200 uppercase tracking-wider mb-3">Combustibles</h6>
            <ul className="space-y-2">
              <li><Link href="#catalogue" className="hover:text-amber-400">Bûches 33 cm</Link></li>
              <li><Link href="#catalogue" className="hover:text-amber-400">Bûches 50 cm</Link></li>
              <li><Link href="#catalogue" className="hover:text-amber-400">Pellets Din+</Link></li>
              <li><Link href="#catalogue" className="hover:text-amber-400">Bois d&apos;allumage</Link></li>
            </ul>
          </div>
          <div>
            <h6 className="font-semibold text-stone-200 uppercase tracking-wider mb-3">Services</h6>
            <ul className="space-y-2">
              <li><Link href="#simulateur" className="hover:text-amber-400">Calculateur de stères</Link></li>
              <li><Link href="#livraison" className="hover:text-amber-400">Éligibilité livraison</Link></li>
              <li><Link href="#" className="hover:text-amber-400">Conditions d&apos;accès</Link></li>
              <li><Link href="#" className="hover:text-amber-400">Mentions légales</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-stone-800 py-6 text-center text-xs text-stone-400">
        © {new Date().getFullYear()} LenaDireta. Tous droits réservés. Propulsé par Next.js, Supabase &amp; Vercel.
      </div>
    </footer>
  )
}
