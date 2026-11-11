"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Truck,
  Warehouse,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Tag,
  Percent,
  CheckCircle2,
  Clock,
  MapPin,
  AlertCircle,
} from "lucide-react"
import { useCartStore } from "@/lib/store/cart"
import { formatPrice } from "@/lib/utils"
import { checkPostalCodeEligibility } from "@/app/actions/delivery"
import { useIsAdmin } from "@/lib/hooks/useIsAdmin"

export default function CartPage() {
  const { isAdmin } = useIsAdmin()
  const {
    items,
    removeItem,
    updateQuantity,
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
    setPromoCode,
    postalCode,
    departmentName,
    setDeliveryInfo,
  } = useCartStore()

  // État local pour le code postal et le code promo
  const [pcInput, setPcInput] = useState(postalCode || "")
  const [pcLoading, setPcLoading] = useState(false)
  const [pcMessage, setPcMessage] = useState<string | null>(null)

  const [promoInput, setPromoInput] = useState(promoCode || "")
  const [promoError, setPromoError] = useState<string | null>(null)
  const [promoSuccess, setPromoSuccess] = useState<string | null>(
    promoCode ? `Code ${promoCode} appliqué (-${formatPrice(promoDiscountCents)})` : null
  )

  const itemCount = getItemCount()
  const subtotal = getSubtotalCents()
  const volumeDiscount = getVolumeDiscountCents()
  const driveDiscount = getDriveDiscountCents()
  const deliveryFee = getEffectiveDeliveryFeeCents()
  const total = getTotalCents()

  // Calcul du palier de volume pour la barre de progression
  const nextVolumeTier =
    itemCount === 1
      ? { needed: 1, nextDiscount: 2500, label: "Ajoutez 1 palette pour économiser 25 €" }
      : itemCount === 2
      ? { needed: 1, nextDiscount: 6000, label: "Ajoutez 1 palette supplémentaire pour passer à 60 € de remise !" }
      : { needed: 0, nextDiscount: 6000, label: "Remise volume maximale atteinte (-60 €)" }

  const handlePostalCodeCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pcInput || pcInput.trim().length < 2) return

    setPcLoading(true)
    setPcMessage(null)

    try {
      const res = await checkPostalCodeEligibility(pcInput.trim())
      if (res.eligible && res.department) {
        const isFree =
          res.freeShippingThresholdCents !== null && subtotal >= res.freeShippingThresholdCents
        const fee = isFree ? 0 : res.baseFeeCents

        setDeliveryInfo({
          postalCode: pcInput.trim(),
          feeCents: fee,
          eligible: true,
          department: res.department,
        })
        setPcMessage(
          fee === 0
            ? `Livraison GRATUITE (Franco atteint) pour le département ${res.department} !`
            : `Frais de livraison calculés : ${formatPrice(fee)} pour le département ${res.department}.`
        )
      } else {
        setPcMessage(
          res.message || "Zone hors couverture directe. Contactez notre service logistique sur WhatsApp au +34 672 86 83 32."
        )
      }
    } catch {
      setPcMessage("Erreur lors de la vérification. Réessayez.")
    } finally {
      setPcLoading(false)
    }
  }

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault()
    setPromoError(null)
    setPromoSuccess(null)

    if (!promoInput.trim()) return

    const success = setPromoCode(promoInput.trim(), 1500)
    if (success) {
      setPromoSuccess(`Code ${promoInput.trim().toUpperCase()} activé : -15,00 € offerts !`)
    } else {
      setPromoError("Code invalide ou expiré. Essayez 'LENA15' ou 'BIENVENUE'.")
    }
  }

  const handleRemovePromo = () => {
    setPromoCode(null)
    setPromoInput("")
    setPromoSuccess(null)
    setPromoError(null)
  }

  if (isAdmin) {
    return (
      <div className="bg-[#121110] min-h-screen text-stone-100 py-12 sm:py-20 flex items-center justify-center">
        <div className="max-w-xl mx-auto px-4 text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-100">
            Espace Administrateur Scierie
          </h1>
          <p className="text-sm text-stone-400 leading-relaxed">
            Le panier d'achat et le passage de commandes sont strictement réservés aux comptes clients.
            En tant qu'administrateur, vos prérogatives se situent dans la gestion des produits, la supervision des clients et le traitement des commandes.
          </p>
          <div className="pt-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs px-6 py-3.5 rounded-xl uppercase tracking-wider transition-all shadow-md min-h-[44px]"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Accéder au Tableau de Bord Administrateur</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#121110] min-h-screen text-stone-100 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Fil d'Ariane & Titre */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-xs text-stone-400 mb-3 font-medium">
            <Link href="/" className="hover:text-amber-400 transition-colors">
              Accueil
            </Link>
            <span>/</span>
            <Link href="/catalogue" className="hover:text-amber-400 transition-colors">
              Catalogue
            </Link>
            <span>/</span>
            <span className="text-stone-200">Panier</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-stone-100">
                Mon Panier d'Achat
              </h1>
              <p className="text-sm text-stone-400 mt-1">
                {itemCount > 0
                  ? `${itemCount} palette${itemCount > 1 ? "s" : ""} sélectionnée${itemCount > 1 ? "s" : ""}`
                  : "Votre panier est actuellement vide."}
              </p>
            </div>

            {itemCount > 0 && (
              <Link
                href="/catalogue"
                className="inline-flex items-center gap-2 text-xs font-bold text-stone-400 hover:text-amber-400 transition-colors self-start sm:self-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Continuer mes achats de bois</span>
              </Link>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          /* Panier Vide */
          <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-8 sm:p-16 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center mx-auto mb-6 text-stone-500">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-100">Votre panier est vide</h2>
            <p className="text-sm text-stone-400 mt-2 max-w-md mx-auto leading-relaxed">
              Explorez nos stères de bois dur fendu (chêne, charme, hêtre séchés sous abri) et nos granulés certifiés Din+ pour équiper votre foyer.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/catalogue"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-6 py-3.5 rounded-xl text-sm transition-all"
              >
                <span>Voir le catalogue de bois</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/#simulateur"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-900 border border-stone-800 hover:border-amber-500 text-stone-200 font-bold px-6 py-3.5 rounded-xl text-sm transition-all"
              >
                <span>Calculer mon besoin en stères</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Grille Panier Plein */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Colonne Gauche : Articles & Sélecteur Livraison/Drive */}
            <div className="lg:col-span-8 space-y-6">
              {/* Sélecteur Mode de Réception (Inspiré de Brazeco & Simplyfeu) */}
              <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-stone-100 flex items-center gap-2">
                    <span>1. Mode de réception</span>
                  </h2>
                  <span className="text-xs text-stone-400 font-medium">Choisissez votre formule</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Option 1 : Livraison Domicile */}
                  <button
                    type="button"
                    onClick={() => setFulfillmentMethod("delivery")}
                    className={`text-left p-4 rounded-xl border-2 transition-all flex flex-col justify-between ${
                      fulfillmentMethod === "delivery"
                        ? "border-amber-500 bg-amber-500/10 text-stone-100"
                        : "border-stone-800 bg-stone-900/60 text-stone-300 hover:border-stone-700"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          fulfillmentMethod === "delivery"
                            ? "bg-amber-500 text-stone-950"
                            : "bg-stone-800 text-stone-400"
                        }`}
                      >
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm">Livraison à domicile</div>
                        <div className="text-xs text-stone-400 mt-0.5">
                          Déchargement par chariot tout-terrain au garage ou allée
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-stone-800/80 text-xs font-semibold flex items-center justify-between">
                      <span className="text-stone-400">Délai indicatif</span>
                      <span className="text-amber-400">J+3 à J+5 ouvrés</span>
                    </div>
                  </button>

                  {/* Option 2 : Retrait Drive Dépôt (-40€/pal) */}
                  <button
                    type="button"
                    onClick={() => setFulfillmentMethod("drive")}
                    className={`text-left p-4 rounded-xl border-2 transition-all flex flex-col justify-between relative overflow-hidden ${
                      fulfillmentMethod === "drive"
                        ? "border-amber-500 bg-amber-500/10 text-stone-100"
                        : "border-stone-800 bg-stone-900/60 text-stone-300 hover:border-stone-700"
                    }`}
                  >
                    <div className="absolute top-2 right-2 bg-emerald-500 text-stone-950 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
                      -40 € / palette
                    </div>
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          fulfillmentMethod === "drive"
                            ? "bg-emerald-500 text-stone-950"
                            : "bg-stone-800 text-stone-400"
                        }`}
                      >
                        <Warehouse className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm">Retrait Drive Dépôt</div>
                        <div className="text-xs text-stone-400 mt-0.5">
                          Chargement gratuit sur remorque ou utilitaire
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-stone-800/80 text-xs font-semibold flex items-center justify-between">
                      <span className="text-stone-400">Dépôt Central (77)</span>
                      <span className="text-emerald-400 font-bold">Disponible sous 24h</span>
                    </div>
                  </button>
                </div>

                {fulfillmentMethod === "drive" && (
                  <div className="mt-4 p-3 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-300 flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-stone-100">Adresse du Dépôt Central : </span>
                      LeñaDirecta Exploitation — D140, 77370 Nangis. Du lundi au samedi de 8h à 18h sur présentation de votre confirmation.
                    </div>
                  </div>
                )}
              </div>

              {/* Barre de Progression Remise Volume */}
              <div className="bg-[#1c1917] border border-amber-900/30 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Percent className="w-4 h-4" />
                    <span>Remises quantitatives de scierie</span>
                  </div>
                  <span className="text-stone-300">{nextVolumeTier.label}</span>
                </div>
                <div className="w-full bg-stone-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width:
                        itemCount === 1
                          ? "33%"
                          : itemCount === 2
                          ? "66%"
                          : itemCount >= 3
                          ? "100%"
                          : "0%",
                    }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2 text-[11px] text-stone-400 text-center font-medium">
                  <span className={itemCount >= 1 ? "text-amber-400 font-bold" : ""}>1 palette (Standard)</span>
                  <span className={itemCount >= 2 ? "text-amber-400 font-bold" : ""}>2 palettes (-25 €)</span>
                  <span className={itemCount >= 3 ? "text-amber-400 font-bold" : ""}>3+ palettes (-60 €)</span>
                </div>
              </div>

              {/* Liste Détaillée des Articles du Panier */}
              <div className="bg-[#1c1917] border border-stone-800 rounded-2xl divide-y divide-stone-800 overflow-hidden">
                <div className="p-4 sm:p-5 bg-stone-900/50 flex items-center justify-between text-xs font-bold text-stone-400 uppercase tracking-wider">
                  <span>Désignation du combustible</span>
                  <span className="hidden sm:inline">Quantité &amp; Total</span>
                </div>

                {items.map((item) => (
                  <div key={item.product.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center">
                    {/* Photo HD */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-stone-900 border border-stone-800">
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Détails Produit */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                          {item.product.species ? item.product.species.join(", ") : "Bois de chauffe"}
                        </span>
                        {item.product.wood_length_cm && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Bûches {item.product.wood_length_cm} cm
                          </span>
                        )}
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          &lt; 20% Humidité
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-stone-100">
                        <Link href={`/produit/${item.product.slug}`} className="hover:text-amber-400 transition-colors">
                          {item.product.name}
                        </Link>
                      </h3>

                      <p className="text-xs text-stone-400 mt-1 line-clamp-1">
                        {item.product.description}
                      </p>

                      <div className="text-xs text-stone-400 mt-2 font-medium">
                        Prix unitaire :{" "}
                        <span className="text-stone-200 font-bold">
                          {formatPrice(item.product.unit_price_cents)}
                        </span>
                      </div>
                    </div>

                    {/* Contrôles Quantité & Total Ligne */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-800">
                      <div className="text-base sm:text-lg font-black text-amber-400">
                        {formatPrice(item.product.unit_price_cents * item.quantity)}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Sélecteur de quantité tactile >= 44px */}
                        <div className="flex items-center border border-stone-700 rounded-lg bg-stone-900">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-9 h-9 flex items-center justify-center text-stone-300 hover:text-white transition-colors"
                            aria-label="Diminuer la quantité"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-stone-100">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-9 h-9 flex items-center justify-center text-stone-300 hover:text-white transition-colors"
                            aria-label="Augmenter la quantité"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.product.id)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
                          aria-label="Supprimer cet article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Estimateur Code Postal Intégré au Panier */}
              {fulfillmentMethod === "delivery" && (
                <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-5 sm:p-6">
                  <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-amber-500" />
                    <span>Estimer les frais de livraison pour votre commune</span>
                  </h3>
                  <p className="text-xs text-stone-400 mb-4">
                    Saisissez votre code postal pour appliquer immédiatement les tarifs et vérifier le franco de port.
                  </p>

                  <form onSubmit={handlePostalCodeCheck} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={5}
                      placeholder="Ex: 77000, 75001, 91100..."
                      value={pcInput}
                      onChange={(e) => setPcInput(e.target.value)}
                      className="flex-1 bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-stone-100 text-sm focus:outline-none focus:border-amber-500 placeholder:text-stone-500 font-mono"
                    />
                    <button
                      type="submit"
                      disabled={pcLoading}
                      className="bg-stone-800 hover:bg-stone-700 text-stone-100 font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors min-h-[44px]"
                    >
                      {pcLoading ? "Calcul..." : "Appliquer mon code postal"}
                    </button>
                  </form>

                  {pcMessage && (
                    <div className="mt-3 p-3 bg-stone-900/90 border border-stone-800 rounded-xl text-xs text-stone-300 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>{pcMessage}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Colonne Droite : Récapitulatif Fixe & Validation */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-5 sm:p-6 space-y-5">
                <h2 className="text-base font-bold text-stone-100 pb-3 border-b border-stone-800">
                  Récapitulatif de Commande
                </h2>

                {/* Décomposition des prix */}
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-stone-300">
                    <span>Sous-total articles ({itemCount} pal.)</span>
                    <span className="font-bold text-stone-100">{formatPrice(subtotal)}</span>
                  </div>

                  {volumeDiscount > 0 && (
                    <div className="flex justify-between text-amber-400 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" /> Remise volume
                      </span>
                      <span>-{formatPrice(volumeDiscount)}</span>
                    </div>
                  )}

                  {driveDiscount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Warehouse className="w-3.5 h-3.5" /> Économie Retrait Drive
                      </span>
                      <span>-{formatPrice(driveDiscount)}</span>
                    </div>
                  )}

                  {promoDiscountCents > 0 && (
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Percent className="w-3.5 h-3.5" /> Code {promoCode}
                      </span>
                      <span>-{formatPrice(promoDiscountCents)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-stone-300">
                    <div>
                      <span>Livraison</span>{" "}
                      <span className="text-stone-500 text-[11px]">
                        {fulfillmentMethod === "drive"
                          ? "(Retrait gratuit)"
                          : departmentName
                          ? `(${departmentName})`
                          : "(Selon code postal)"}
                      </span>
                    </div>
                    <span className="font-bold text-stone-100">
                      {fulfillmentMethod === "drive"
                        ? "0,00 €"
                        : deliveryFee > 0
                        ? formatPrice(deliveryFee)
                        : "À définir"}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-stone-800 flex justify-between items-baseline">
                    <div>
                      <span className="text-sm font-bold text-stone-100">Total TTC</span>
                      <span className="block text-[10px] text-stone-500">TVA 10% incluse (combustibles)</span>
                    </div>
                    <span className="text-2xl font-black text-amber-400">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Formulaire Code Promo */}
                <div className="pt-3 border-t border-stone-800">
                  {promoCode ? (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                      <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Code {promoCode} appliqué (-{formatPrice(promoDiscountCents)})
                      </span>
                      <button
                        type="button"
                        onClick={handleRemovePromo}
                        className="text-stone-400 hover:text-stone-100 text-[11px] underline"
                      >
                        Retirer
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Code promo (ex: LENA15)"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          className="flex-1 bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 text-xs uppercase tracking-wider focus:outline-none focus:border-amber-500 placeholder:text-stone-500"
                        />
                        <button
                          type="submit"
                          className="bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold px-3 py-2 rounded-xl transition-colors"
                        >
                          Appliquer
                        </button>
                      </div>
                      {promoError && <p className="text-[11px] text-rose-400">{promoError}</p>}
                    </form>
                  )}
                </div>

                {/* Bouton de Passage au Tunnel de Commande */}
                <Link
                  href="/tunnel"
                  className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-black py-4 px-6 rounded-xl transition-all shadow-lg shadow-amber-500/10 text-base min-h-[50px]"
                >
                  <span>Valider et passer commande</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                {/* Garanties et réassurance */}
                <div className="space-y-2.5 pt-4 border-t border-stone-800 text-xs text-stone-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Paiement 100% sécurisé (CB, Virement avec acompte)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Prise de rendez-vous téléphonique sous 24-48h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Chariot embarqué tout-terrain pour accès difficile</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
