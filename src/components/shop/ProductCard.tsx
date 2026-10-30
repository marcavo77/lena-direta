"use client"

import { useState } from "react"
import Image from "next/image"
import { Droplet, ShoppingCart, Check, Trees, Truck, Sparkles, ShieldCheck } from "lucide-react"
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
    setTimeout(() => setAdded(false), 2000)
  }

  const pricePerStere =
    product.volume_stere && product.volume_stere > 0
      ? Math.round(product.unit_price_cents / product.volume_stere)
      : null

  return (
    <div className="group relative bg-stone-900/90 rounded-2xl overflow-hidden border border-stone-800 hover:border-amber-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-amber-950/20 flex flex-col justify-between">
      {/* Halo de lueur doré au survol */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div>
        {/* Conteneur Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-950">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent pointer-events-none" />

          {/* Badge flottant en haut à gauche */}
          {product.badge && (
            <div className="absolute top-3 left-3 bg-amber-500 text-stone-950 text-xs font-black px-3 py-1 rounded-lg shadow-lg uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-stone-950" />
              <span>{product.badge}</span>
            </div>
          )}

          {/* Badge Humidité en bas */}
          {product.humidity_rate && (
            <div className="absolute bottom-3 left-3 bg-stone-950/90 backdrop-blur-md border border-stone-700/80 text-stone-100 text-xs font-semibold px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-md">
              <Droplet className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />
              <span>&lt; {product.humidity_rate}% d&apos;humidité certifié</span>
            </div>
          )}
        </div>

        {/* Détails du produit */}
        <div className="p-5">
          {/* Chips d'attributs techniques */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {product.wood_length_cm && (
              <span className="text-xs bg-stone-800 text-amber-300 border border-stone-700/60 px-2.5 py-0.5 rounded-md font-semibold">
                Bûches {product.wood_length_cm} cm
              </span>
            )}
            {product.volume_stere && (
              <span className="text-xs bg-amber-950/60 border border-amber-700/50 text-amber-200 px-2.5 py-0.5 rounded-md font-bold">
                {product.volume_stere} Stères
              </span>
            )}
            {product.weight_kg && (
              <span className="text-xs bg-stone-800/80 text-stone-300 px-2.5 py-0.5 rounded-md font-medium">
                ≈ {product.weight_kg} kg
              </span>
            )}
          </div>

          <h3 className="font-bold text-stone-100 text-lg leading-snug group-hover:text-amber-400 transition-colors">
            {product.name}
          </h3>

          <p className="text-xs sm:text-sm text-stone-400 line-clamp-2 mt-2 leading-relaxed">
            {product.short_description || product.description}
          </p>

          {/* Essences de bois */}
          {product.species && product.species.length > 0 && (
            <div className="mt-3.5 flex items-center gap-1.5 text-xs text-stone-400">
              <Trees className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">Essences : {product.species.join(", ")}</span>
            </div>
          )}

          {/* Réassurance livraison */}
          <div className="mt-2 flex items-center gap-1.5 text-xs text-stone-500">
            <Truck className="w-4 h-4 text-amber-500/80 shrink-0" />
            <span>Livré sur palette filmée avec chariot tout-terrain</span>
          </div>
        </div>
      </div>

      {/* Prix & Bouton d'achat Mobile-First */}
      <div className="p-5 pt-0">
        <div className="pt-4 border-t border-stone-800 flex items-end justify-between gap-3">
          <div>
            <div className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">
              Prix TTC livré
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">
              {formatPrice(product.unit_price_cents)}
            </div>
            {pricePerStere && (
              <div className="text-[11px] text-stone-400">
                soit <span className="font-semibold text-stone-300">{formatPrice(pricePerStere)}</span> / stère
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`min-h-[48px] px-5 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
              added
                ? "bg-emerald-500 text-stone-950 shadow-emerald-500/20"
                : "bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-500/20 hover:shadow-amber-500/40"
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Ajouté !</span>
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
