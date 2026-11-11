"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/lib/store/cart"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/lib/supabase/database.types"
import { ShoppingCart, Check, ArrowRight, ShieldCheck } from "lucide-react"
import { useScrollDirection } from "@/lib/hooks/useScrollDirection"
import { useIsAdmin } from "@/lib/hooks/useIsAdmin"

interface StickyProductBarProps {
  product: Product
}

export function StickyProductBar({ product }: StickyProductBarProps) {
  const router = useRouter()
  const { isAdmin } = useIsAdmin()
  const isVisible = useScrollDirection()
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  const handleAdd = () => {
    addItem(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleDirectCheckout = () => {
    addItem(product, 1)
    router.push("/tunnel")
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-30 sm:hidden bg-stone-950/95 border-t border-stone-800 p-2.5 flex items-center justify-between gap-2 shadow-2xl backdrop-blur-sm transition-transform duration-300 ease-in-out will-change-transform ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-bold text-stone-200 truncate">{product.name}</div>
        <div className="text-base font-black text-amber-500 leading-tight">
          {formatPrice(product.unit_price_cents)}
        </div>
      </div>

      {isAdmin ? (
        <Link
          href="/admin"
          className="min-h-[44px] px-4 py-2.5 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 active:scale-95 transition-all bg-amber-500 hover:bg-amber-400 text-stone-950 uppercase tracking-wider shadow-md shrink-0"
        >
          <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
          <span>Gérer (Admin)</span>
        </Link>
      ) : (
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Icône panier */}
          <button
            type="button"
            onClick={handleAdd}
            aria-label="Ajouter au panier"
            title={added ? "Ajouté !" : "Ajouter au panier"}
            className={`min-h-[44px] min-w-[44px] p-2 rounded-lg flex items-center justify-center border active:scale-95 transition-all ${
              added
                ? "bg-emerald-600 text-white border-emerald-500"
                : "bg-stone-800 hover:bg-stone-700 text-amber-400 border-stone-700"
            }`}
          >
            {added ? (
              <Check className="w-5 h-5 stroke-[2.5]" />
            ) : (
              <ShoppingCart className="w-5 h-5" />
            )}
          </button>

          {/* Bouton Commander direct */}
          <button
            type="button"
            onClick={handleDirectCheckout}
            className="min-h-[44px] px-3.5 py-2.5 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 active:scale-95 transition-all bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md"
          >
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            <span>Commander</span>
          </button>
        </div>
      )}
    </div>
  )
}
