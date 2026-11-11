"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/lib/store/cart"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/lib/supabase/database.types"
import {
  ShoppingCart,
  Check,
  Truck,
  Warehouse,
  ShieldCheck,
  Plus,
  Minus,
  Sparkles,
  PhoneCall,
  Clock,
  ArrowRight,
} from "lucide-react"

interface ProductPurchaseBoxProps {
  product: Product
}

export function ProductPurchaseBox({ product }: ProductPurchaseBoxProps) {
  const router = useRouter()
  const [quantity, setQuantity] = useState<number>(1)
  const [deliveryMode, setDeliveryMode] = useState<"delivery" | "drive">("delivery")
  const [added, setAdded] = useState<boolean>(false)

  const addItem = useCartStore((s) => s.addItem)

  // Remise dégressive selon la quantité (comme Brazeco et Simplyfeu)
  const discountPerUnit = quantity >= 3 ? 2000 : quantity === 2 ? 1250 : 0 // en cents
  const driveDiscountPerUnit = deliveryMode === "drive" ? 4000 : 0 // -40€/palette en retrait dépôt

  const effectiveUnitCents = product.unit_price_cents - discountPerUnit - driveDiscountPerUnit
  const totalCents = effectiveUnitCents * quantity

  const pricePerStere =
    product.volume_stere && product.volume_stere > 0
      ? Math.round(effectiveUnitCents / product.volume_stere)
      : null

  const handleAddToCart = () => {
    addItem(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2200)
  }

  const handleDirectCheckout = () => {
    addItem(product, quantity)
    router.push("/tunnel")
  }

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-7 shadow-lg">
      {/* Sélecteur Mode de Livraison vs Retrait Dépôt */}
      <div className="mb-6">
        <label className="text-xs font-bold text-stone-300 uppercase tracking-wider block mb-2.5">
          Mode de réception souhaité
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => setDeliveryMode("delivery")}
            className={`p-3 rounded-lg border text-xs sm:text-sm font-bold transition-colors min-h-[48px] flex items-center justify-center gap-2 text-left ${
              deliveryMode === "delivery"
                ? "bg-amber-500 text-stone-950 border-amber-500"
                : "bg-stone-950 text-stone-300 border-stone-800 hover:border-stone-700"
            }`}
          >
            <Truck className="w-4 h-4 shrink-0" />
            <span>Livraison Chariot</span>
          </button>

          <button
            type="button"
            onClick={() => setDeliveryMode("drive")}
            className={`p-3 rounded-lg border text-xs sm:text-sm font-bold transition-colors min-h-[48px] flex items-center justify-center gap-2 text-left ${
              deliveryMode === "drive"
                ? "bg-amber-500 text-stone-950 border-amber-500"
                : "bg-stone-950 text-stone-300 border-stone-800 hover:border-stone-700"
            }`}
          >
            <Warehouse className="w-4 h-4 shrink-0" />
            <span>Retrait Dépôt (-40€)</span>
          </button>
        </div>
      </div>

      {/* Bloc Prix & Dégressivité */}
      <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 mb-6">
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <div className="text-xs text-stone-400 font-semibold uppercase tracking-wider">
              {deliveryMode === "delivery" ? "Prix TTC livré à domicile" : "Prix TTC retrait au dépôt"}
            </div>
            <div className="text-3xl sm:text-4xl font-black text-amber-500 tracking-tight mt-1">
              {formatPrice(effectiveUnitCents)}
            </div>
            {pricePerStere && (
              <div className="text-xs text-stone-400 mt-0.5">
                soit <span className="text-stone-200 font-bold">{formatPrice(pricePerStere)}</span> / stère
              </div>
            )}
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded">
              En stock
            </span>
            <div className="text-[11px] text-stone-400 mt-1">Expédition sous 48-72h</div>
          </div>
        </div>

        {/* Tableau des remises dégressives */}
        <div className="mt-4 pt-3.5 border-t border-stone-800 text-xs">
          <div className="font-bold text-stone-300 mb-1.5">Tarifs dégressifs sur la commande :</div>
          <div className="grid grid-cols-3 gap-1.5 text-center text-[11px]">
            <div
              className={`p-1.5 rounded border ${
                quantity === 1
                  ? "bg-stone-900 border-amber-500 text-amber-300 font-bold"
                  : "bg-stone-900/60 border-stone-800 text-stone-400"
              }`}
            >
              1 palette : Tarif normal
            </div>
            <div
              className={`p-1.5 rounded border ${
                quantity === 2
                  ? "bg-stone-900 border-amber-500 text-amber-300 font-bold"
                  : "bg-stone-900/60 border-stone-800 text-stone-400"
              }`}
            >
              2 palettes : <strong className="text-emerald-400">-25 €</strong>
            </div>
            <div
              className={`p-1.5 rounded border ${
                quantity >= 3
                  ? "bg-stone-900 border-amber-500 text-amber-300 font-bold"
                  : "bg-stone-900/60 border-stone-800 text-stone-400"
              }`}
            >
              3+ palettes : <strong className="text-emerald-400">-60 €</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Sélecteur de Quantité & Bouton Panier */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="text-xs font-bold text-stone-300">Quantité :</div>
          <div className="flex items-center border border-stone-700 rounded-lg bg-stone-950">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-10 h-10 flex items-center justify-center text-stone-300 hover:text-white"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center font-black text-sm text-stone-100">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-10 h-10 flex items-center justify-center text-stone-300 hover:text-white"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs text-stone-400 ml-auto">
            Total : <strong className="text-stone-100 font-black">{formatPrice(totalCents)}</strong>
          </div>
        </div>

        {/* Actions : Ajouter au panier + Commande directe */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleAddToCart}
            className={`min-h-[52px] rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all active:scale-98 border ${
              added
                ? "bg-emerald-600 text-white border-emerald-500 shadow-md"
                : "bg-stone-800 hover:bg-stone-700 text-stone-100 border-stone-700"
            }`}
          >
            {added ? (
              <>
                <Check className="w-5 h-5 stroke-[2.5]" />
                <span>Ajouté au panier !</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5 text-amber-400" />
                <span>Ajouter au panier</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDirectCheckout}
            className="min-h-[52px] rounded-xl font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all active:scale-98 bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md"
          >
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            <span>Commander direct</span>
          </button>
        </div>

        {/* Rassurance sous le bouton */}
        <div className="pt-2 flex flex-col gap-2 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Paiement sécurisé par carte bancaire 3D Secure ou chèque énergie</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Rendez-vous téléphonique fixé avant toute livraison</span>
          </div>
        </div>
      </div>
    </div>
  )
}
