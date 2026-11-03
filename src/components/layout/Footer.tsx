import Link from "next/link"
import { Flame, ShieldCheck, Truck, Clock, Award, Phone } from "lucide-react"

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
              <h5 className="font-semibold text-stone-200 text-xs sm:text-sm">Règlement par Virement (RIB)</h5>
              <p className="text-[11px] text-stone-400">Paiement direct Crédit Agricole</p>
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
            Exploitant forestier et négoce en bois de chauffage dur (Chêne, Charme, Hêtre), granulés de bois certifiés Din+ et bûches densifiées. Livraison directe au garage par camion tout-terrain.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-stone-300">
            <Phone className="w-4 h-4 text-amber-500" />
            <span>Service conseil &amp; commandes : <strong>01 89 00 00 00</strong> (8h-19h)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
          <div>
            <h6 className="font-semibold text-stone-200 uppercase tracking-wider mb-3">Combustibles</h6>
            <ul className="space-y-2">
              <li><Link href="/bois-de-chauffage" className="hover:text-amber-400 transition-colors">Bois de Chauffage (25, 33, 50cm)</Link></li>
              <li><Link href="/bois-compresse" className="hover:text-amber-400 transition-colors">Bûches Compressées Jour &amp; Nuit</Link></li>
              <li><Link href="/granules-de-bois" className="hover:text-amber-400 transition-colors">Granulés de Bois Din+ / EnPlus</Link></li>
              <li><Link href="/catalogue" className="hover:text-amber-400 transition-colors">Toute la Boutique</Link></li>
            </ul>
          </div>

          <div>
            <h6 className="font-semibold text-stone-200 uppercase tracking-wider mb-3">Services &amp; Outils</h6>
            <ul className="space-y-2">
              <li><Link href="/nos-depots" className="hover:text-amber-400 transition-colors">Nos 4 Dépôts Drive (-40€)</Link></li>
              <li><Link href="/infos-pratiques" className="hover:text-amber-400 transition-colors">Infos Pratiques &amp; FAQ</Link></li>
              <li><Link href="/#simulateur" className="hover:text-amber-400 transition-colors">Calculateur de stères</Link></li>
              <li><Link href="/livraison-et-acces" className="hover:text-amber-400 transition-colors">Conditions d&apos;accès 19T</Link></li>
              <li><Link href="/panier" className="hover:text-amber-400 transition-colors">Mon Panier</Link></li>
            </ul>
          </div>

          <div>
            <h6 className="font-semibold text-stone-200 uppercase tracking-wider mb-3">L&apos;Entreprise</h6>
            <ul className="space-y-2">
              <li><Link href="/qui-sommes-nous" className="hover:text-amber-400 transition-colors">L&apos;Exploitation &amp; Scierie</Link></li>
              <li><Link href="/contact" className="hover:text-amber-400 transition-colors">Contact &amp; Devis</Link></li>
              <li><Link href="/connexion" className="hover:text-amber-400 transition-colors">Espace Client / Connexion</Link></li>
              <li><Link href="/guide-du-bois" className="hover:text-amber-400 transition-colors">Guide Allumage Top-Down</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-stone-800 py-6 text-center text-xs text-stone-500">
        © {new Date().getFullYear()} LenaDireta Exploitation. Tous droits réservés. Bois de chauffage &amp; biocombustibles français.
      </div>
    </footer>
  )
}
