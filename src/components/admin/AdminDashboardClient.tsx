"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Flame,
  Search,
  Plus,
  Edit3,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  LogOut,
  X,
  Save,
  Loader2,
  Package,
  Layers,
  Sparkles,
  TrendingUp,
  Image as ImageIcon,
} from "lucide-react"
import type { Product } from "@/lib/supabase/database.types"
import { formatPrice } from "@/lib/utils"
import {
  updateProductAction,
  createProductAction,
  toggleProductStatusAction,
  type ProductUpdateInput,
} from "@/app/actions/admin"
import { logoutAction } from "@/app/actions/auth"

interface AdminDashboardClientProps {
  initialProducts: Product[]
  adminEmail: string
}

const CATEGORIES = [
  { id: "all", label: "Toutes les catégories" },
  { id: "bois_buches", label: "Bois de Chauffage" },
  { id: "granules_pellets", label: "Granulés & Pellets" },
  { id: "buches_compressees", label: "Bûches Compressées" },
  { id: "charbon_bois", label: "Charbon de Bois" },
  { id: "poeles", label: "Poêles à Bois & Foyers" },
  { id: "allumage", label: "Allumage & Accessoires" },
]

// Galerie de photos réelles disponibles dans la scierie
const AVAILABLE_GALLERY_PHOTOS = [
  { name: "Chêne & Charme 33 cm", url: "/images/products/chene-charme-33cm.jpg" },
  { name: "Feuillus Durs 50 cm", url: "/images/products/chene-hetre-50cm.jpg" },
  { name: "Bûches Compressées", url: "/images/products/buches-compressees.jpg" },
  { name: "Granulés Din+ (Sac)", url: "/images/products/pellets-din-plus.jpg" },
  { name: "Filets d'Allumage", url: "/images/products/bois-allumage.jpg" },
  { name: "Charbon Hexagonal Extrudé", url: "/images/products/charbon-hexagonal-extrude.png" },
  { name: "Charbon Carton 10 kg", url: "/images/products/charbon-hexagonal-carton-10kg.jpg" },
  { name: "Charbon Pack Duo 20 kg", url: "/images/products/charbon-hexagonal-pack-duo-20kg.jpg" },
  { name: "Charbon Demi-Palette", url: "/images/products/charbon-hexagonal-demi-palette.jpg" },
  { name: "Charbon Palette 1 Tonne", url: "/images/products/charbon-hexagonal-palette-1tonne.jpg" },
  { name: "Charbon Artisanal Français", url: "/images/products/charbon-bois-artisanal.jpg" },
  { name: "Poêle Four Gourmet 9kW", url: "/images/products/poele-a-bois-avec-four-gourmet.jpg" },
  { name: "Poêle Four Panoramique 11kW", url: "/images/products/poele-a-bois-four-panoramique.png" },
  { name: "Poêle Scandinave Fonte 7kW", url: "/images/products/poele-a-bois-scandinave-fonte.jpg" },
  { name: "Poêle Fonte Traditionnel 14kW", url: "/images/products/poele-a-bois-fonte-traditionnel.jpg" },
  { name: "Poêle Granulés WiFi 9kW", url: "/images/products/poele-a-granules-connecte.jpg" },
]

type ProductCategory =
  | "bois_buches"
  | "granules_pellets"
  | "buches_compressees"
  | "allumage"
  | "charbon_bois"
  | "poeles"

