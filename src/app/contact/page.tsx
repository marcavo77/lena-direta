"use client"

import { useState } from "react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import Link from "next/link"
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Building2,
  ChevronRight,
  ShieldCheck,
  Truck,
  Flame,
} from "lucide-react"

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    // Simulation de transmission sécurisée au service client
    setTimeout(() => {
      setSubmitting(false)
      setSuccess(true)
    }, 800)
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
              <span className="text-stone-200">Contact &amp; Assistance Scierie</span>
            </nav>
          </div>
        </div>

        {/* Hero Section Contact */}
        <section className="bg-[#181615] border-b border-stone-800 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                <Phone className="w-4 h-4 text-amber-500" />
                <span>Exploitation Forestière &amp; Service Logistique</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-stone-100 tracking-tight leading-tight">
                Contactez Notre <span className="text-amber-500">Équipe Terroir</span>
              </h1>

              <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
                Une question sur le cubage de votre bois, un passage étroit pour notre camion ou les modalités de votre virement bancaire ? Nos conseillers basés à la scierie vous répondent directement sans passer par un centre d&apos;appel délocalisé.
              </p>
            </div>
          </div>
        </section>

        {/* Coordonnées & Formulaire */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Colonne Gauche : Formulaire de Contact (7 cols) */}
            <div className="lg:col-span-7 bg-[#1c1917] border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-stone-100">
                  Envoyer un message à l&apos;exploitation
                </h2>
                <p className="text-xs text-stone-400 mt-1">
                  Réponse garantie sous 24h ouvrées par un spécialiste forestier.
                </p>
              </div>

              {success ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm space-y-2 text-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <div className="font-bold text-base text-stone-100">
                    Message transmis avec succès !
                  </div>
                  <p className="text-stone-300 leading-relaxed max-w-md mx-auto">
                    Merci pour votre prise de contact. Notre responsable logistique ou commercial traitera votre demande dans les plus brefs délais.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  {error && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-stone-300 block mb-1.5">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        placeholder="Ex: Jean Dupont"
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-stone-100 text-xs focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-stone-300 block mb-1.5">
                        Numéro de téléphone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="Ex: 06 12 34 56 78"
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-stone-100 text-xs focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-stone-300 block mb-1.5">
                      Adresse email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="Ex: jean.dupont@email.fr"
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-stone-100 text-xs focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-300 block mb-1.5">
                      Objet de votre demande *
                    </label>
                    <select
                      name="subject"
                      required
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-stone-100 text-xs focus:outline-none focus:border-amber-500 transition-colors"
                    >
                      <option value="conseil">Conseil de cubage / Choix de combustible</option>
                      <option value="livraison">Question sur la livraison et l&apos;accès camion 19T</option>
                      <option value="virement">Information sur le paiement par Virement Bancaire (RIB)</option>
                      <option value="devis">Demande de devis gros volume (copropriété, pro)</option>
                      <option value="autre">Autre demande</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-stone-300 block mb-1.5">
                      Votre message ou précision sur votre lieu de dépose *
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      required
                      placeholder="Décrivez votre projet de chauffage, votre commune ou vos contraintes d'accès (allée, graviers, pente)..."
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl p-4 text-stone-100 text-xs focus:outline-none focus:border-amber-500 transition-colors leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-black py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 min-h-[46px] disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? "Envoi en cours..." : "Envoyer ma demande"}</span>
                  </button>
                </form>
              )}
            </div>

            {/* Colonne Droite : Coordonnées Directes & Infos Utiles (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Téléphone direct */}
              <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                      Standard Téléphonique Direct
                    </span>
                    <h3 className="font-bold text-base text-stone-100">
                      01 89 00 00 00
                    </h3>
                  </div>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Ligne directe sans surtaxe. Nos conseillers sont joignables du <strong>lundi au samedi de 8h00 à 19h00</strong>.
                </p>
                <a
                  href="tel:0189000000"
                  className="block text-center py-2.5 px-4 rounded-xl bg-stone-900 border border-stone-800 hover:border-amber-500 text-amber-400 font-bold text-xs transition-colors"
                >
                  Appeler maintenant
                </a>
              </div>

              {/* Siège & Scierie */}
              <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-6 space-y-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                      Exploitation &amp; Scierie
                    </span>
                    <h3 className="font-bold text-base text-stone-100">
                      LenaDireta SAS
                    </h3>
                  </div>
                </div>

                <div className="space-y-1 text-stone-300">
                  <p>Route Forestière de la Scierie</p>
                  <p>77370 Nangis — Seine-et-Marne</p>
                  <p className="text-stone-400 pt-1">
                    SIRET : 894 123 456 00012 • TVA : FR82894123456
                  </p>
                </div>
              </div>

              {/* RIB & Comptabilité */}
              <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-6 space-y-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                      Service Comptabilité &amp; Virements
                    </span>
                    <h3 className="font-bold text-base text-stone-100">
                      Crédit Agricole d&apos;Île-de-France
                    </h3>
                  </div>
                </div>

                <p className="text-stone-400 leading-relaxed text-[11px]">
                  Pour tout justificatif de virement, transmettez l&apos;avis bancaire avec votre numéro de commande à <strong className="text-stone-200">contact@lenadireta.fr</strong>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
