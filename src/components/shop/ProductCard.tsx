"use client"

import { useState } from "react"
import Image from "next/image"
import { Droplet, PackageCheck, Flame, ShoppingCart, Check } from "lucide-react"
import type { Product } from "@/lib/supabase/database.types"
import { formatPrice } from "@/lib/utils"
import { useCartStore } from "@/lib/store/cart"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  const handleAddToCart = () => {
    addItem(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="group bg-stone-900/80 border border-stone-800 rounded-2xl overflow-hidden flex flex-col hover:border-amber-500/40 transition-all duration-300 shadow-lg hover:shadow-amber-500/5">
      {/* Photo & Badges */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-950">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {product.badge && (
          <div className="absolute top-3 left-3 bg-amber-500 text-stone-950 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-md uppercase tracking-wide">
            {product.badge}
          </div>
        )}

        {product.humidity_rate && (
          <div className="absolute bottom-3 left-3 bg-stone-950/80 backdrop-blur-md border border-stone-700/60 text-stone-200 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow">
            <Droplet className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
            <span>&lt; {product.humidity_rate}% humidité</span>
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Tags essences & coupe */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
            {product.wood_length_cm && (
              <span className="text-[11px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded-md font-medium">
                {product.wood_length_cm} cm
              </span>
            )}
            {product.volume_stere && (
              <span className="text-[11px] bg-amber-950/40 border border-amber-800/40 text-amber-300 px-2 py-0.5 rounded-md font-medium">
                {product.volume_stere} stères
              </span>
            )}
            {product.species && product.species.length > 0 && (
              <span className="text-[11px] text-stone-400">
                {product.species.slice(0, 2).join(", ")}
              </span>
            )}
          </div>

          <h3 className="font-semibold text-stone-100 text-base sm:text-lg line-clamp-2 leading-snug group-hover:text-amber-400 transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-stone-400 line-clamp-2 mt-2 leading-relaxed">
            {product.short_description || product.description}
          </p>
        </div>

        {/* Prix & Bouton Panier */}
        <div className="mt-5 pt-4 border-t border-stone-800/80 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] text-stone-500 uppercase tracking-wider font-medium">Prix unitaire</div>
            <div className="text-xl sm:text-2xl font-black text-amber-400">
              {formatPrice(product.unit_price_cents)}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px] shadow-md active:scale-95 ${
              added
                ? "bg-emerald-500 text-stone-950 border border-emerald-400"
                : "bg-amber-500 hover:bg-amber-400 text-stone-950 border border-amber-400"
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
      </div>
    </div>
  )
}
