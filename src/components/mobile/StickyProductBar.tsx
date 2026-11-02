"use client"

import { useState } from "react"
import { useCartStore } from "@/lib/store/cart"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/lib/supabase/database.types"
import { ShoppingCart, Check } from "lucide-react"

interface StickyProductBarProps {
  product: Product
}

export function StickyProductBar({ product }: StickyProductBarProps) {
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  const handleAdd = () => {
    addItem(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 sm:hidden bg-stone-950 border-t border-stone-800 p-3 flex items-center justify-between gap-3 shadow-2xl">
      <div className="min-w-0 flex-1">
        <div className="text-xs font-bold text-stone-200 truncate">{product.name}</div>
        <div className="text-base font-black text-amber-500">
          {formatPrice(product.unit_price_cents)}
        </div>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className={`min-h-[46px] px-5 py-2.5 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 active:scale-95 shrink-0 transition-colors ${
          added
            ? "bg-emerald-600 text-white"
            : "bg-amber-500 hover:bg-amber-400 text-stone-950"
        }`}
      >
        {added ? (
          <>
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Ajouté</span>
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4" />
            <span>Commander</span>
          </>
        )}
      </button>
    </div>
  )
}
