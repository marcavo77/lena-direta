"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ShieldCheck,
  Truck,
  MapPin,
  Calendar,
  CreditCard,
  Building2,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  Phone,
  User,
  Mail,
  ChevronRight,
  Warehouse,
} from "lucide-react"
import { useCartStore } from "@/lib/store/cart"
import { formatPrice } from "@/lib/utils"
import { AccessDiagnostic } from "@/components/checkout/AccessDiagnostic"
import { createOrder } from "@/app/actions/order"

export default function CheckoutTunnelPage() {
  const router = useRouter()
  const {
    items,
    getItemCount,
    getSubtotalCents,
    getVolumeDiscountCents,
    getDriveDiscountCents,
    getEffectiveDeliveryFeeCents,
    getTotalCents,
    fulfillmentMethod,
    setFulfillmentMethod,
    promoCode,
    promoDiscountCents,
    postalCode: initialPostalCode,
    departmentName,
    accessDiagnostic,
    setAccessDiagnostic,
    clearCart,
  } = useCartStore()

  // Étape courante (1: Coordonnées, 2: Accessibilité, 3: Modalités, 4: Paiement)
  const [step, setStep] = useState<number>(1)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Champs de formulaire
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [streetAddress, setStreetAddress] = useState("")
  const [postalCode, setPostalCode] = useState(initialPostalCode || "")
  const [city, setCity] = useState("")
  const [deliveryNotes, setDeliveryNotes] = useState("")

  // Étape 3 : Modalités
  const [preferredWeek, setPreferredWeek] = useState("Semaine prochaine (J+3 à J+5)")
  const [preferredTimeSlot, setPreferredTimeSlot] = useState<"morning" | "afternoon" | "flexible">(
    "flexible"
  )

  // Étape 4 : Paiement - Virement Bancaire (RIB) par défaut selon modèle bois & scierie
  const [paymentMethod, setPaymentMethod] = useState<"card" | "deposit" | "transfer">("transfer")
  const [cgvAccepted, setCgvAccepted] = useState(false)

  const count = getItemCount()
  const subtotal = getSubtotalCents()
  const volumeDiscount = getVolumeDiscountCents()
  const driveDiscount = getDriveDiscountCents()
  const deliveryFee = getEffectiveDeliveryFeeCents()
  const total = getTotalCents()

  // Redirection si panier vide (après hydratation client)
  const [isHydrated, setIsHydrated] = useState(false)
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (isHydrated && items.length === 0) {
    return (
      <div className="bg-[#121110] min-h-screen text-stone-100 flex items-center justify-center p-4">
        <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center mx-auto mb-4 text-amber-500">
            <Truck className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-stone-100">Votre panier est vide</h1>
          <p className="text-xs text-stone-400 mt-2 mb-6">
            Sélectionnez vos palettes de bois de chauffage ou granulés pour démarrer votre commande.
          </p>
          <Link
            href="/catalogue"
            className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3.5 px-4 rounded-xl text-sm transition-all"
          >
            Explorer le catalogue
          </Link>
        </div>
      </div>
    )
  }

  // Validation d'étape avant de passer à la suivante
  const handleNextStep = () => {
    setErrorMessage(null)

    if (step === 1) {
      if (!customerName.trim()) {
        setErrorMessage("Veuillez renseigner votre nom complet.")
        return
      }
      if (!customerEmail.trim() || !customerEmail.includes("@")) {
        setErrorMessage("Veuillez renseigner une adresse email valide.")
        return
      }
      if (!customerPhone.trim() || customerPhone.length < 10) {
        setErrorMessage("Numéro de téléphone mobile indispensable pour la prise de RDV transporteur.")
        return
      }
      if (fulfillmentMethod === "delivery") {
        if (!streetAddress.trim()) {
          setErrorMessage("Veuillez indiquer l'adresse de livraison exacte.")
          return
        }
        if (!postalCode.trim() || postalCode.length < 4) {
          setErrorMessage("Veuillez renseigner le code postal.")
          return
        }
        if (!city.trim()) {
          setErrorMessage("Veuillez indiquer la ville.")
          return
        }
      }
      // Si Drive sélectionné, on peut sauter l'étape 2 (diagnostic camion)
      if (fulfillmentMethod === "drive") {
        setStep(3)
        window.scrollTo({ top: 0, behavior: "smooth" })
        return
      }
      setStep(2)
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    if (step === 2) {
      if (!accessDiagnostic?.confirmed) {
        setErrorMessage("Veuillez valider l'engagement d'accessibilité camion avant de poursuivre.")
        return
      }
      setStep(3)
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    if (step === 3) {
      setStep(4)
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }
  }

  // Soumission finale de la commande
  const handleFinalOrder = async () => {
    setErrorMessage(null)
    if (!cgvAccepted) {
      setErrorMessage("Veuillez accepter les Conditions Générales de Vente pour finaliser.")
      return
    }

    setSubmitting(true)

    try {
      const res = await createOrder({
        customerName,
        customerEmail,
        customerPhone,
        streetAddress: fulfillmentMethod === "drive" ? "Retrait Dépôt LenaDireta Nangis (77)" : streetAddress,
        postalCode: fulfillmentMethod === "drive" ? "77370" : postalCode,
        city: fulfillmentMethod === "drive" ? "Nangis" : city,
        deliveryNotes,
        fulfillmentMethod,
        preferredWeek,
        preferredTimeSlot,
        paymentMethod,
        promoCode,
        items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        accessDiagnostic: fulfillmentMethod === "delivery" ? accessDiagnostic : null,
      })

      if (res.success && res.orderId) {
        clearCart()
        router.push(`/confirmation/${res.orderId}`)
      } else {
        setErrorMessage(res.error || "Une erreur est survenue lors de l'enregistrement.")
        setSubmitting(false)
      }
    } catch {
      setErrorMessage("Erreur technique. Veuillez contacter notre service commercial au 01 89 00 00 00.")
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-[#121110] min-h-screen text-stone-100 py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* En-tête Sécurisé & Retour Panier */}
        <div className="flex items-center justify-between pb-6 border-b border-stone-800 mb-8">
          <Link
            href="/panier"
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-400 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au panier</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-stone-400">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Tunnel 100% Sécurisé SSL 256-bit</span>
          </div>
        </div>

        {/* Indicateur d'Étapes Mobile-First */}
        <div className="mb-8">
          <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
            {/* Étape 1 */}
            <button
              type="button"
              onClick={() => step > 1 && setStep(1)}
              className={`p-2 sm:p-3 rounded-xl border text-xs transition-all ${
                step === 1
                  ? "border-amber-500 bg-amber-500/10 text-amber-400 font-bold"
                  : step > 1
                  ? "border-emerald-500/40 bg-stone-900 text-stone-300"
                  : "border-stone-800 bg-stone-950/40 text-stone-600"
              }`}
            >
              <div className="text-[10px] uppercase font-bold tracking-wider mb-0.5">Étape 1</div>
              <div className="truncate">Coordonnées</div>
            </button>

            {/* Étape 2 (Accessible seulement si livraison) */}
            <button
              type="button"
              disabled={fulfillmentMethod === "drive" || step < 2}
              onClick={() => step > 2 && setStep(2)}
              className={`p-2 sm:p-3 rounded-xl border text-xs transition-all ${
                fulfillmentMethod === "drive"
                  ? "border-stone-800/40 bg-stone-950/20 text-stone-600 line-through"
                  : step === 2
                  ? "border-amber-500 bg-amber-500/10 text-amber-400 font-bold"
                  : step > 2
                  ? "border-emerald-500/40 bg-stone-900 text-stone-300"
                  : "border-stone-800 bg-stone-950/40 text-stone-600"
              }`}
            >
              <div className="text-[10px] uppercase font-bold tracking-wider mb-0.5">Étape 2</div>
              <div className="truncate">{fulfillmentMethod === "drive" ? "Drive (Exempt)" : "Accès 19T"}</div>
            </button>

            {/* Étape 3 */}
            <button
              type="button"
              onClick={() => step > 3 && setStep(3)}
              disabled={step < 3}
              className={`p-2 sm:p-3 rounded-xl border text-xs transition-all ${
                step === 3
                  ? "border-amber-500 bg-amber-500/10 text-amber-400 font-bold"
                  : step > 3
                  ? "border-emerald-500/40 bg-stone-900 text-stone-300"
                  : "border-stone-800 bg-stone-950/40 text-stone-600"
              }`}
            >
              <div className="text-[10px] uppercase font-bold tracking-wider mb-0.5">Étape 3</div>
              <div className="truncate">Créneau</div>
            </button>

            {/* Étape 4 */}
            <button
              type="button"
              disabled={step < 4}
              className={`p-2 sm:p-3 rounded-xl border text-xs transition-all ${
                step === 4
                  ? "border-amber-500 bg-amber-500/10 text-amber-400 font-bold"
                  : "border-stone-800 bg-stone-950/40 text-stone-600"
              }`}
            >
              <div className="text-[10px] uppercase font-bold tracking-wider mb-0.5">Étape 4</div>
              <div className="truncate">Règlement</div>
            </button>
          </div>
        </div>

        {/* Message d'Erreur Global */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="font-medium">{errorMessage}</div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Formulaires d'Étapes (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* ===================== ÉTAPE 1 : COORDONNÉES ===================== */}
            {step === 1 && (
              <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-5 sm:p-7 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-stone-100 flex items-center gap-2">
                    <User className="w-5 h-5 text-amber-500" />
                    <span>Vos coordonnées de facturation &amp; contact</span>
                  </h2>
                  <p className="text-xs text-stone-400 mt-1">
                    Le numéro de téléphone mobile est indispensable : le transporteur vous appellera pour convenir du rendez-vous.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1.5">
                      Nom et Prénom *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jean Dupont"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-sm text-stone-100 focus:outline-none focus:border-amber-500 min-h-[44px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-300 mb-1.5">
                        Adresse Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="jean.dupont@exemple.fr"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-sm text-stone-100 focus:outline-none focus:border-amber-500 min-h-[44px]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-300 mb-1.5">
                        Téléphone Mobile (RDV livreur) *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="06 12 34 56 78"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-sm text-stone-100 focus:outline-none focus:border-amber-500 min-h-[44px]"
                      />
                    </div>
                  </div>

                  {/* Section Adresse (si livraison à domicile) */}
                  {fulfillmentMethod === "delivery" ? (
                    <div className="pt-4 border-t border-stone-800 space-y-4">
                      <h3 className="text-sm font-bold text-stone-200 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-amber-500" />
                        <span>Adresse de livraison du combustible</span>
                      </h3>

                      <div>
                        <label className="block text-xs font-bold text-stone-300 mb-1.5">
                          Numéro et nom de rue / voie d'accès *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="14 chemin des Chênes"
                          value={streetAddress}
                          onChange={(e) => setStreetAddress(e.target.value)}
                          className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-sm text-stone-100 focus:outline-none focus:border-amber-500 min-h-[44px]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-stone-300 mb-1.5">
                            Code Postal *
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            maxLength={5}
                            required
                            placeholder="77000"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-sm text-stone-100 font-mono focus:outline-none focus:border-amber-500 min-h-[44px]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-300 mb-1.5">
                            Ville *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Melun"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-sm text-stone-100 focus:outline-none focus:border-amber-500 min-h-[44px]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-300 mb-1.5">
                          Instructions particulières pour le portail / interphone (optionnel)
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Code portail, présence de chiens, portillon à gauche..."
                          value={deliveryNotes}
                          onChange={(e) => setDeliveryNotes(e.target.value)}
                          className="w-full bg-stone-900 border border-stone-700 rounded-xl p-3 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="pt-4 border-t border-stone-800 p-4 rounded-xl bg-stone-900/60 border border-stone-800 text-xs text-stone-300">
                      <div className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                        <Warehouse className="w-4 h-4" /> Mode Retrait Drive Dépôt
                      </div>
                      Vos palettes seront mises à disposition sous 24h ouvrées au Dépôt Central LenaDireta (D140, 77370 Nangis). Munissez-vous de votre confirmation et d'un véhicule adapté.
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-4 px-6 rounded-xl transition-all min-h-[48px]"
                >
                  <span>Continuer vers {fulfillmentMethod === "drive" ? "le créneau de retrait" : "le diagnostic d'accès"}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* ===================== ÉTAPE 2 : DIAGNOSTIC D'ACCÈS ===================== */}
            {step === 2 && (
              <div className="space-y-6">
                <AccessDiagnostic
                  value={accessDiagnostic}
                  onChange={(d) => setAccessDiagnostic(d)}
                />

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-900 border border-stone-800 text-stone-300 font-bold py-3.5 px-5 rounded-xl text-xs hover:border-stone-700 transition-colors min-h-[44px]"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Modifier mes coordonnées</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3.5 px-6 rounded-xl transition-all min-h-[44px]"
                  >
                    <span>Valider l'accès et choisir le créneau</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* ===================== ÉTAPE 3 : CRÉNEAU & MODALITÉS ===================== */}
            {step === 3 && (
              <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-5 sm:p-7 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-stone-100 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-amber-500" />
                    <span>Créneau &amp; Modalités de prise de rendez-vous</span>
                  </h2>
                  <p className="text-xs text-stone-400 mt-1">
                    Indiquez vos disponibilités prioritaires. Notre transporteur affine la demi-journée exacte par appel direct.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-2">
                      Période de livraison souhaitée
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {[
                        "Semaine prochaine (J+3 à J+5)",
                        "Dans 2 semaines",
                        "Commande différée (Plus de 3 semaines)",
                      ].map((week) => (
                        <button
                          key={week}
                          type="button"
                          onClick={() => setPreferredWeek(week)}
                          className={`p-3 rounded-xl border text-left text-xs transition-all ${
                            preferredWeek === week
                              ? "border-amber-500 bg-amber-500/10 text-stone-100 font-bold"
                              : "border-stone-800 bg-stone-900/60 text-stone-300 hover:border-stone-700"
                          }`}
                        >
                          <div className="font-bold text-stone-100">{week}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-2">
                      Plage horaire préférée
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setPreferredTimeSlot("morning")}
                        className={`p-3 rounded-xl border text-left text-xs transition-all ${
                          preferredTimeSlot === "morning"
                            ? "border-amber-500 bg-amber-500/10 text-stone-100 font-bold"
                            : "border-stone-800 bg-stone-900/60 text-stone-300 hover:border-stone-700"
                        }`}
                      >
                        <div className="font-bold text-stone-100">Matinée (8h - 13h)</div>
                        <div className="text-[11px] text-stone-400 mt-0.5">Premier tour de tournée</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPreferredTimeSlot("afternoon")}
                        className={`p-3 rounded-xl border text-left text-xs transition-all ${
                          preferredTimeSlot === "afternoon"
                            ? "border-amber-500 bg-amber-500/10 text-stone-100 font-bold"
                            : "border-stone-800 bg-stone-900/60 text-stone-300 hover:border-stone-700"
                        }`}
                      >
                        <div className="font-bold text-stone-100">Après-midi (13h - 18h)</div>
                        <div className="text-[11px] text-stone-400 mt-0.5">Second tour</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPreferredTimeSlot("flexible")}
                        className={`p-3 rounded-xl border text-left text-xs transition-all ${
                          preferredTimeSlot === "flexible"
                            ? "border-amber-500 bg-amber-500/10 text-stone-100 font-bold"
                            : "border-stone-800 bg-stone-900/60 text-stone-300 hover:border-stone-700"
                        }`}
                      >
                        <div className="font-bold text-stone-100">Toute la journée</div>
                        <div className="text-[11px] text-stone-400 mt-0.5">Livraison prioritaire plus rapide</div>
                      </button>
                    </div>
                  </div>

                  {/* Rappel du protocole de livraison */}
                  <div className="p-4 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-300 space-y-2">
                    <div className="font-bold text-amber-400 flex items-center gap-1.5">
                      <Clock className="w-4 h-4" /> Protocole de livraison sécurisée :
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-stone-400 text-[11px]">
                      <li>Le transporteur vous appelle 24 à 48h avant pour fixer l'heure de passage.</li>
                      <li>Présence obligatoire d'un adulte pour signer le bordereau de conformité.</li>
                      <li>Dépose au plus près de votre stockage selon l'accessibilité du chariot tout-terrain.</li>
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(fulfillmentMethod === "drive" ? 1 : 2)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-900 border border-stone-800 text-stone-300 font-bold py-3.5 px-5 rounded-xl text-xs hover:border-stone-700 transition-colors min-h-[44px]"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Retour</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3.5 px-6 rounded-xl transition-all min-h-[44px]"
                  >
                    <span>Passer au récapitulatif &amp; paiement</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* ===================== ÉTAPE 4 : PAIEMENT & CONFIRMATION ===================== */}
            {step === 4 && (
              <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-5 sm:p-7 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-stone-100 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-amber-500" />
                    <span>Mode de règlement sécurisé</span>
                  </h2>
                  <p className="text-xs text-stone-400 mt-1">
                    Choisissez votre solution de paiement. Toutes les transactions sont cryptées et protégées par 3D-Secure.
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Option 1 : Virement Bancaire (RIB) - Recommandé par la Scierie */}
                  <label
                    onClick={() => setPaymentMethod("transfer")}
                    className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "transfer"
                        ? "border-amber-500 bg-amber-500/10"
                        : "border-stone-800 bg-stone-900/60 hover:border-stone-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === "transfer"}
                          onChange={() => setPaymentMethod("transfer")}
                          className="w-4 h-4 text-amber-500 focus:ring-amber-500 bg-stone-900 border-stone-700"
                        />
                        <div>
                          <div className="font-bold text-sm text-stone-100 flex items-center gap-2">
                            <span>Virement Bancaire (RIB)</span>
                            <span className="text-[10px] uppercase font-black bg-amber-500 text-stone-950 px-2 py-0.5 rounded">
                              Recommandé • Zéro Frais
                            </span>
                          </div>
                          <div className="text-xs text-stone-400 mt-0.5">
                            Paiement direct à la scierie (Crédit Agricole). Coordonnées bancaires transmises à la confirmation avec référence unique.
                          </div>
                        </div>
                      </div>
                      <Building2 className="w-5 h-5 text-amber-500 hidden sm:block shrink-0" />
                    </div>

                    {paymentMethod === "transfer" && (
                      <div className="mt-3.5 pt-3 border-t border-amber-500/20 text-xs text-stone-300 grid grid-cols-1 sm:grid-cols-3 gap-2 bg-stone-950/60 p-3 rounded-lg font-mono">
                        <div>
                          <span className="text-[10px] uppercase text-stone-500 font-sans block">Titulaire</span>
                          <span className="font-bold text-stone-200">LENADIRETA SAS</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase text-stone-500 font-sans block">Banque</span>
                          <span className="text-stone-300">Crédit Agricole IDF</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase text-stone-500 font-sans block">IBAN Début</span>
                          <span className="text-amber-400 font-bold">FR76 1027 8000 ...</span>
                        </div>
                      </div>
                    )}
                  </label>

                  {/* Option 2 : Virement avec Acompte 30% */}
                  <label
                    onClick={() => setPaymentMethod("deposit")}
                    className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "deposit"
                        ? "border-amber-500 bg-amber-500/10"
                        : "border-stone-800 bg-stone-900/60 hover:border-stone-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === "deposit"}
                          onChange={() => setPaymentMethod("deposit")}
                          className="w-4 h-4 text-amber-500 focus:ring-amber-500 bg-stone-900 border-stone-700"
                        />
                        <div>
                          <div className="font-bold text-sm text-stone-100 flex items-center gap-2">
                            <span>Acompte 30% par virement + Solde à livraison</span>
                            <span className="text-[10px] uppercase font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                              Option Confort
                            </span>
                          </div>
                          <div className="text-xs text-stone-400 mt-0.5">
                            Acompte de {formatPrice(Math.round(total * 0.3))} par virement pour bloquer les stères, solde de {formatPrice(Math.round(total * 0.7))} au déchargement.
                          </div>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Option 3 : Carte Bancaire */}
                  <label
                    onClick={() => setPaymentMethod("card")}
                    className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "card"
                        ? "border-amber-500 bg-amber-500/10"
                        : "border-stone-800 bg-stone-900/60 hover:border-stone-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === "card"}
                          onChange={() => setPaymentMethod("card")}
                          className="w-4 h-4 text-amber-500 focus:ring-amber-500 bg-stone-900 border-stone-700"
                        />
                        <div>
                          <div className="font-bold text-sm text-stone-100">
                            Carte Bancaire (CB, Visa, Mastercard)
                          </div>
                          <div className="text-xs text-stone-400 mt-0.5">
                            Paiement immédiat 100% sécurisé via passerelle bancaire 3D-Secure
                          </div>
                        </div>
                      </div>
                      <div className="hidden sm:flex items-center gap-2 text-stone-400 text-xs font-semibold">
                        <span>CB</span> • <span>VISA</span> • <span>MASTERCARD</span>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Acceptation CGV */}
                <div className="pt-3 border-t border-stone-800">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={cgvAccepted}
                      onChange={(e) => setCgvAccepted(e.target.checked)}
                      className="w-5 h-5 mt-0.5 rounded bg-stone-900 border-stone-700 text-amber-500 focus:ring-amber-500 shrink-0 cursor-pointer"
                    />
                    <span className="text-xs text-stone-300 leading-relaxed group-hover:text-stone-100 transition-colors">
                      J'accepte sans réserve les Conditions Générales de Vente (CGV), les modalités de livraison par porteur 19T et je confirme être majeur(e).
                    </span>
                  </label>
                </div>

                {/* Bouton Final de Confirmation */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={submitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-900 border border-stone-800 text-stone-300 font-bold py-4 px-5 rounded-xl text-xs hover:border-stone-700 transition-colors min-h-[48px]"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Modifier le créneau</span>
                  </button>

                  <button
                    type="button"
                    disabled={submitting || !cgvAccepted}
                    onClick={handleFinalOrder}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-stone-950 font-black py-4 px-6 rounded-xl transition-all min-h-[48px] text-base shadow-lg shadow-amber-500/10"
                  >
                    {submitting ? (
                      <span>Validation en cours...</span>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        <span>Confirmer ma commande ({formatPrice(total)})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Récapitulatif Panier Fixe à Droite (4 cols) */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
            <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <h3 className="font-bold text-sm text-stone-100">Votre Sélection ({count})</h3>
                <span className="text-xs text-amber-500 font-bold">
                  {fulfillmentMethod === "drive" ? "Retrait Dépôt" : "Livraison"}
                </span>
              </div>

              {/* Liste miniature */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3 items-center">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-stone-900 border border-stone-800">
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <div className="font-semibold text-stone-200 truncate">{item.product.name}</div>
                      <div className="text-stone-400 text-[11px]">Qté : {item.quantity}</div>
                    </div>
                    <div className="font-bold text-xs text-amber-400">
                      {formatPrice(item.product.unit_price_cents * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Lignes de calcul */}
              <div className="pt-3 border-t border-stone-800 space-y-2 text-xs">
                <div className="flex justify-between text-stone-300">
                  <span>Sous-total articles</span>
                  <span className="font-bold text-stone-100">{formatPrice(subtotal)}</span>
                </div>

                {volumeDiscount > 0 && (
                  <div className="flex justify-between text-amber-400 font-bold">
                    <span>Remise volume</span>
                    <span>-{formatPrice(volumeDiscount)}</span>
                  </div>
                )}

                {driveDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Économie Retrait Drive</span>
                    <span>-{formatPrice(driveDiscount)}</span>
                  </div>
                )}

                {promoDiscountCents > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Code {promoCode}</span>
                    <span>-{formatPrice(promoDiscountCents)}</span>
                  </div>
                )}

                <div className="flex justify-between text-stone-300">
                  <span>Frais de transport</span>
                  <span className="font-bold text-stone-100">
                    {fulfillmentMethod === "drive"
                      ? "Gratuit (Drive)"
                      : deliveryFee > 0
                      ? formatPrice(deliveryFee)
                      : "Offerts"}
                  </span>
                </div>

                <div className="pt-2 border-t border-stone-800 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-stone-100">Total TTC</span>
                  <span className="text-xl font-black text-amber-400">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Engagements de confiance */}
              <div className="pt-3 border-t border-stone-800 text-[11px] text-stone-400 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Bois H1 certifié &lt; 20% d'humidité</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Camion porteur avec chariot élévateur</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Prise de RDV téléphonique préalable</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
