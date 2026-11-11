"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Droplet, ShoppingCart, Check, Trees, Truck, ArrowRight } from "lucide-react"
import type { Product } from "@/lib/supabase/database.types"
import { formatPrice } from "@/lib/utils"
import { useCartStore } from "@/lib/store/cart"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleDirectCheckout = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
    router.push("/tunnel")
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
            <div className="absolute top-3 left-3 bg-stone-950/90 border border-stone-700 text-stone-100 text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider backdrop-blur-sm shadow-md">
              {product.badge}
            </div>
          )}

          {/* Badge Taux d'humidité certifié */}
          {product.humidity_rate && (
            <div className="absolute bottom-3 left-3 bg-stone-950/90 border border-stone-700 text-stone-100 text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5 backdrop-blur-sm shadow-md">
              <Droplet className="w-3.5 h-3.5 text-sky-400 fill-sky-400 shrink-0" />
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
                {product.category === "poeles" ? `Bûches max ${product.wood_length_cm} cm` : `Bûches ${product.wood_length_cm} cm`}
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

          {/* Essences de bois dur ou matériaux pour poêles */}
          {product.species && product.species.length > 0 && (
            <div className="mt-3.5 flex items-center gap-1.5 text-xs text-stone-400">
              <Trees className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="truncate">
                {product.category === "poeles" ? "Matériaux" : "Essences"} : {product.species.join(", ")}
              </span>
            </div>
          )}

          {/* Dépose camion tout-terrain */}
          <div className="mt-2 flex items-center gap-1.5 text-xs text-stone-400">
            <Truck className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Livré sur palette avec chariot tout-terrain</span>
          </div>
        </div>
      </div>

      {/* Prix & Boutons d'action (Ajout panier & Commande directe) */}
      <div className="p-5 pt-0">
        <div className="pt-4 border-t border-stone-800 flex items-center justify-between gap-2.5">
          <Link href={`/produit/${product.slug}`} prefetch={true} className="block min-w-0">
            <div className="text-[10px] sm:text-[11px] text-stone-400 uppercase tracking-wider font-semibold">
              Prix TTC livré
            </div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-black text-amber-500 tracking-tight leading-none mt-0.5">
              {formatPrice(product.unit_price_cents)}
            </div>
            {pricePerStere && (
              <div className="text-[11px] sm:text-xs text-stone-400 truncate mt-0.5">
                soit <span className="font-semibold text-stone-200">{formatPrice(pricePerStere)}</span> / stère
              </div>
            )}
          </Link>

          <div className="flex items-center gap-2 shrink-0">
            {/* Bouton Panier : Ajout au panier sans quitter la page */}
            <button
              type="button"
              onClick={handleAddToCart}
              aria-label="Ajouter au panier"
              title={added ? "Produit ajouté au panier !" : "Ajouter au panier"}
              className={`min-h-[44px] min-w-[44px] sm:min-h-[46px] sm:min-w-[46px] p-2.5 rounded-lg font-bold flex items-center justify-center transition-all active:scale-95 border ${
                added
                  ? "bg-emerald-600 text-white border-emerald-500 shadow-sm"
                  : "bg-stone-800 hover:bg-stone-700 text-amber-400 hover:text-amber-300 border-stone-700 hover:border-amber-500/40 shadow-sm"
              }`}
            >
              {added ? (
                <Check className="w-5 h-5 stroke-[2.5]" />
              ) : (
                <ShoppingCart className="w-5 h-5" />
              )}
            </button>

            {/* Bouton Commander : Redirige directement vers le tunnel de commande */}
            <button
              type="button"
              onClick={handleDirectCheckout}
              aria-label="Commander directement"
              title="Passer commande directement"
              className="min-h-[44px] sm:min-h-[46px] px-3.5 sm:px-4 py-2.5 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-sm"
            >
              <ArrowRight className="w-4 h-4 stroke-[2.5] shrink-0" />
              <span>Commander</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
