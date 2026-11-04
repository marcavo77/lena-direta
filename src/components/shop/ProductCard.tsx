"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Droplet, ShoppingCart, Check, Trees, Truck } from "lucide-react"
import type { Product } from "@/lib/supabase/database.types"
import { formatPrice } from "@/lib/utils"
import { useCartStore } from "@/lib/store/cart"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const pricePerStere =
    product.volume_stere && product.volume_stere > 0
      ? Math.round(product.unit_price_cents / product.volume_stere)
      : null

  return (
    <div className="bg-stone-900 rounded-xl overflow-hidden border border-stone-800 hover:border-stone-700 transition-colors flex flex-col justify-between group">
      <div>
        {/* Photo Réelle & Badges Techniques avec Lien Produit */}
        <Link href={`/produit/${product.slug}`} prefetch={true} className="block relative aspect-[4/3] w-full overflow-hidden bg-stone-950">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-102 transition-transform duration-300"
          />

          {/* Badge officiel supérieur */}
          {product.badge && (
            <div className="absolute top-3 left-3 bg-stone-950/90 border border-stone-700 text-stone-900 dark:text-stone-100 text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider backdrop-blur-sm shadow-md">
              {product.badge}
            </div>
          )}

          {/* Badge Taux d'humidité certifié */}
          {product.humidity_rate && (
            <div className="absolute bottom-3 left-3 bg-stone-950/90 border border-stone-700 text-stone-900 dark:text-stone-100 text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5 backdrop-blur-sm shadow-md">
              <Droplet className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400 fill-sky-500 dark:fill-sky-400 shrink-0" />
              <span>&lt; {product.humidity_rate}% humidité certifié</span>
            </div>
          )}
        </Link>

        {/* Détails du combustible */}
        <div className="p-5">
          {/* Caractéristiques physiques */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {product.wood_length_cm && (
              <span className="text-xs bg-stone-950 text-stone-300 border border-stone-800 px-2.5 py-0.5 rounded font-mono font-semibold">
                Bûches {product.wood_length_cm} cm
              </span>
            )}
            {product.volume_stere && (
              <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded font-bold">
                {product.volume_stere} Stères
              </span>
            )}
            {product.weight_kg && (
              <span className="text-xs bg-stone-950 text-stone-400 border border-stone-800 px-2.5 py-0.5 rounded font-medium">
                {product.weight_kg} kg
              </span>
            )}
          </div>

          <Link href={`/produit/${product.slug}`} prefetch={true} className="block">
            <h3 className="font-bold text-stone-100 text-lg leading-snug group-hover:text-amber-400 transition-colors">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs sm:text-sm text-stone-400 line-clamp-2 mt-2 leading-relaxed">
            {product.short_description || product.description}
          </p>

          {/* Essences de bois dur */}
          {product.species && product.species.length > 0 && (
            <div className="mt-3.5 flex items-center gap-1.5 text-xs text-stone-400">
              <Trees className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="truncate">Essences : {product.species.join(", ")}</span>
            </div>
          )}

          {/* Dépose camion tout-terrain */}
          <div className="mt-2 flex items-center gap-1.5 text-xs text-stone-400">
            <Truck className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Livré sur palette avec chariot tout-terrain</span>
          </div>
        </div>
      </div>

      {/* Prix & Bouton de commande */}
      <div className="p-5 pt-0">
        <div className="pt-4 border-t border-stone-800 flex items-end justify-between gap-3">
          <Link href={`/produit/${product.slug}`} prefetch={true} className="block">
            <div className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">
              Prix TTC livré
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-500 tracking-tight">
              {formatPrice(product.unit_price_cents)}
            </div>
            {pricePerStere && (
              <div className="text-xs text-stone-400">
                soit <span className="font-semibold text-stone-200">{formatPrice(pricePerStere)}</span> / stère
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`min-h-[46px] px-5 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors active:scale-95 shrink-0 ${
              added
                ? "bg-emerald-600 text-white"
                : "bg-amber-500 hover:bg-amber-400 text-stone-950"
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
