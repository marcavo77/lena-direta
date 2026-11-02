"use client"

import { useState, useMemo } from "react"
import { ProductCard } from "@/components/shop/ProductCard"
import type { Product } from "@/lib/supabase/database.types"
import { SlidersHorizontal, Flame, Trees, RotateCcw, ArrowUpDown } from "lucide-react"

interface CatalogBrowserProps {
  initialProducts: Product[]
}

export function CatalogBrowser({ initialProducts }: CatalogBrowserProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedLength, setSelectedLength] = useState<number | "all">("all")
  const [selectedPackaging, setSelectedPackaging] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"featured" | "price_asc" | "price_desc">("featured")

  const categories = [
    { id: "all", label: "Tous les combustibles" },
    { id: "bois_buches", label: "Bûches de bois dur" },
    { id: "granules_pellets", label: "Granulés & Pellets Din+" },
    { id: "buches_compressees", label: "Bûches densifiées" },
    { id: "allumage", label: "Allumage & Petit bois" },
  ]

  const lengths = [
    { id: "all", label: "Toutes longueurs" },
    { id: 25, label: "25 cm" },
    { id: 33, label: "33 cm" },
    { id: 50, label: "50 cm" },
  ]

  const packagings = [
    { id: "all", label: "Tous formats" },
    { id: "palette", label: "Palettes complètes" },
    { id: "sac", label: "Sacs (Pellets)" },
    { id: "filet", label: "Filets" },
  ]

  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((p) => {
        if (selectedCategory !== "all" && p.category !== selectedCategory) return false
        if (selectedLength !== "all" && p.wood_length_cm !== selectedLength) return false
        if (selectedPackaging !== "all" && p.packaging !== selectedPackaging) return false
        return true
      })
      .sort((a, b) => {
        if (sortBy === "price_asc") return a.unit_price_cents - b.unit_price_cents
        if (sortBy === "price_desc") return b.unit_price_cents - a.unit_price_cents
        return 0
      })
  }, [initialProducts, selectedCategory, selectedLength, selectedPackaging, sortBy])

  const hasActiveFilters =
    selectedCategory !== "all" || selectedLength !== "all" || selectedPackaging !== "all"

  const handleResetFilters = () => {
    setSelectedCategory("all")
    setSelectedLength("all")
    setSelectedPackaging("all")
    setSortBy("featured")
  }

  return (
    <div>
      {/* Barre de filtres de catégorie principale (Pills horizontales) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`min-h-[44px] px-4 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-2 shrink-0 ${
              selectedCategory === cat.id
                ? "bg-amber-500 text-stone-950"
                : "bg-stone-900 text-stone-300 border border-stone-800 hover:border-stone-700"
            }`}
          >
            {cat.id === "bois_buches" && <Trees className="w-4 h-4" />}
            {cat.id === "granules_pellets" && <Flame className="w-4 h-4 fill-current" />}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Barre de sous-filtres techniques & tri */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-400">
            <SlidersHorizontal className="w-4 h-4 text-amber-500" />
            <span>Filtres :</span>
          </div>

          {/* Filtre Longueur */}
          <select
            value={selectedLength}
            onChange={(e) =>
              setSelectedLength(e.target.value === "all" ? "all" : Number(e.target.value))
            }
            className="bg-stone-950 border border-stone-800 text-stone-200 text-xs font-semibold rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
          >
            {lengths.map((l) => (
              <option key={String(l.id)} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>

          {/* Filtre Conditionnement */}
          <select
            value={selectedPackaging}
            onChange={(e) => setSelectedPackaging(e.target.value)}
            className="bg-stone-950 border border-stone-800 text-stone-200 text-xs font-semibold rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
          >
            {packagings.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.label}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-amber-500 hover:text-amber-400 font-semibold flex items-center gap-1 px-2 py-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Réinitialiser</span>
            </button>
          )}
        </div>

        {/* Tri */}
        <div className="flex items-center gap-2 ml-auto">
          <ArrowUpDown className="w-4 h-4 text-stone-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-stone-950 border border-stone-800 text-stone-200 text-xs font-semibold rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
          >
            <option value="featured">Recommandés</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
          </select>
        </div>
      </div>

      {/* Compteur de résultats */}
      <div className="text-xs text-stone-400 mb-6 font-medium">
        Affichage de <strong className="text-stone-100">{filteredProducts.length}</strong> référence(s) en stock prête(s) pour livraison directe
      </div>

      {/* Grille des produits */}
      {filteredProducts.length === 0 ? (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-12 text-center">
          <Flame className="w-10 h-10 text-stone-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-stone-200">Aucun produit ne correspond à ces critères</h3>
          <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
            Essayez de réinitialiser vos filtres de longueur ou de catégorie pour voir l&apos;ensemble de nos combustibles disponibles.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 py-2.5 rounded-lg text-xs"
          >
            Voir tous les produits
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
