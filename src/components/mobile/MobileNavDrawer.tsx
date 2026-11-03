"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Menu,
  X,
  ChevronDown,
  Warehouse,
  User,
  Phone,
  ShieldCheck,
  Flame,
  Truck,
  BookOpen,
  Trees,
  Award,
  LogOut,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface MobileNavDrawerProps {
  onOpenWarehouseModal: () => void
}

export function MobileNavDrawer({ onOpenWarehouseModal }: MobileNavDrawerProps) {
  const [open, setOpen] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>("bois-chauffage")
  const [user, setUser] = useState<{ email?: string; id?: string } | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser({ email: data.user.email, id: data.user.id })
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ email: session.user.email, id: session.user.id })
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    window.location.reload()
  }

  const toggleSection = (sec: string) => {
    setExpandedSection(expandedSection === sec ? null : sec)
  }

  const closeMenu = () => setOpen(false)

  return (
    <>
      {/* Bouton Hamburger Tactile (Minimum 44x44px) - Flèche rouge de la capture 3 */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Ouvrir le menu de navigation"
        className="lg:hidden w-11 h-11 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-200 hover:text-amber-400 hover:border-amber-500/40 transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay & Tiroir Latéral */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop sombre */}
          <div
            onClick={closeMenu}
            className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm animate-in fade-in"
          />

          {/* Tiroir */}
          <div className="relative ml-auto w-full max-w-sm bg-[#141211] border-l border-stone-800 h-full flex flex-col z-50 text-stone-100 shadow-2xl animate-in slide-in-from-right duration-250">
            {/* En-tête Tiroir */}
            <div className="p-4 border-b border-stone-800 flex items-center justify-between bg-stone-950">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center">
                  <Flame className="w-5 h-5 fill-stone-950" />
                </div>
                <span className="font-black text-stone-100 text-base">
                  Lena<span className="text-amber-500">Direta</span>
                </span>
              </div>

              <button
                type="button"
                onClick={closeMenu}
                aria-label="Fermer le menu"
                className="w-9 h-9 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Actions Rapides en haut */}
            <div className="p-4 border-b border-stone-800 space-y-2 bg-stone-900/40">
              {/* Bouton Choisir mon entrepôt */}
              <button
                type="button"
                onClick={() => {
                  closeMenu()
                  onOpenWarehouseModal()
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs"
              >
                <div className="flex items-center gap-2">
                  <Warehouse className="w-4 h-4" />
                  <span>Choisir mon entrepôt (Drive)</span>
                </div>
                <span className="text-[10px] uppercase font-black bg-amber-500 text-stone-950 px-1.5 py-0.5 rounded">
                  -40 €
                </span>
              </button>

              {/* Bouton Espace Client ou Se Connecter */}
              {user ? (
                <div className="space-y-1.5">
                  <Link
                    href="/mon-compte"
                    onClick={closeMenu}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 font-bold text-xs hover:border-amber-500 transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <User className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    <span className="text-[10px] text-amber-400 font-bold shrink-0">Mon Compte →</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-rose-400 hover:bg-stone-900 text-xs font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Se déconnecter</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/connexion"
                  onClick={closeMenu}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 font-bold text-xs hover:border-amber-500 transition-colors"
                >
                  <User className="w-4 h-4 text-amber-500" />
                  <span>Se connecter / Créer un compte</span>
                </Link>
              )}
            </div>

            {/* Navigation en Accordéons */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 text-xs">
              {/* Boutique générale */}
              <Link
                href="/catalogue"
                onClick={closeMenu}
                className="block p-3 rounded-xl font-bold uppercase tracking-wider text-amber-400 hover:bg-stone-900 transition-colors"
              >
                Toute la Boutique
              </Link>

              {/* Accordéon 1 : Bois de chauffage */}
              <div className="border border-stone-800/80 rounded-xl overflow-hidden bg-stone-900/30">
                <button
                  type="button"
                  onClick={() => toggleSection("bois-chauffage")}
                  className="w-full p-3.5 flex items-center justify-between font-bold text-stone-200 uppercase tracking-wider text-xs"
                >
                  <span>Bois de Chauffage</span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-400 transition-transform ${
                      expandedSection === "bois-chauffage" ? "rotate-180 text-amber-400" : ""
                    }`}
                  />
                </button>
                {expandedSection === "bois-chauffage" && (
                  <div className="p-3 pt-0 space-y-2 text-stone-300 border-t border-stone-800/60 mt-1">
                    <Link
                      href="/bois-de-chauffage"
                      onClick={closeMenu}
                      className="block py-1.5 px-2 rounded bg-stone-900 font-bold text-amber-400"
                    >
                      Tout voir en Bois de Chauffage →
                    </Link>
                    <Link
                      href="/produit/bois-de-chauffage-25cm-palette-2-steres"
                      onClick={closeMenu}
                      className="block py-1.5 px-2 rounded hover:bg-stone-800 hover:text-amber-400"
                    >
                      Bûches 25 cm (2 Stères)
                    </Link>
                    <Link
                      href="/produit/chene-charme-33cm-palette-3-steres"
                      onClick={closeMenu}
                      className="block py-1.5 px-2 rounded hover:bg-stone-800 hover:text-amber-400"
                    >
                      Bûches 33 cm (3 Stères standard)
                    </Link>
                    <Link
                      href="/produit/chene-hetre-50cm-palette-4-steres"
                      onClick={closeMenu}
                      className="block py-1.5 px-2 rounded hover:bg-stone-800 hover:text-amber-400"
                    >
                      Bûches 50 cm (4 Stères grandes cheminées)
                    </Link>
                  </div>
                )}
              </div>

              {/* Accordéon 2 : Bois Compressé */}
              <div className="border border-stone-800/80 rounded-xl overflow-hidden bg-stone-900/30">
                <button
                  type="button"
                  onClick={() => toggleSection("bois-compresse")}
                  className="w-full p-3.5 flex items-center justify-between font-bold text-stone-200 uppercase tracking-wider text-xs"
                >
                  <span>Bois Compressé</span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-400 transition-transform ${
                      expandedSection === "bois-compresse" ? "rotate-180 text-amber-400" : ""
                    }`}
                  />
                </button>
                {expandedSection === "bois-compresse" && (
                  <div className="p-3 pt-0 space-y-2 text-stone-300 border-t border-stone-800/60 mt-1">
                    <Link
                      href="/bois-compresse"
                      onClick={closeMenu}
                      className="block py-1.5 px-2 rounded bg-stone-900 font-bold text-amber-400"
                    >
                      Tout voir en Bois Compressé →
                    </Link>
                    <Link
                      href="/produit/buches-compressees-jour-palette-96-packs"
                      onClick={closeMenu}
                      className="block py-1.5 px-2 rounded hover:bg-stone-800 hover:text-amber-400"
                    >
                      Bûches densifiées de jour (Haute chaleur)
                    </Link>
                    <Link
                      href="/produit/buches-compressees-nuit-pack-96-packs"
                      onClick={closeMenu}
                      className="block py-1.5 px-2 rounded hover:bg-stone-800 hover:text-amber-400"
                    >
                      Bûches de nuit longue durée (Braise 8h)
                    </Link>
                    <Link
                      href="/produit/paves-bois-compresse-100-chene-palette"
                      onClick={closeMenu}
                      className="block py-1.5 px-2 rounded hover:bg-stone-800 hover:text-amber-400"
                    >
                      Pavés de bois compressé 100% chêne
                    </Link>
                  </div>
                )}
              </div>

              {/* Accordéon 3 : Granulés de bois */}
              <div className="border border-stone-800/80 rounded-xl overflow-hidden bg-stone-900/30">
                <button
                  type="button"
                  onClick={() => toggleSection("granules")}
                  className="w-full p-3.5 flex items-center justify-between font-bold text-stone-200 uppercase tracking-wider text-xs"
                >
                  <span>Granulés de Bois / Pellets</span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-400 transition-transform ${
                      expandedSection === "granules" ? "rotate-180 text-amber-400" : ""
                    }`}
                  />
                </button>
                {expandedSection === "granules" && (
                  <div className="p-3 pt-0 space-y-2 text-stone-300 border-t border-stone-800/60 mt-1">
                    <Link
                      href="/granules-de-bois"
                      onClick={closeMenu}
                      className="block py-1.5 px-2 rounded bg-stone-900 font-bold text-amber-400"
                    >
                      Tout voir en Granulés &amp; Pellets →
                    </Link>
                    <Link
                      href="/produit/pellets-granules-din-plus-palette-66-sacs"
                      onClick={closeMenu}
                      className="block py-1.5 px-2 rounded hover:bg-stone-800 hover:text-amber-400"
                    >
                      Palette de 66 sacs de 15 kg (Din+)
                    </Link>
                    <Link
                      href="/produit/granules-vrac-camion-souffleur-tonne"
                      onClick={closeMenu}
                      className="block py-1.5 px-2 rounded hover:bg-stone-800 hover:text-amber-400"
                    >
                      Granulés vrac camion souffleur (silos)
                    </Link>
                  </div>
                )}
              </div>

              {/* Accordéon 4 : Infos Pratiques */}
              <div className="border border-stone-800/80 rounded-xl overflow-hidden bg-stone-900/30">
                <button
                  type="button"
                  onClick={() => toggleSection("infos")}
                  className="w-full p-3.5 flex items-center justify-between font-bold text-stone-200 uppercase tracking-wider text-xs"
                >
                  <span>Infos Pratiques</span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-400 transition-transform ${
                      expandedSection === "infos" ? "rotate-180 text-amber-400" : ""
                    }`}
                  />
                </button>
                {expandedSection === "infos" && (
                  <div className="p-3 pt-0 space-y-2 text-stone-300 border-t border-stone-800/60 mt-1">
                    <Link
                      href="/infos-pratiques"
                      onClick={closeMenu}
                      className="block py-1.5 px-2 rounded bg-stone-900 font-bold text-amber-400"
                    >
                      Centre d&apos;aide &amp; FAQ complète →
                    </Link>
                    <Link
                      href="/#simulateur"
                      onClick={closeMenu}
                      className="block py-1.5 px-2 rounded hover:bg-stone-800 hover:text-amber-400"
                    >
                      Calculateur de stères en m³
                    </Link>
                    <Link
                      href="/livraison-et-acces"
                      onClick={closeMenu}
                      className="block py-1.5 px-2 rounded hover:bg-stone-800 hover:text-amber-400"
                    >
                      Conditions d&apos;accès camion 19T
                    </Link>
                    <Link
                      href="/guide-du-bois"
                      onClick={closeMenu}
                      className="block py-1.5 px-2 rounded hover:bg-stone-800 hover:text-amber-400"
                    >
                      Méthode d&apos;allumage Top-Down
                    </Link>
                  </div>
                )}
              </div>

              {/* Nos Dépôts */}
              <Link
                href="/nos-depots"
                onClick={closeMenu}
                className="flex items-center justify-between p-3 rounded-xl border border-stone-800 font-bold uppercase tracking-wider text-stone-200 hover:bg-stone-900 hover:text-amber-400 transition-colors"
              >
                <span>Nos 4 Dépôts Drive</span>
                <span className="text-[10px] font-black bg-amber-500 text-stone-950 px-2 py-0.5 rounded">
                  -40 €
                </span>
              </Link>

              {/* Contact */}
              <Link
                href="/contact"
                onClick={closeMenu}
                className="block p-3 rounded-xl border border-stone-800 font-bold uppercase tracking-wider text-stone-200 hover:bg-stone-900 hover:text-amber-400 transition-colors"
              >
                Contact &amp; Assistance Scierie
              </Link>

              {/* Accordéon 5 : LenaDireta */}
              <div className="border border-stone-800/80 rounded-xl overflow-hidden bg-stone-900/30">
                <button
                  type="button"
                  onClick={() => toggleSection("lenadireta")}
                  className="w-full p-3.5 flex items-center justify-between font-bold text-stone-200 uppercase tracking-wider text-xs"
                >
                  <span>LenaDireta</span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-400 transition-transform ${
                      expandedSection === "lenadireta" ? "rotate-180 text-amber-400" : ""
                    }`}
                  />
                </button>
                {expandedSection === "lenadireta" && (
                  <div className="p-3 pt-0 space-y-2 text-stone-300 border-t border-stone-800/60 mt-1">
                    <Link
                      href="/qui-sommes-nous"
                      onClick={closeMenu}
                      className="block py-1.5 px-2 rounded hover:bg-stone-800 hover:text-amber-400"
                    >
                      L'Exploitation &amp; Scierie
                    </Link>
                    <Link
                      href="/qui-sommes-nous"
                      onClick={closeMenu}
                      className="block py-1.5 px-2 rounded hover:bg-stone-800 hover:text-amber-400"
                    >
                      Nos Forêts Françaises Certifiées PEFC
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Pied du tiroir avec téléphone */}
            <div className="p-4 border-t border-stone-800 bg-stone-950 space-y-2">
              <a
                href="tel:0189000000"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider"
              >
                <Phone className="w-4 h-4" />
                <span>01 89 00 00 00 (8h - 18h)</span>
              </a>

              <div className="text-center text-[10px] text-stone-400 pt-1 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Avis Vérifiés 4.8/5 • Bois sec garanti H1</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
