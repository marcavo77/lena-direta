"use client"

import React, { useState, useEffect } from "react"
import { createPortal } from "react-dom"
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
  Mail,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { LanguageSelector } from "@/components/layout/LanguageSelector"
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon"

interface MobileNavDrawerProps {
  onOpenWarehouseModal: () => void
}

export function MobileNavDrawer({ onOpenWarehouseModal }: MobileNavDrawerProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>("bois-chauffage")
  const [user, setUser] = useState<{ email?: string; id?: string } | null>(null)

  useEffect(() => {
    setMounted(true)
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

  // ================= VERROUILLAGE STRICT DU SCROLL ARRIÈRE-PLAN =================
  useEffect(() => {
    if (!open) return

    const scrollY = window.scrollY
    const originalBodyOverflow = document.body.style.overflow
    const originalBodyPosition = document.body.style.position
    const originalBodyTop = document.body.style.top
    const originalBodyWidth = document.body.style.width
    const originalHtmlOverflow = document.documentElement.style.overflow

    // Verrouillage de la page en arrière-plan
    document.body.style.overflow = "hidden"
    document.documentElement.style.overflow = "hidden"
    document.body.style.position = "fixed"
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = "100%"

    return () => {
      document.body.style.overflow = originalBodyOverflow
      document.documentElement.style.overflow = originalHtmlOverflow
      document.body.style.position = originalBodyPosition
      document.body.style.top = originalBodyTop
      document.body.style.width = originalBodyWidth
      window.scrollTo(0, scrollY)
    }
  }, [open])

  // Fermeture lors de l'appui sur la touche Échap
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    closeMenu()
    window.location.reload()
  }

  const toggleSection = (sec: string) => {
    setExpandedSection(expandedSection === sec ? null : sec)
  }

  const closeMenu = () => setOpen(false)

  return (
    <>
      {/* Bouton Hamburger Tactile (Minimum 44x44px) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Ouvrir le menu de navigation"
        aria-expanded={open}
        className="lg:hidden w-11 h-11 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-200 hover:text-amber-400 hover:border-amber-500/40 transition-colors shrink-0"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* ================= TIROIR VIA PORTAL DIRECTEMENT DANS DOCUMENT.BODY ================= */}
      {mounted &&
        open &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex justify-end"
            role="dialog"
            aria-modal="true"
            aria-label="Menu principal de navigation"
          >
            {/* Voile sombre d'arrière-plan (Backdrop) */}
            <div
              onClick={closeMenu}
              onTouchMove={(e) => {
                e.preventDefault()
              }}
              className="fixed inset-0 bg-stone-950/85 backdrop-blur-sm z-[90] transition-opacity duration-200 animate-in fade-in"
              aria-hidden="true"
            />

            {/* Panneau du Tiroir (Opaque, pleine hauteur 100dvh, indépendant du header) */}
            <div className="mobile-drawer-content fixed inset-y-0 right-0 w-full max-w-sm sm:max-w-md bg-[#141211] border-l border-stone-800 h-[100dvh] h-screen flex flex-col z-[100] text-stone-100 shadow-2xl animate-in slide-in-from-right duration-250 overscroll-contain select-none">
              {/* En-tête Tiroir */}
              <div className="p-4 border-b border-stone-800 flex items-center justify-between bg-stone-950 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center">
                    <Flame className="w-5 h-5 fill-stone-950" />
                  </div>
                  <span className="font-black text-base">
                    <span className="text-black dark:text-stone-100 logo-lena">Leña</span>
                    <span className="text-amber-500">Directa</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <LanguageSelector />
                  <button
                    type="button"
                    onClick={closeMenu}
                    aria-label="Fermer le menu"
                    className="w-9 h-9 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-300 hover:text-stone-100 active:scale-95 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Actions Rapides en haut */}
              <div className="p-4 border-b border-stone-800 space-y-2 bg-[#181615] shrink-0">
                {/* Bouton Choisir mon entrepôt */}
                <button
                  type="button"
                  onClick={() => {
                    closeMenu()
                    onOpenWarehouseModal()
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs active:scale-[0.99] transition-transform"
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
                    {user.email === "admin@lena-directa.company" ? (
                      <Link
                        href="/admin"
                        onClick={closeMenu}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-amber-950/60 border border-amber-800/80 text-amber-400 font-black text-xs hover:bg-amber-900/60 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Flame className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>Administration Scierie</span>
                        </div>
                        <span className="text-[10px] bg-amber-500 text-stone-950 px-2 py-0.5 rounded font-black">Accéder</span>
                      </Link>
                    ) : (
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
                    )}

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

              {/* Navigation en Accordéons (Défilement fluide confiné au tiroir) */}
              <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-2 text-xs">
                {/* Boutique générale */}
                <Link
                  href="/catalogue"
                  onClick={closeMenu}
                  className="block p-3 rounded-xl font-bold uppercase tracking-wider text-amber-400 hover:bg-stone-900 transition-colors bg-stone-900/40 border border-stone-800/60"
                >
                  Toute la Boutique
                </Link>

                {/* Accordéon 1 : Bois de chauffage */}
                <div className="border border-stone-800/80 rounded-xl overflow-hidden bg-stone-900/40">
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
                <div className="border border-stone-800/80 rounded-xl overflow-hidden bg-stone-900/40">
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
                <div className="border border-stone-800/80 rounded-xl overflow-hidden bg-stone-900/40">
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

                {/* Accordéon 4 : Charbon de Bois & Restauration */}
                <div className="border border-stone-800/80 rounded-xl overflow-hidden bg-stone-900/40">
                  <button
                    type="button"
                    onClick={() => toggleSection("charbon")}
                    className="w-full p-3.5 flex items-center justify-between font-bold text-stone-200 uppercase tracking-wider text-xs"
                  >
                    <span>Charbon de Bois (Pro &amp; Resto)</span>
                    <ChevronDown
                      className={`w-4 h-4 text-stone-400 transition-transform ${
                        expandedSection === "charbon" ? "rotate-180 text-amber-400" : ""
                      }`}
                    />
                  </button>
                  {expandedSection === "charbon" && (
                    <div className="p-3 pt-0 space-y-2 text-stone-300 border-t border-stone-800/60 mt-1">
                      <Link
                        href="/charbon-de-bois"
                        onClick={closeMenu}
                        className="block py-1.5 px-2 rounded bg-stone-900 font-bold text-amber-400"
                      >
                        Tout voir en Charbon de Bois →
                      </Link>
                      <Link
                        href="/produit/charbon-de-bois-hexagonal-extrude-sac-10kg"
                        onClick={closeMenu}
                        className="block py-1.5 px-2 rounded hover:bg-stone-800 hover:text-amber-400"
                      >
                        Charbon Hexagonal Resto 10 kg (Trou central)
                      </Link>
                      <Link
                        href="/produit/pack-duo-20kg-charbon-hexagonal-haute-performance"
                        onClick={closeMenu}
                        className="block py-1.5 px-2 rounded hover:bg-stone-800 hover:text-amber-400"
                      >
                        Pack Duo 20 kg (2 x 10 kg)
                      </Link>
                      <Link
                        href="/produit/palette-pro-charbon-hexagonal-extrude-1000kg"
                        onClick={closeMenu}
                        className="block py-1.5 px-2 rounded hover:bg-stone-800 hover:text-amber-400"
                      >
                        Palette Pro 1 Tonne (100 sacs de 10 kg)
                      </Link>
                      <Link
                        href="/produit/charbon-de-bois-artisanal-chene-charme-sac-50l"
                        onClick={closeMenu}
                        className="block py-1.5 px-2 rounded hover:bg-stone-800 hover:text-amber-400"
                      >
                        Charbon Artisanal Français (Sac 50L)
                      </Link>
                    </div>
                  )}
                </div>

                {/* Accordéon 5 : Poêles à Bois & Cuisinières */}
                <div className="border border-stone-800/80 rounded-xl overflow-hidden bg-stone-900/40">
                  <button
                    type="button"
                    onClick={() => toggleSection("poeles")}
                    className="w-full p-3.5 flex items-center justify-between font-bold text-stone-200 uppercase tracking-wider text-xs"
                  >
                    <span>Poêles à Bois &amp; Cuisinières</span>
                    <ChevronDown
                      className={`w-4 h-4 text-stone-400 transition-transform ${
                        expandedSection === "poeles" ? "rotate-180 text-amber-400" : ""
                      }`}
                    />
                  </button>
                  {expandedSection === "poeles" && (
                    <div className="p-3 pt-0 space-y-2 text-stone-300 border-t border-stone-800/60 mt-1">
                      <Link
                        href="/poeles-a-bois"
                        onClick={closeMenu}
                        className="block py-1.5 px-2 rounded bg-stone-900 font-bold text-amber-400"
                      >
                        Tout voir en Poêles à Bois →
                      </Link>
                      <Link
                        href="/produit/poele-a-bois-avec-four-integre-gourmet-9kw"
                        onClick={closeMenu}
                        className="block py-1.5 px-2 rounded hover:bg-stone-800 hover:text-amber-400"
                      >
                        Poêle avec Four Intégré Gourmet 9 kW
                      </Link>
                      <Link
                        href="/produit/poele-cuisiniere-grand-four-panoramique-11kw"
                        onClick={closeMenu}
                        className="block py-1.5 px-2 rounded hover:bg-stone-800 hover:text-amber-400"
                      >
                        Cuisinière Grand Four 11 kW (Bûches 50cm)
                      </Link>
                      <Link
                        href="/produit/poele-a-bois-fonte-scandinave-epure-7kw"
                        onClick={closeMenu}
                        className="block py-1.5 px-2 rounded hover:bg-stone-800 hover:text-amber-400"
                      >
                        Poêle Scandinave Fonte 7 kW
                      </Link>
                      <Link
                        href="/produit/poele-a-granules-etanche-connecte-wifi-9kw"
                        onClick={closeMenu}
                        className="block py-1.5 px-2 rounded hover:bg-stone-800 hover:text-amber-400"
                      >
                        Poêle à Granulés Étanche WiFi 9 kW
                      </Link>
                    </div>
                  )}
                </div>

                {/* Accordéon 4 : Infos Pratiques */}
                <div className="border border-stone-800/80 rounded-xl overflow-hidden bg-stone-900/40">
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
                  className="flex items-center justify-between p-3 rounded-xl border border-stone-800 font-bold uppercase tracking-wider text-stone-200 hover:bg-stone-900 hover:text-amber-400 transition-colors bg-stone-900/30"
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
                  className="flex items-center justify-between p-3 rounded-xl border border-stone-800 font-bold uppercase tracking-wider text-stone-200 hover:bg-stone-900 hover:text-amber-400 transition-colors bg-stone-900/30"
                >
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-amber-500" />
                    <span>Contact &amp; Assistance Scierie</span>
                  </span>
                  <span className="text-[10px] text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded normal-case tracking-normal">
                    Email
                  </span>
                </Link>

                {/* Accordéon 5 : LeñaDirecta */}
                <div className="border border-stone-800/80 rounded-xl overflow-hidden bg-stone-900/40">
                  <button
                    type="button"
                    onClick={() => toggleSection("lenadireta")}
                    className="w-full p-3.5 flex items-center justify-between font-bold text-stone-200 uppercase tracking-wider text-xs"
                  >
                    <span>LeñaDirecta</span>
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
                      <Link
                        href="/contact"
                        onClick={closeMenu}
                        className="py-1.5 px-2 rounded hover:bg-stone-800 hover:text-amber-400 flex items-center justify-between text-stone-200 font-medium"
                      >
                        <span className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-amber-500" />
                          <span>Contact &amp; Envoi d&apos;email</span>
                        </span>
                        <span className="text-[10px] text-amber-500 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">
                          Formulaire
                        </span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Pied du tiroir avec WhatsApp */}
              <div className="p-4 border-t border-stone-800 bg-stone-950 space-y-2 shrink-0">
                <a
                  href="https://wa.me/34672868332"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider active:scale-[0.99] transition-transform"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>+34 672 86 83 32 (WhatsApp)</span>
                </a>

                <div className="text-center text-[10px] text-stone-400 pt-1 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Avis Vérifiés 4.8/5 • Bois sec garanti H1</span>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
