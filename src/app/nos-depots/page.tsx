"use client"

import { useState } from "react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import Link from "next/link"
import {
  Warehouse,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  Truck,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react"
import { useCartStore } from "@/lib/store/cart"

const DEPOTS = [
  {
    id: "depot-nangis",
    name: "Dépôt Principal Nangis (77) - Exploitation & Scierie",
    badge: "Exploitation Forestière • Stock permanent",
    address: "Route Forestière de la Scierie",
    city: "77370 Nangis",
    phone: "01 89 00 00 00",
    hours: "Lun - Ven : 8h00 - 18h30 • Sam : 8h00 - 16h00",
    description: "Siège de l'exploitation. Tous nos produits sont stockés sous hangars ventilés. Pont-bascule et chariots gros tonnage.",
    access: "Accès poids lourds, véhicules légers et remorques sans restriction.",
  },
  {
    id: "depot-melun",
    name: "Dépôt Melun - Sud Seine-et-Marne (77)",
    badge: "Hub Régional",
    address: "14 Avenue des Artisans",
    city: "77000 Melun",
    phone: "01 89 00 00 00",
    hours: "Lun - Ven : 8h30 - 18h00 • Sam : 8h30 - 13h00",
    description: "Plateforme logistique pour l'agglomération melunaise et Fontainebleau. Chargement rapide au chariot élévateur.",
    access: "Proche N105 et A5. Accès facile remorques et utilitaires.",
  },
  {
    id: "depot-meaux",
    name: "Dépôt Meaux - Nord Seine-et-Marne (77)",
    badge: "Hub Régional",
    address: "ZI des Saules, Rue des Scieurs",
    city: "77100 Meaux",
    phone: "01 89 00 00 00",
    hours: "Lun - Ven : 8h00 - 18h00 • Sam : 8h00 - 12h30",
    description: "Dépôt desservant tout le nord 77, l'Oise et le Val-d'Oise. Bûches 33cm, 50cm et pellets Din+ en stock continu.",
    access: "À 5 minutes de la RN3. Quai de chargement et cariste disponible.",
  },
  {
    id: "depot-evry",
    name: "Dépôt Évry / Corbeil - Essonne (91)",
    badge: "Plateforme Essonne",
    address: "Plateforme Logistique des Bois, Route de Melun",
    city: "91100 Corbeil-Essonnes",
    phone: "01 89 00 00 00",
    hours: "Lun - Ven : 8h30 - 17h30 • Sam fermé",
    description: "Centre logistique dédié à l'Essonne et au Sud Francilien. Chargement direct sur plateau ou dans véhicule utilitaire.",
    access: "Sortie immédiate Francilienne N104 / A6.",
  },
]

export default function NosDepotsPage() {
  const { setFulfillmentMethod, fulfillmentMethod } = useCartStore()
  const [selectedDepot, setSelectedDepot] = useState<string | null>("depot-nangis")
  const [confirmedMessage, setConfirmedMessage] = useState<string | null>(null)

  const handleSelectDepot = (depotId: string, depotName: string) => {
    setSelectedDepot(depotId)
    setFulfillmentMethod("drive")
    setConfirmedMessage(`Dépôt « ${depotName} » sélectionné ! Remise de 40 € / palette activée.`)
    setTimeout(() => setConfirmedMessage(null), 4000)
  }

  return (
    <div className="min-h-screen bg-[#121110] text-stone-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 pb-16">
        {/* Fil d'Ariane */}
        <div className="bg-[#1c1917] border-b border-stone-800 py-3.5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <nav className="flex items-center gap-2 text-xs text-stone-400 font-medium">
              <Link href="/" className="hover:text-amber-400 transition-colors">
                Accueil
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
              <span className="text-stone-200">Nos Dépôts Drive</span>
            </nav>
          </div>
        </div>

        {/* Hero Section Nos Dépôts */}
        <section className="bg-[#181615] border-b border-stone-800 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                <Warehouse className="w-4 h-4 text-amber-500" />
                <span>Retrait Drive Scierie • Économie Immédiate</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-stone-100 tracking-tight leading-tight">
                Nos 4 Dépôts &amp; <span className="text-amber-500">Retrait Drive</span>
              </h1>

              <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
                Venez enlever directement vos stères de bois, bûches compressées ou palettes de granulés dans nos dépôts d&apos;Île-de-France. Vous économisez <strong>40 € par palette</strong> sur votre commande et nos caristes chargent l&apos;intégralité de vos palettes au chariot élévateur.
              </p>

              {/* Message de confirmation interactif */}
              {confirmedMessage && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{confirmedMessage}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Grille des 4 Dépôts */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DEPOTS.map((dep) => {
              const isSelected = selectedDepot === dep.id && fulfillmentMethod === "drive"
              return (
                <div
                  key={dep.id}
                  className={`bg-[#1c1917] border-2 rounded-2xl p-6 sm:p-7 space-y-5 transition-all flex flex-col justify-between ${
                    isSelected
                      ? "border-amber-500 bg-amber-500/5 shadow-lg shadow-amber-500/10"
                      : "border-stone-800 hover:border-stone-700"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider bg-stone-900 border border-stone-800 text-amber-400 px-2.5 py-1 rounded-md">
                          {dep.badge}
                        </span>
                        <h3 className="text-lg sm:text-xl font-black text-stone-100 mt-2">
                          {dep.name}
                        </h3>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="inline-block bg-amber-500 text-stone-950 font-black text-xs px-2 py-0.5 rounded uppercase">
                          -40 € / pal.
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-stone-300 leading-relaxed">
                      {dep.description}
                    </p>

                    <div className="space-y-2 text-xs pt-3 border-t border-stone-800/80">
                      <div className="flex items-center gap-2 text-stone-300">
                        <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>
                          {dep.address}, {dep.city}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-stone-300">
                        <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>{dep.hours}</span>
                      </div>

                      <div className="flex items-center gap-2 text-stone-300">
                        <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>{dep.phone}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-stone-900/60 border border-stone-800/80 rounded-xl text-[11px] text-stone-400">
                      <strong className="text-stone-300">Accès matériel : </strong>
                      {dep.access}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-800 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => handleSelectDepot(dep.id, dep.name)}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all min-h-[44px] ${
                        isSelected
                          ? "bg-emerald-600 text-white"
                          : "bg-amber-500 hover:bg-amber-400 text-stone-950"
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Dépôt Drive Actif (-40 € / palette)</span>
                        </>
                      ) : (
                        <>
                          <Warehouse className="w-4 h-4" />
                          <span>Choisir ce Dépôt pour ma commande</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Comment fonctionne le Drive en 4 étapes */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="bg-[#181615] border border-stone-800 rounded-2xl p-6 sm:p-10 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
                Protocole Sans Effort
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-100 mt-1">
                Le Retrait Drive en 4 Étapes Simples
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mt-1">
                Aucune manutention manuelle à votre charge : nos engins placent la palette directement dans votre véhicule.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-5 rounded-xl bg-stone-900/60 border border-stone-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 font-black flex items-center justify-center text-sm">
                  1
                </div>
                <div className="font-bold text-stone-100">Commande en Ligne</div>
                <p className="text-stone-400 text-[11px] leading-relaxed">
                  Choisissez vos produits en cochant « Retrait Drive » pour déduire immédiatement 40 € par palette.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-stone-900/60 border border-stone-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 font-black flex items-center justify-center text-sm">
                  2
                </div>
                <div className="font-bold text-stone-100">Règlement par Virement ou CB</div>
                <p className="text-stone-400 text-[11px] leading-relaxed">
                  Effectuez votre virement avec le numéro de référence reçu sur votre confirmation de commande.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-stone-900/60 border border-stone-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 font-black flex items-center justify-center text-sm">
                  3
                </div>
                <div className="font-bold text-stone-100">Mise à Disposition</div>
                <p className="text-stone-400 text-[11px] leading-relaxed">
                  Vous recevez un SMS dès que vos palettes sont cerclées et prêtes au quai de chargement.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-stone-900/60 border border-stone-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 font-black flex items-center justify-center text-sm">
                  4
                </div>
                <div className="font-bold text-stone-100">Chargement au Chariot</div>
                <p className="text-stone-400 text-[11px] leading-relaxed">
                  Présentez-vous avec votre remorque ou utilitaire : notre cariste dépose la palette en 3 minutes chrono.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Boutique */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 text-center">
          <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-8 max-w-2xl mx-auto space-y-4">
            <h3 className="text-xl font-black text-stone-100">
              Prêt à passer votre commande en Drive ?
            </h3>
            <p className="text-xs text-stone-400">
              Retrouvez nos stères de chêne 25, 33 et 50 cm ainsi que nos pellets Din+ immédiatement disponibles.
            </p>
            <div className="pt-2">
              <Link
                href="/catalogue"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all min-h-[44px]"
              >
                <span>Accéder à la boutique</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