export function AdminDashboardClient({ initialProducts, adminEmail }: AdminDashboardClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")

  // États pour les modales
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)

  // Formulaire d'édition / création
  const [formData, setFormData] = useState<{
    name: string
    slug: string
    category: ProductCategory
    short_description: string
    description: string
    unit_price_euros: string
    stock_quantity: number
    image_url: string
    badge: string
    humidity_rate: string
    wood_length_cm: string
    packaging: string
    weight_kg: string
    volume_stere: string
    species: string
    is_active: boolean
  }>({
    name: "",
    slug: "",
    category: "bois_buches",
    short_description: "",
    description: "",
    unit_price_euros: "0",
    stock_quantity: 10,
    image_url: "/images/products/chene-charme-33cm.jpg",
    badge: "",
    humidity_rate: "18",
    wood_length_cm: "33",
    packaging: "palette",
    weight_kg: "",
    volume_stere: "",
    species: "Chêne, Charme",
    is_active: true,
  })

  // Produits filtrés
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase()) ||
        (p.short_description && p.short_description.toLowerCase().includes(search.toLowerCase()))

      const matchesCategory = selectedCategory === "all" || p.category === selectedCategory

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && p.is_active) ||
        (statusFilter === "inactive" && !p.is_active)

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [products, search, selectedCategory, statusFilter])

  // Ouvrir le formulaire d'édition
  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p)
    setIsCreating(false)
    setFormData({
      name: p.name,
      slug: p.slug,
      category: (p.category as ProductCategory) || "bois_buches",
      short_description: p.short_description || "",
      description: p.description || "",
      unit_price_euros: (p.unit_price_cents / 100).toFixed(2),
      stock_quantity: p.stock_quantity,
      image_url: p.image_url,
      badge: p.badge || "",
      humidity_rate: p.humidity_rate !== null ? String(p.humidity_rate) : "",
      wood_length_cm: p.wood_length_cm !== null ? String(p.wood_length_cm) : "",
      packaging: p.packaging || "palette",
      weight_kg: p.weight_kg !== null ? String(p.weight_kg) : "",
      volume_stere: p.volume_stere !== null ? String(p.volume_stere) : "",
      species: p.species ? p.species.join(", ") : "",
      is_active: p.is_active,
    })
    setFeedback(null)
  }

  // Ouvrir le formulaire de création
  const handleOpenCreate = () => {
    setEditingProduct(null)
    setIsCreating(true)
    setFormData({
      name: "",
      slug: "",
      category: "bois_buches",
      short_description: "",
      description: "",
      unit_price_euros: "99.00",
      stock_quantity: 15,
      image_url: "/images/products/chene-charme-33cm.jpg",
      badge: "Nouveauté",
      humidity_rate: "18",
      wood_length_cm: "33",
      packaging: "palette",
      weight_kg: "",
      volume_stere: "2",
      species: "Chêne, Hêtre",
      is_active: true,
    })
    setFeedback(null)
  }

  // Enregistrement des modifications
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setFeedback(null)

    const unit_price_cents = Math.round(parseFloat(formData.unit_price_euros.replace(",", ".")) * 100)

    const speciesArray = formData.species
      ? formData.species
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : null

    if (isCreating) {
      // Création
      const generatedSlug =
        formData.slug.trim() ||
        formData.name
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
          .replace(/^-+|-+$/g, "")

      const res = await createProductAction({
        name: formData.name,
        slug: generatedSlug,
        category: formData.category,
        short_description: formData.short_description || null,
        description: formData.description || null,
        unit_price_cents,
        stock_quantity: Number(formData.stock_quantity) || 0,
        image_url: formData.image_url,
        badge: formData.badge || null,
        humidity_rate: formData.humidity_rate ? parseFloat(formData.humidity_rate) : null,
        wood_length_cm: formData.wood_length_cm ? parseInt(formData.wood_length_cm) : null,
        packaging: formData.packaging,
        weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
        volume_stere: formData.volume_stere ? parseFloat(formData.volume_stere) : null,
        species: speciesArray,
        is_active: formData.is_active,
      })

      if (res?.error) {
        setFeedback({ type: "error", message: res.error })
      } else if (res?.product) {
        setProducts([res.product, ...products])
        setFeedback({ type: "success", message: "Nouveau produit créé avec succès !" })
        setTimeout(() => {
          setIsCreating(false)
          setFeedback(null)
        }, 1200)
      }
    } else if (editingProduct) {
      // Mise à jour
      const res = await updateProductAction({
        id: editingProduct.id,
        name: formData.name,
        slug: formData.slug,
        category: formData.category,
        short_description: formData.short_description || null,
        description: formData.description || null,
        unit_price_cents,
        stock_quantity: Number(formData.stock_quantity) || 0,
        image_url: formData.image_url,
        badge: formData.badge || null,
        humidity_rate: formData.humidity_rate ? parseFloat(formData.humidity_rate) : null,
        wood_length_cm: formData.wood_length_cm ? parseInt(formData.wood_length_cm) : null,
        packaging: formData.packaging,
        weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
        volume_stere: formData.volume_stere ? parseFloat(formData.volume_stere) : null,
        species: speciesArray,
        is_active: formData.is_active,
      })

      if (res?.error) {
        setFeedback({ type: "error", message: res.error })
      } else if (res?.product) {
        setProducts(products.map((p) => (p.id === editingProduct.id ? res.product : p)))
        setFeedback({ type: "success", message: "Modifications enregistrées dans Supabase !" })
        setTimeout(() => {
          setEditingProduct(null)
          setFeedback(null)
        }, 1200)
      }
    }

    setSaving(false)
  }

  // Changement rapide de statut (Actif / Inactif)
  const handleToggleStatus = async (p: Product) => {
    const res = await toggleProductStatusAction(p.id, p.is_active)
    if (res?.success) {
      setProducts(products.map((item) => (item.id === p.id ? { ...item, is_active: res.newStatus } : item)))
    }
  }

  // Statistiques calculées
  const stats = useMemo(() => {
    const total = products.length
    const active = products.filter((p) => p.is_active).length
    const totalStock = products.reduce((acc, p) => acc + (p.stock_quantity || 0), 0)
    const totalCategories = new Set(products.map((p) => p.category)).size
    return { total, active, totalStock, totalCategories }
  }, [products])

  return (
    <div className="min-h-screen bg-[#121110] text-stone-100 flex flex-col font-sans">
      {/* ================= BARRE DU HAUT ADMINISTRATEUR ================= */}
      <header className="sticky top-0 z-40 bg-[#1c1917] border-b border-stone-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-black">
                <Flame className="w-5 h-5 fill-stone-950" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight">
                  Leña<span className="text-amber-500">Directa</span>
                </span>
                <span className="block text-[9px] text-amber-500 uppercase tracking-widest font-black">
                  Tableau de Bord Scierie
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-stone-400">Connecté :</span>
              <span className="font-bold text-stone-200">{adminEmail}</span>
            </div>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-stone-300 hover:text-amber-400 bg-stone-900 hover:bg-stone-800 border border-stone-800 transition-colors"
            >
              <span>Voir la boutique</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => logoutAction()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-950/40 hover:bg-rose-900/40 border border-rose-900/60 transition-colors"
              title="Se déconnecter"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* ================= CONTENU PRINCIPAL ================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Titre & Bouton d'ajout */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-100 tracking-tight">
              Gestion du Catalogue Produits
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              Modifiez en temps réel les photos, prix, descriptions et caractéristiques techniques synchronisés avec Supabase.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-black text-sm transition-all shadow-md shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Nouveau Produit</span>
          </button>
        </div>

        {/* Cartes Statistiques */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-[#1c1917] border border-stone-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-stone-400 font-bold uppercase tracking-wider">Total Références</div>
              <div className="text-2xl font-black text-stone-100 mt-1">{stats.total}</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-amber-500">
              <Package className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#1c1917] border border-stone-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-stone-400 font-bold uppercase tracking-wider">Actifs en Boutique</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">{stats.active}</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-emerald-500">
              <Eye className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#1c1917] border border-stone-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-stone-400 font-bold uppercase tracking-wider">Stock Total Disponible</div>
              <div className="text-2xl font-black text-amber-500 mt-1">{stats.totalStock}</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-amber-500">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#1c1917] border border-stone-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-stone-400 font-bold uppercase tracking-wider">Catégories Gérées</div>
              <div className="text-2xl font-black text-stone-100 mt-1">{stats.totalCategories}</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Barre de Recherche & Filtres */}
        <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-4 mb-6 space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Champ de recherche */}
            <div className="relative w-full sm:flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par titre, slug, essence..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 focus:border-amber-500 text-stone-100 text-xs sm:text-sm placeholder:text-stone-500 outline-none"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filtre Statut */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                  statusFilter === "all"
                    ? "bg-stone-800 text-stone-100 border border-stone-700"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                Tous ({products.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("active")}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                  statusFilter === "active"
                    ? "bg-emerald-950/70 text-emerald-400 border border-emerald-800"
                    : "text-stone-400 hover:text-emerald-400"
                }`}
              >
                Actifs ({stats.active})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("inactive")}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                  statusFilter === "inactive"
                    ? "bg-stone-800 text-stone-400 border border-stone-700"
                    : "text-stone-500 hover:text-stone-300"
                }`}
              >
                Inactifs ({stats.total - stats.active})
              </button>
            </div>
          </div>

          {/* Onglets Catégories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold transition-colors shrink-0 ${
                  selectedCategory === cat.id
                    ? "bg-amber-500 text-stone-950 font-black shadow-sm"
                    : "bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grille des Produits */}
        {filteredProducts.length === 0 ? (
          <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-12 text-center">
            <Package className="w-12 h-12 text-stone-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-stone-200">Aucun produit trouvé</h3>
            <p className="text-xs text-stone-400 mt-1">
              Essayez de modifier votre recherche ou le filtre de catégorie.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`bg-[#1c1917] border rounded-2xl p-4 flex flex-col justify-between transition-all group ${
                  product.is_active ? "border-stone-800 hover:border-stone-700" : "border-stone-900 opacity-60"
                }`}
              >
                <div>
                  {/* Photo & Badges */}
                  <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-stone-950 mb-3 border border-stone-800">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-102 transition-transform duration-300"
                    />

                    {/* Badge commercial */}
                    {product.badge && (
                      <div className="absolute top-2 left-2 bg-stone-950/90 border border-stone-700 text-amber-400 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider backdrop-blur-sm">
                        {product.badge}
                      </div>
                    )}

                    {/* Statut En ligne */}
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(product)}
                      title={product.is_active ? "Désactiver ce produit" : "Activer ce produit"}
                      className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 backdrop-blur-sm border shadow ${
                        product.is_active
                          ? "bg-emerald-950/90 text-emerald-300 border-emerald-700"
                          : "bg-stone-950/90 text-stone-400 border-stone-700"
                      }`}
                    >
                      {product.is_active ? (
                        <>
                          <Eye className="w-3 h-3 text-emerald-400" />
                          <span>En ligne</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3 text-stone-400" />
                          <span>Hors ligne</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Catégorie & Titre */}
                  <div className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1">
                    {CATEGORIES.find((c) => c.id === product.category)?.label || product.category}
                  </div>
                  <h3 className="font-bold text-stone-100 text-sm leading-snug line-clamp-2 mb-1.5">
                    {product.name}
                  </h3>
                  <p className="text-xs text-stone-400 line-clamp-2 mb-3">
                    {product.short_description || product.description || "Aucune description renseignée."}
                  </p>
                </div>

                {/* Bas de la carte : Prix, Stock & Bouton Modifier */}
                <div className="pt-3 border-t border-stone-800">
                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <div className="text-xl font-black text-amber-500">
                        {formatPrice(product.unit_price_cents)}
                      </div>
                      <div className="text-[10px] text-stone-400">
                        Stock : <strong className="text-stone-200">{product.stock_quantity} dispo</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/produit/${product.slug}`}
                        target="_blank"
                        className="p-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-800 transition-colors"
                        title="Ouvrir la fiche publique"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleOpenEdit(product)}
                        className="px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Modifier</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ================= MODALE ÉDITION / CRÉATION PRODUIT ================= */}
      {(editingProduct || isCreating) && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-2xl bg-[#1c1917] border-l border-stone-800 h-full overflow-y-auto flex flex-col p-6 sm:p-8 shadow-2xl">
            {/* En-tête de la modale */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-6">
              <div>
                <h2 className="text-xl font-black text-stone-100">
                  {isCreating ? "Créer un Nouveau Produit" : `Modifier : ${editingProduct?.name}`}
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Toutes les modifications sont synchronisées directement dans Supabase.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null)
                  setIsCreating(false)
                }}
                className="w-9 h-9 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification de feedback */}
            {feedback && (
              <div
                className={`mb-5 p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
                  feedback.type === "success"
                    ? "bg-emerald-950/80 border-emerald-700 text-emerald-300"
                    : "bg-rose-950/80 border-rose-800 text-rose-300"
                }`}
              >
                {feedback.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

            {/* Formulaire */}
            <form onSubmit={handleSave} className="space-y-5 flex-1">
              {/* Nom & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                    Titre du Produit *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Chêne & Charme Sec - 33 cm"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 focus:border-amber-500 text-stone-100 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                    Identifiant d&apos;URL (Slug) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="chene-charme-33cm-palette"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 focus:border-amber-500 text-stone-100 text-sm font-mono outline-none"
                  />
                </div>
              </div>

              {/* Catégorie & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                    Catégorie Principale *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 focus:border-amber-500 text-stone-100 text-sm outline-none"
                  >
                    <option value="bois_buches">Bois de Chauffage (Bûches)</option>
                    <option value="granules_pellets">Granulés de Bois &amp; Pellets</option>
                    <option value="buches_compressees">Bûches Compressées &amp; Pavés</option>
                    <option value="charbon_bois">Charbon de Bois (Resto &amp; Artisanal)</option>
                    <option value="poeles">Poêles à Bois &amp; Cuisinières</option>
                    <option value="allumage">Bois d&apos;Allumage &amp; Filets</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                    Badge Commercial (optionnel)
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Ex: Four Cuisson & Chauffage, Din+"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 focus:border-amber-500 text-stone-100 text-sm outline-none"
                  />
                </div>
              </div>

              {/* SECTION IMAGE AVEC APERÇU EN DIRECT */}
              <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
                    <span>Image du Produit * (Aperçu en direct)</span>
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  {/* Aperçu visuel instantané */}
                  <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-stone-950 border border-stone-700 shrink-0">
                    {formData.image_url ? (
                      <Image
                        src={formData.image_url}
                        alt="Aperçu"
                        fill
                        className="object-cover"
                        onError={() => {}}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-stone-500">
                        Aucune image
                      </div>
                    )}
                  </div>

                  {/* Saisie de l'URL */}
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      required
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="/images/products/votre-photo.jpg ou URL https://"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-500 text-stone-100 text-xs sm:text-sm font-mono outline-none"
                    />
                    <div className="text-[11px] text-stone-400">
                      Vous pouvez coller un chemin local ou choisir ci-dessous parmi les photos certifiées de la scierie.
                    </div>
                  </div>
                </div>

                {/* Galerie de sélection en 1 clic */}
                <div className="pt-2 border-t border-stone-800">
                  <div className="text-[11px] font-bold text-stone-400 mb-2">
                    Choisir rapidement une photo de la scierie :
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {AVAILABLE_GALLERY_PHOTOS.map((photo) => (
                      <button
                        key={photo.url}
                        type="button"
                        onClick={() => setFormData({ ...formData, image_url: photo.url })}
                        className={`relative w-16 h-12 rounded-md overflow-hidden shrink-0 border-2 transition-all ${
                          formData.image_url === photo.url
                            ? "border-amber-500 scale-105"
                            : "border-stone-800 hover:border-stone-600 opacity-60 hover:opacity-100"
                        }`}
                        title={photo.name}
                      >
                        <Image src={photo.url} alt={photo.name} fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Prix & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                    Prix Unitaire TTC (€) *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.unit_price_euros}
                      onChange={(e) => setFormData({ ...formData, unit_price_euros: e.target.value })}
                      placeholder="Ex: 399.00"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 focus:border-amber-500 text-amber-400 font-black text-lg outline-none"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-bold">€</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                    Quantité en Stock *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 focus:border-amber-500 text-stone-100 text-sm font-bold outline-none"
                  />
                </div>
              </div>

              {/* Caractéristiques Techniques */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                    Humidité (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.humidity_rate}
                    onChange={(e) => setFormData({ ...formData, humidity_rate: e.target.value })}
                    placeholder="18"
                    className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-100 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                    Longueur (cm)
                  </label>
                  <input
                    type="number"
                    value={formData.wood_length_cm}
                    onChange={(e) => setFormData({ ...formData, wood_length_cm: e.target.value })}
                    placeholder="33"
                    className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-100 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                    Volume (stères)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.volume_stere}
                    onChange={(e) => setFormData({ ...formData, volume_stere: e.target.value })}
                    placeholder="3"
                    className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-100 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                    Poids (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weight_kg}
                    onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
                    placeholder="1200"
                    className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-100 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Essences ou Matériaux */}
              <div>
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                  Essences de bois ou Matériaux (séparés par des virgules)
                </label>
                <input
                  type="text"
                  value={formData.species}
                  onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                  placeholder="Chêne, Charme, Hêtre (ou Fonte, Acier)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 focus:border-amber-500 text-stone-100 text-sm outline-none"
                />
              </div>

              {/* Description Courte */}
              <div>
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                  Description Courte (résumé accrocheur)
                </label>
                <input
                  type="text"
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="Ex: Bûches fendues séchées sous abri ventilé • Prêt à l'emploi"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 focus:border-amber-500 text-stone-100 text-sm outline-none"
                />
              </div>

              {/* Description Complète */}
              <div>
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                  Description Complète
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Détail complet des caractéristiques, allumage, rendement et livraison..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 focus:border-amber-500 text-stone-100 text-sm outline-none resize-y"
                />
              </div>

              {/* Toggle Statut Visible */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="is_active_toggle"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-5 h-5 rounded bg-stone-900 border-stone-800 text-amber-500 focus:ring-amber-500 focus:ring-offset-stone-950"
                />
                <label htmlFor="is_active_toggle" className="text-sm font-bold text-stone-200 cursor-pointer">
                  Produit actif et visible immédiatement en boutique
                </label>
              </div>

              {/* Boutons d'Action */}
              <div className="pt-4 border-t border-stone-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null)
                    setIsCreating(false)
                  }}
                  className="px-5 py-2.5 rounded-xl border border-stone-800 text-stone-400 hover:text-stone-200 text-sm font-bold transition-colors"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm flex items-center gap-2 transition-all shadow-lg disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Synchronisation Supabase...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{isCreating ? "Créer le produit" : "Enregistrer dans la base"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
