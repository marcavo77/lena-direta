"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import {
  Flame,
  Phone,
  ShieldCheck,
  ChevronDown,
  Warehouse,
  User,
  LogOut,
  Star,
} from "lucide-react"
import { CartDrawer } from "@/components/mobile/CartDrawer"
import { MobileNavDrawer } from "@/components/mobile/MobileNavDrawer"
import { WarehouseSelectorModal } from "@/components/layout/WarehouseSelectorModal"
import { createClient } from "@/lib/supabase/client"
import { useCartStore } from "@/lib/store/cart"

export function Header() {
  const [warehouseModalOpen, setWarehouseModalOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [user, setUser] = useState<{ email?: string; id?: string } | null>(null)
  const navRef = useRef<HTMLElement>(null)
  const { fulfillmentMethod } = useCartStore()

  // Détection de session client Supabase
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

  // Fermeture du dropdown lors d'un clic en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    window.location.reload()
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-stone-950 border-b border-stone-800 shadow-md">
        {/* ================= BARRE SUPÉRIEURE (Inspirée de Brazeco - Captures 1 & 2) ================= */}
        <div className="bg-stone-900 border-b border-stone-800 text-stone-300 text-xs py-2 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            {/* Gauche : Bouton Choisir mon entrepôt */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setWarehouseModalOpen(true)}
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-wider transition-all shadow-sm active:scale-95 min-h-[32px]"
              >
                <Warehouse className="w-3.5 h-3.5" />
                <span>
                  {fulfillmentMethod === "drive" ? "Dépôt Drive Sélectionné" : "Choisir mon entrepôt"}
                </span>
              </button>

              {/* Avis Vérifiés au centre/gauche */}
              <div className="hidden md:flex items-center gap-1.5 text-stone-300 text-[11px] font-semibold border-l border-stone-800 pl-3">
                <span className="text-amber-400 flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <Star className="w-3 h-3 fill-amber-400" />
                  <Star className="w-3 h-3 fill-amber-400" />
                  <Star className="w-3 h-3 fill-amber-400" />
                  <Star className="w-3 h-3 fill-amber-400" />
                </span>
                <span className="font-bold text-stone-200">Avis Vérifiés</span>
                <span className="text-stone-400">4.8 sur 5 (1 420 avis)</span>
              </div>
            </div>

            {/* Droite : Téléphone + Espace Connexion (Capture 2) */}
            <div className="flex items-center gap-4">
              <a
                href="tel:0189000000"
                className="hidden sm:flex items-center gap-1.5 text-stone-300 hover:text-amber-400 font-bold transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-amber-500" />
                <span>01 89 00 00 00</span>
              </a>

              {/* Bouton Se Connecter / Mon Espace (Flèche rouge de la capture 2) */}
              {user ? (
                <div className="relative group">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 text-stone-200 hover:text-amber-400 text-xs font-bold transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="max-w-[120px] truncate">{user.email?.split("@")[0]}</span>
                    <ChevronDown className="w-3 h-3 text-stone-400" />
                  </button>
                  <div className="hidden group-hover:block absolute right-0 top-full pt-1 z-50">
                    <div className="bg-[#1c1917] border border-stone-800 rounded-xl p-2 w-48 shadow-xl space-y-1 text-xs">
                      <div className="px-3 py-1.5 text-[11px] text-stone-400 border-b border-stone-800 truncate">
                        {user.email}
                      </div>
                      <Link
                        href="/mon-compte"
                        className="block px-3 py-1.5 text-stone-200 hover:bg-stone-800 rounded-lg font-bold hover:text-amber-400"
                      >
                        Mon Espace Client
                      </Link>
                      <Link
                        href="/panier"
                        className="block px-3 py-1.5 text-stone-300 hover:bg-stone-800 rounded-lg"
                      >
                        Mon Panier
                      </Link>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-rose-400 hover:bg-stone-800 rounded-lg"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Se déconnecter</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/connexion"
                  className="flex items-center gap-1.5 text-stone-200 hover:text-amber-400 text-xs font-bold transition-colors py-1 px-2.5 rounded-lg border border-stone-800 hover:border-amber-500/40"
                >
                  <User className="w-3.5 h-3.5 text-amber-500" />
                  <span>Se connecter</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* ================= BARRE DE NAVIGATION PRINCIPALE (Capture 1) ================= */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between gap-4">
          {/* Logo LenaDireta */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center shadow-sm">
              <Flame className="w-6 h-6 fill-stone-950" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-stone-100 group-hover:text-amber-400 transition-colors">
                Lena<span className="text-amber-500">Direta</span>
              </span>
              <span className="block text-[10px] text-stone-400 uppercase tracking-widest font-bold">
                Exploitation &amp; Scierie
              </span>
            </div>
          </Link>

          {/* Navlinks Desktop avec Menus Déroulants (Inspiré de Brazeco - Capture 1) */}
          <nav
            ref={navRef}
            className="hidden lg:flex items-center gap-4 xl:gap-7 text-xs xl:text-sm font-bold uppercase tracking-wider text-stone-300 whitespace-nowrap"
          >
            {/* BOUTIQUE */}
            <Link
              href="/catalogue"
              className="hover:text-amber-400 transition-colors py-2 whitespace-nowrap"
            >
              Boutique
            </Link>

            {/* BOIS COMPRESSÉ ▾ */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("bois-compresse")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href="/bois-compresse"
                className="flex items-center gap-1 hover:text-amber-400 transition-colors py-2 whitespace-nowrap"
              >
                <span>Bois Compressé</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              </Link>

              {activeDropdown === "bois-compresse" && (
                <div className="absolute left-0 top-full pt-1 w-64 z-50">
                  <div className="bg-[#1c1917] border border-stone-800 rounded-xl p-2 shadow-2xl space-y-1 text-xs normal-case">
                    <Link
                      href="/bois-compresse"
                      onClick={() => setActiveDropdown(null)}
                      className="block p-2.5 rounded-lg hover:bg-stone-800 hover:text-amber-400"
                    >
                      <div className="font-bold text-stone-100">Bûches densifiées de jour</div>
                      <div className="text-[11px] text-stone-400">Chaleur vive immédiate</div>
                    </Link>
                    <Link
                      href="/bois-compresse"
                      onClick={() => setActiveDropdown(null)}
                      className="block p-2.5 rounded-lg hover:bg-stone-800 hover:text-amber-400"
                    >
                      <div className="font-bold text-stone-100">Bûches de nuit longue durée</div>
                      <div className="text-[11px] text-stone-400">Braise continue jusqu&apos;à 8 heures</div>
                    </Link>
                    <Link
                      href="/bois-compresse"
                      onClick={() => setActiveDropdown(null)}
                      className="block p-2.5 rounded-lg hover:bg-stone-800 hover:text-amber-400"
                    >
                      <div className="font-bold text-stone-100">Pavés compressés 100% chêne</div>
                      <div className="text-[11px] text-stone-400">Rendement thermique scierie</div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* BOIS DE CHAUFFAGE ▾ */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("bois-chauffage")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href="/bois-de-chauffage"
                className="flex items-center gap-1 hover:text-amber-400 transition-colors py-2 whitespace-nowrap"
              >
                <span>Bois de Chauffage</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              </Link>

              {activeDropdown === "bois-chauffage" && (
                <div className="absolute left-0 top-full pt-1 w-64 z-50">
                  <div className="bg-[#1c1917] border border-stone-800 rounded-xl p-2 shadow-2xl space-y-1 text-xs normal-case">
                    <Link
                      href="/bois-de-chauffage"
                      onClick={() => setActiveDropdown(null)}
                      className="block p-2.5 rounded-lg hover:bg-stone-800 hover:text-amber-400"
                    >
                      <div className="font-bold text-stone-100">Bûches en 33 cm</div>
                      <div className="text-[11px] text-stone-400">Palettes de 2 à 4 stères rangés</div>
                    </Link>
                    <Link
                      href="/bois-de-chauffage"
                      onClick={() => setActiveDropdown(null)}
                      className="block p-2.5 rounded-lg hover:bg-stone-800 hover:text-amber-400"
                    >
                      <div className="font-bold text-stone-100">Bûches en 50 cm</div>
                      <div className="text-[11px] text-stone-400">Pour inserts et foyers ouverts</div>
                    </Link>
                    <Link
                      href="/bois-de-chauffage"
                      onClick={() => setActiveDropdown(null)}
                      className="block p-2.5 rounded-lg hover:bg-stone-800 hover:text-amber-400"
                    >
                      <div className="font-bold text-stone-100">Bois H1 séché sous abri</div>
                      <div className="text-[11px] text-stone-400">&lt; 20% humidité garantie scierie</div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* GRANULÉS DE BOIS ▾ */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("granules")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href="/granules-de-bois"
                className="flex items-center gap-1 hover:text-amber-400 transition-colors py-2 whitespace-nowrap"
              >
                <span>Granulés de Bois</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              </Link>

              {activeDropdown === "granules" && (
                <div className="absolute left-0 top-full pt-1 w-64 z-50">
                  <div className="bg-[#1c1917] border border-stone-800 rounded-xl p-2 shadow-2xl space-y-1 text-xs normal-case">
                    <Link
                      href="/granules-de-bois"
                      onClick={() => setActiveDropdown(null)}
                      className="block p-2.5 rounded-lg hover:bg-stone-800 hover:text-amber-400"
                    >
                      <div className="font-bold text-stone-100">Palette 66 sacs de 15 kg</div>
                      <div className="text-[11px] text-stone-400">Certifié Din+ / EnPlus A1 (990 kg)</div>
                    </Link>
                    <Link
                      href="/granules-de-bois"
                      onClick={() => setActiveDropdown(null)}
                      className="block p-2.5 rounded-lg hover:bg-stone-800 hover:text-amber-400"
                    >
                      <div className="font-bold text-stone-100">100% Résineux haute performance</div>
                      <div className="text-[11px] text-stone-400">Faible taux de cendres (&lt; 0.5%)</div>
                    </Link>
                    <Link
                      href="/granules-de-bois"
                      onClick={() => setActiveDropdown(null)}
                      className="block p-2.5 rounded-lg hover:bg-stone-800 hover:text-amber-400"
                    >
                      <div className="font-bold text-stone-100">Livraison en vrac souffleur</div>
                      <div className="text-[11px] text-stone-400">Pour silos de chaudière</div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* INFOS PRATIQUES ▾ */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("infos")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href="/infos-pratiques"
                className="flex items-center gap-1 hover:text-amber-400 transition-colors py-2 whitespace-nowrap"
              >
                <span>Infos Pratiques</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              </Link>

              {activeDropdown === "infos" && (
                <div className="absolute left-0 top-full pt-1 w-64 z-50">
                  <div className="bg-[#1c1917] border border-stone-800 rounded-xl p-2 shadow-2xl space-y-1 text-xs normal-case">
                    <Link
                      href="/infos-pratiques"
                      onClick={() => setActiveDropdown(null)}
                      className="block p-2.5 rounded-lg hover:bg-stone-800 hover:text-amber-400"
                    >
                      <div className="font-bold text-stone-100">Centre d&apos;aide &amp; FAQ</div>
                      <div className="text-[11px] text-stone-400">Livraison, accès et virement bancaire</div>
                    </Link>
                    <Link
                      href="/#simulateur"
                      onClick={() => setActiveDropdown(null)}
                      className="block p-2.5 rounded-lg hover:bg-stone-800 hover:text-amber-400"
                    >
                      <div className="font-bold text-stone-100">Calculateur de stères</div>
                      <div className="text-[11px] text-stone-400">Estimez votre consommation selon surface</div>
                    </Link>
                    <Link
                      href="/livraison-et-acces"
                      onClick={() => setActiveDropdown(null)}
                      className="block p-2.5 rounded-lg hover:bg-stone-800 hover:text-amber-400"
                    >
                      <div className="font-bold text-stone-100">Livraison &amp; Accès camion 19T</div>
                      <div className="text-[11px] text-stone-400">Gabarit et chariot tout-terrain</div>
                    </Link>
                    <Link
                      href="/guide-du-bois"
                      onClick={() => setActiveDropdown(null)}
                      className="block p-2.5 rounded-lg hover:bg-stone-800 hover:text-amber-400"
                    >
                      <div className="font-bold text-stone-100">Guide d&apos;allumage Top-Down</div>
                      <div className="text-[11px] text-stone-400">Méthode inversée sans fumée</div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* LENADIRETA ▾ */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("lenadireta")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                onClick={() =>
                  setActiveDropdown(
                    activeDropdown === "lenadireta" ? null : "lenadireta"
                  )
                }
                className="flex items-center gap-1 hover:text-amber-400 transition-colors py-2 whitespace-nowrap"
              >
                <span>LenaDireta</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              </button>

              {activeDropdown === "lenadireta" && (
                <div className="absolute right-0 top-full pt-1 w-60 z-50">
                  <div className="bg-[#1c1917] border border-stone-800 rounded-xl p-2 shadow-2xl space-y-1 text-xs normal-case">
                    <Link
                      href="/qui-sommes-nous"
                      onClick={() => setActiveDropdown(null)}
                      className="block p-2.5 rounded-lg hover:bg-stone-800 hover:text-amber-400"
                    >
                      <div className="font-bold text-stone-100">L&apos;Exploitation &amp; Scierie</div>
                      <div className="text-[11px] text-stone-400">Notre histoire et valeurs terroir</div>
                    </Link>
                    <Link
                      href="/nos-depots"
                      onClick={() => setActiveDropdown(null)}
                      className="block p-2.5 rounded-lg hover:bg-stone-800 hover:text-amber-400"
                    >
                      <div className="font-bold text-stone-100 flex items-center justify-between">
                        <span>Nos 4 Dépôts Drive</span>
                        <span className="text-[10px] bg-amber-500 text-stone-950 font-bold px-1.5 py-0.2 rounded">
                          -40€
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-400">Nangis, Melun, Meaux, Évry</div>
                    </Link>
                    <Link
                      href="/contact"
                      onClick={() => setActiveDropdown(null)}
                      className="block p-2.5 rounded-lg hover:bg-stone-800 hover:text-amber-400"
                    >
                      <div className="font-bold text-stone-100">Contact &amp; Assistance</div>
                      <div className="text-[11px] text-stone-400">Ligne directe 01 89 00 00 00</div>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Côté Droit : Panier + Menu Hamburger Mobile (Capture 3) */}
          <div className="flex items-center gap-2.5">
            <CartDrawer />

            {/* Menu Hamburger Mobile (Flèche rouge de la capture 3) */}
            <MobileNavDrawer onOpenWarehouseModal={() => setWarehouseModalOpen(true)} />
          </div>
        </div>
      </header>

      {/* Modal Sélecteur d'Entrepôt */}
      <WarehouseSelectorModal
        isOpen={warehouseModalOpen}
        onClose={() => setWarehouseModalOpen(false)}
      />
    </>
  )
}
