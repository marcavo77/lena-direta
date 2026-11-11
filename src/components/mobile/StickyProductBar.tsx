"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/lib/store/cart"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/lib/supabase/database.types"
import { ShoppingCart, Check, ArrowRight } from "lucide-react"
import { useScrollDirection } from "@/lib/hooks/useScrollDirection"

interface StickyProductBarProps {
  product: Product
}

export function StickyProductBar({ product }: StickyProductBarProps) {
  const router = useRouter()
  const isVisible = useScrollDirection()
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  const handleAddToCart = () => {
    addItem(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleDirectOrder = () => {
    addItem(product, 1)
    router.push("/tunnel")
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-30 sm:hidden bg-white/95 dark:bg-stone-950/95 border-t border-stone-200 dark:border-stone-800 p-2.5 flex items-center justify-between gap-2 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:shadow-2xl backdrop-blur-sm transition-transform duration-300 ease-in-out will-change-transform ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="min-w-0 flex-1 pr-1">
        <div className="text-xs font-bold text-stone-900 dark:text-stone-200 truncate">{product.name}</div>
        <div className="text-base font-black text-amber-600 dark:text-amber-500">
          {formatPrice(product.unit_price_cents)}
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {/* Bouton Icône Panier (Ajout rapide sans quitter la page) */}
        <button
          type="button"
          onClick={handleAddToCart}
          title="Ajouter au panier"
          aria-label={`Ajouter ${product.name} au panier`}
          className={`min-h-[44px] min-w-[44px] w-11 h-11 rounded-lg flex items-center justify-center transition-all border active:scale-95 ${
            added
              ? "bg-emerald-600 text-white border-emerald-500 shadow-sm"
              : "bg-stone-900 text-stone-200 border-stone-700 hover:text-amber-400"
          }`}
        >
          {added ? (
            <Check className="w-5 h-5 stroke-[3] text-white" />
          ) : (
            <ShoppingCart className="w-5 h-5" />
          )}
        </button>

        {/* Bouton Commander (Achat direct vers le tunnel) */}
        <button
          type="button"
          onClick={handleDirectOrder}
          title="Commander directement ce produit"
          className="min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 active:scale-95 transition-colors shadow-sm"
        >
          <span>Commander</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  )
}
