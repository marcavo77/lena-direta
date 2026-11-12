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
  Users,
  ShoppingBag,
  CreditCard,
  Truck,
  Trash2,
  Clock,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShieldCheck,
  Check,
  AlertTriangle,
  Info,
  Globe,
  Monitor,
  KeyRound,
  Copy,
} from "lucide-react"
import type { Product } from "@/lib/supabase/database.types"
import { formatPrice } from "@/lib/utils"
import {
  updateProductAction,
  createProductAction,
  toggleProductStatusAction,
  confirmOrderPaymentAction,
  updateOrderStatusAction,
  deleteCustomerAction,
  deleteOrderAction,
  type ProductUpdateInput,
  type ProductCreateInput,
  type AdminCustomer,
} from "@/app/actions/admin"
import { logoutAction } from "@/app/actions/auth"

interface AdminDashboardClientProps {
  initialProducts: Product[]
  initialOrders: any[]
  initialCustomers: AdminCustomer[]
  initialStats: {
    totalCustomers: number
    totalOrders: number
    pendingTransferCount: number
    totalRevenueCents: number
    activeDeliveriesCount: number
    totalProductsCount: number
  }
  initialTab?: "products" | "orders" | "customers"
  adminEmail: string
}

function formatUserAgent(ua: string | null): string {
  if (!ua) return "Inconnu"
  if (ua === "node") return "API / Serveur Node.js"
  let browser = "Navigateur"
  if (ua.includes("Edg/")) browser = "Microsoft Edge"
  else if (ua.includes("OPR/") || ua.includes("Opera")) browser = "Opera"
  else if (ua.includes("Chrome/")) browser = "Google Chrome"
  else if (ua.includes("Firefox/")) browser = "Mozilla Firefox"
  else if (ua.includes("Safari/")) browser = "Safari"

  let os = "Appareil"
  if (ua.includes("iPhone")) os = "iPhone (iOS)"
  else if (ua.includes("iPad")) os = "iPad (iPadOS)"
  else if (ua.includes("Android")) os = "Android"
  else if (ua.includes("Windows NT")) os = "Windows"
  else if (ua.includes("Mac OS X")) os = "macOS"
  else if (ua.includes("Linux")) os = "Linux"

  return `${browser} • ${os}`
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

export function AdminDashboardClient({
  initialProducts,
  initialOrders,
  initialCustomers,
  initialStats,
  initialTab = "orders",
  adminEmail,
}: AdminDashboardClientProps) {
  // Navigation par Onglets
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "customers">(initialTab)

  // États Produits
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [productSearch, setProductSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isCreatingProduct, setIsCreatingProduct] = useState(false)
  const [productFormLoading, setProductFormLoading] = useState(false)
  const [productFeedback, setProductFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)

  // États Commandes
  const [orders, setOrders] = useState<any[]>(initialOrders)
  const [orderSearch, setOrderSearch] = useState("")
  const [orderFilter, setOrderFilter] = useState<"all" | "pending_transfer" | "paid" | "preparing" | "delivery">("all")
  const [orderActionLoading, setOrderActionLoading] = useState<string | null>(null)
  const [orderFeedback, setOrderFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)

  // États Clients
  const [customers, setCustomers] = useState<AdminCustomer[]>(initialCustomers)
  const [customerSearch, setCustomerSearch] = useState("")
  const [selectedCustomerInfo, setSelectedCustomerInfo] = useState<AdminCustomer | null>(null)
  const [copiedId, setCopiedId] = useState(false)
  const [customerToDelete, setCustomerToDelete] = useState<AdminCustomer | null>(null)
  const [customerDeleteLoading, setCustomerDeleteLoading] = useState(false)

  // Stats dynamiques
  const [stats, setStats] = useState(initialStats)

  // ================= FILTRES PRODUITS =================
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCategory === "all" || p.category === selectedCategory
      const query = productSearch.toLowerCase().trim()
      const matchSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.slug.toLowerCase().includes(query) ||
        (p.short_description && p.short_description.toLowerCase().includes(query)) ||
        (p.species && p.species.some((s) => s.toLowerCase().includes(query)))
      return matchCat && matchSearch
    })
  }, [products, selectedCategory, productSearch])

  // ================= FILTRES COMMANDES =================
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Filtre statut
      let matchFilter = true
      if (orderFilter === "pending_transfer") {
        matchFilter = o.payment_status === "transfer_notified" || o.status === "payment_notified"
      } else if (orderFilter === "paid") {
        matchFilter = o.status === "paid" || o.payment_status === "paid"
      } else if (orderFilter === "preparing") {
        matchFilter = o.status === "preparing"
      } else if (orderFilter === "delivery") {
        matchFilter = o.status === "out_for_delivery" || o.status === "delivered"
      }

      // Recherche
      const query = orderSearch.toLowerCase().trim()
      const matchSearch =
        !query ||
        o.order_number.toLowerCase().includes(query) ||
        o.customer_name.toLowerCase().includes(query) ||
        o.customer_email.toLowerCase().includes(query) ||
        o.customer_phone.toLowerCase().includes(query)

      return matchFilter && matchSearch
    })
  }, [orders, orderFilter, orderSearch])

  // ================= FILTRES CLIENTS =================
  const filteredCustomers = useMemo(() => {
    const query = customerSearch.toLowerCase().trim()
    if (!query) return customers
    return customers.filter(
      (c) =>
        c.email.toLowerCase().includes(query) ||
        (c.full_name && c.full_name.toLowerCase().includes(query)) ||
        (c.phone && c.phone.toLowerCase().includes(query))
    )
  }, [customers, customerSearch])

  // ================= ACTIONS PRODUITS =================
  const handleToggleProductStatus = async (product: Product) => {
    const res = await toggleProductStatusAction(product.id, product.is_active)
    if (res.success && res.newStatus !== undefined) {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, is_active: res.newStatus } : p))
      )
    }
  }

  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setProductFormLoading(true)
    setProductFeedback(null)

    const form = new FormData(e.currentTarget)
    const rawSpecies = (form.get("species") as string) || ""
    const speciesArray = rawSpecies
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)

    const payload: ProductUpdateInput = {
      id: editingProduct!.id,
      name: (form.get("name") as string).trim(),
      slug: (form.get("slug") as string).trim(),
      short_description: ((form.get("short_description") as string) || "").trim() || null,
      description: ((form.get("description") as string) || "").trim() || null,
      category: form.get("category") as ProductCategory,
      species: speciesArray.length > 0 ? speciesArray : null,
      humidity_rate: form.get("humidity_rate") ? Number(form.get("humidity_rate")) : null,
      wood_length_cm: form.get("wood_length_cm") ? Number(form.get("wood_length_cm")) : null,
      packaging: ((form.get("packaging") as string) || "palette").trim(),
      volume_stere: form.get("volume_stere") ? Number(form.get("volume_stere")) : null,
      weight_kg: form.get("weight_kg") ? Number(form.get("weight_kg")) : null,
      unit_price_cents: Math.round(Number(form.get("unit_price_euros")) * 100),
      stock_quantity: Number(form.get("stock_quantity") || 0),
      image_url: ((form.get("image_url") as string) || "").trim(),
      badge: ((form.get("badge") as string) || "").trim() || null,
      is_active: form.get("is_active") === "on",
    }

    const res = await updateProductAction(payload)
    setProductFormLoading(false)

    if (res.error) {
      setProductFeedback({ type: "error", message: res.error })
    } else if (res.product) {
      setProducts((prev) => prev.map((p) => (p.id === res.product!.id ? res.product! : p)))
      setProductFeedback({ type: "success", message: `Produit "${res.product.name}" mis à jour avec succès !` })
      setTimeout(() => {
        setEditingProduct(null)
        setProductFeedback(null)
      }, 1200)
    }
  }

  const handleCreateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setProductFormLoading(true)
    setProductFeedback(null)

    const form = new FormData(e.currentTarget)
    const rawSpecies = (form.get("species") as string) || ""
    const speciesArray = rawSpecies
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)

    const payload: ProductCreateInput = {
      name: (form.get("name") as string).trim(),
      slug: (form.get("slug") as string).trim(),
      short_description: ((form.get("short_description") as string) || "").trim() || null,
      description: ((form.get("description") as string) || "").trim() || null,
      category: form.get("category") as ProductCategory,
      species: speciesArray.length > 0 ? speciesArray : null,
      humidity_rate: form.get("humidity_rate") ? Number(form.get("humidity_rate")) : null,
      wood_length_cm: form.get("wood_length_cm") ? Number(form.get("wood_length_cm")) : null,
      packaging: ((form.get("packaging") as string) || "palette").trim(),
      volume_stere: form.get("volume_stere") ? Number(form.get("volume_stere")) : null,
      weight_kg: form.get("weight_kg") ? Number(form.get("weight_kg")) : null,
      unit_price_cents: Math.round(Number(form.get("unit_price_euros")) * 100),
      stock_quantity: Number(form.get("stock_quantity") || 0),
      image_url: ((form.get("image_url") as string) || "").trim(),
      badge: ((form.get("badge") as string) || "").trim() || null,
      is_active: form.get("is_active") === "on",
    }

    const res = await createProductAction(payload)
    setProductFormLoading(false)

    if (res.error) {
      setProductFeedback({ type: "error", message: res.error })
    } else if (res.product) {
      setProducts((prev) => [res.product!, ...prev])
      setProductFeedback({ type: "success", message: `Nouveau produit "${res.product.name}" créé avec succès !` })
      setTimeout(() => {
        setIsCreatingProduct(false)
        setProductFeedback(null)
      }, 1200)
    }
  }

  // ================= ACTIONS COMMANDES =================
  const handleConfirmTransfer = async (orderId: string) => {
    setOrderActionLoading(orderId)
    setOrderFeedback(null)
    const res = await confirmOrderPaymentAction(orderId)
    setOrderActionLoading(null)
    if (res.error) {
      setOrderFeedback({ type: "error", message: res.error })
    } else {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: "paid", payment_status: "paid" } : o
        )
      )
      setStats((prev) => ({
        ...prev,
        pendingTransferCount: Math.max(0, prev.pendingTransferCount - 1),
      }))
      setOrderFeedback({ type: "success", message: "Virement validé avec succès ! Commande passée en statut payée." })
      setTimeout(() => setOrderFeedback(null), 3000)
    }
  }

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    setOrderActionLoading(orderId)
    const res = await updateOrderStatusAction(orderId, newStatus)
    setOrderActionLoading(null)
    if (res.error) {
      setOrderFeedback({ type: "error", message: res.error })
    } else {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      )
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Voulez-vous vraiment supprimer définitivement cette commande ?")) return
    setOrderActionLoading(orderId)
    const res = await deleteOrderAction(orderId)
    setOrderActionLoading(null)
    if (res.error) {
      setOrderFeedback({ type: "error", message: res.error })
    } else {
      setOrders((prev) => prev.filter((o) => o.id !== orderId))
    }
  }

  // ================= ACTIONS CLIENTS =================
  const handleDeleteCustomerConfirm = async () => {
    if (!customerToDelete) return
    setCustomerDeleteLoading(true)
    const res = await deleteCustomerAction(customerToDelete.id)
    setCustomerDeleteLoading(false)
    if (res.error) {
      alert(res.error)
    } else {
      setCustomers((prev) => prev.filter((c) => c.id !== customerToDelete.id))
      setStats((prev) => ({ ...prev, totalCustomers: Math.max(0, prev.totalCustomers - 1) }))
      setCustomerToDelete(null)
    }
  }

  return (
    <div className="bg-[#121110] min-h-screen text-stone-100 flex flex-col font-sans">
      {/* Barre Supérieure d'Administration */}
      <header className="bg-[#1c1917] border-b border-stone-800 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center shrink-0">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-stone-100 text-base sm:text-lg tracking-tight">
                  LeñaDirecta
                </span>
                <span className="text-[10px] bg-amber-500 text-stone-950 font-black px-2 py-0.5 rounded uppercase tracking-wider">
                  Admin Scierie
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                Connecté en tant que <span className="text-amber-400 font-semibold">{adminEmail}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-300 hover:text-amber-400 bg-stone-900 border border-stone-800 hover:border-amber-500/40 px-3.5 py-2 rounded-xl transition-all min-h-[40px]"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Voir la boutique</span>
            </Link>

            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 bg-stone-900 border border-stone-800 hover:border-rose-500/30 px-3.5 py-2 rounded-xl transition-all min-h-[40px]"
              >
                <LogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1 py-6 sm:py-10 max-w-7xl w-full mx-auto px-4 sm:px-6 space-y-6">
        {/* Alerte Virement Prioritaire */}
        {stats.pendingTransferCount > 0 && (
          <div className="bg-amber-950/40 border-2 border-amber-500/70 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 mt-0.5 font-black animate-pulse">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-amber-300 text-sm sm:text-base">
                  {stats.pendingTransferCount} virement{stats.pendingTransferCount > 1 ? "s" : ""} bancaire{stats.pendingTransferCount > 1 ? "s" : ""} signalé{stats.pendingTransferCount > 1 ? "s" : ""} en attente de vérification !
                </h3>
                <p className="text-xs text-stone-300 mt-0.5 leading-relaxed">
                  Des clients ont cliqué sur le bouton de signalement de virement. Vérifiez la réception sur votre compte bancaire et validez les commandes pour lancer la préparation.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveTab("orders")
                setOrderFilter("pending_transfer")
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider shrink-0 transition-all shadow-md active:scale-95 min-h-[44px]"
            >
              <span>Vérifier les virements ({stats.pendingTransferCount})</span>
              <Check className="w-4 h-4 stroke-[3] shrink-0" />
            </button>
          </div>
        )}

        {/* 4 Cartes d'Activité Clés */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* 1. Clients Inscrits */}
          <button
            type="button"
            onClick={() => setActiveTab("customers")}
            className="text-left bg-[#1c1917] border border-stone-800 hover:border-amber-500/40 rounded-2xl p-4 sm:p-5 space-y-1 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                Clients Inscrits
              </span>
              <Users className="w-4 h-4 text-stone-500 group-hover:text-amber-400 transition-colors" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-stone-100">
              {stats.totalCustomers}
            </div>
            <span className="text-[10px] text-stone-500 block">Comptes acheteurs actifs</span>
          </button>

          {/* 2. Total Commandes */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("orders")
              setOrderFilter("all")
            }}
            className="text-left bg-[#1c1917] border border-stone-800 hover:border-amber-500/40 rounded-2xl p-4 sm:p-5 space-y-1 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                Commandes
              </span>
              <ShoppingBag className="w-4 h-4 text-stone-500 group-hover:text-amber-400 transition-colors" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-stone-100">
              {stats.totalOrders}
            </div>
            <span className="text-[10px] text-stone-500 block">Passées sur le site</span>
          </button>

          {/* 3. Virements à valider */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("orders")
              setOrderFilter("pending_transfer")
            }}
            className={`text-left border rounded-2xl p-4 sm:p-5 space-y-1 transition-all group ${
              stats.pendingTransferCount > 0
                ? "bg-amber-950/40 border-amber-500/50 hover:border-amber-400"
                : "bg-[#1c1917] border-stone-800 hover:border-amber-500/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                Virements à valider
              </span>
              <CreditCard className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400">
              {stats.pendingTransferCount}
            </div>
            <span className="text-[10px] text-amber-300/80 block">Signalés par les clients</span>
          </button>

          {/* 4. Chiffre d'Affaires Encaissé */}
          <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-4 sm:p-5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                Paiements Validés
              </span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">
              {formatPrice(stats.totalRevenueCents)}
            </div>
            <span className="text-[10px] text-stone-500 block">Encaissé sur les commandes payées</span>
          </div>
        </div>

        {/* Barre de navigation entre Onglets */}
        <div className="flex border-b border-stone-800 space-x-2 sm:space-x-4 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 pb-3.5 px-3 text-xs sm:text-sm font-black border-b-2 transition-all whitespace-nowrap min-h-[44px] ${
              activeTab === "orders"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-stone-400 hover:text-stone-200"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Commandes &amp; Livraisons ({orders.length})</span>
            {stats.pendingTransferCount > 0 && (
              <span className="text-[10px] bg-amber-500 text-stone-950 px-1.5 py-0.2 rounded-full font-black">
                {stats.pendingTransferCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("customers")}
            className={`flex items-center gap-2 pb-3.5 px-3 text-xs sm:text-sm font-black border-b-2 transition-all whitespace-nowrap min-h-[44px] ${
              activeTab === "customers"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-stone-400 hover:text-stone-200"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Clients Inscrits ({customers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 pb-3.5 px-3 text-xs sm:text-sm font-black border-b-2 transition-all whitespace-nowrap min-h-[44px] ${
              activeTab === "products"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-stone-400 hover:text-stone-200"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Gestion des Produits ({products.length})</span>
          </button>
        </div>

        {/* ================= ONGLET COMMANDES & PAIEMENTS ================= */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {orderFeedback && (
              <div
                className={`p-4 rounded-xl text-xs font-bold border flex items-center gap-2 ${
                  orderFeedback.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                }`}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{orderFeedback.message}</span>
              </div>
            )}

            {/* Filtres de Commandes */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setOrderFilter("all")}
                  className={`text-xs font-bold px-3 py-2 rounded-xl transition-all min-h-[38px] ${
                    orderFilter === "all"
                      ? "bg-amber-500 text-stone-950 font-black"
                      : "bg-stone-900 border border-stone-800 text-stone-300 hover:border-stone-700"
                  }`}
                >
                  Toutes ({orders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setOrderFilter("pending_transfer")}
                  className={`text-xs font-bold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 min-h-[38px] ${
                    orderFilter === "pending_transfer"
                      ? "bg-amber-500 text-stone-950 font-black"
                      : "bg-stone-900 border border-amber-500/40 text-amber-400 hover:bg-stone-800"
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Virements signalés ({stats.pendingTransferCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOrderFilter("paid")}
                  className={`text-xs font-bold px-3 py-2 rounded-xl transition-all min-h-[38px] ${
                    orderFilter === "paid"
                      ? "bg-amber-500 text-stone-950 font-black"
                      : "bg-stone-900 border border-stone-800 text-stone-300 hover:border-stone-700"
                  }`}
                >
                  Payées
                </button>
                <button
                  type="button"
                  onClick={() => setOrderFilter("preparing")}
                  className={`text-xs font-bold px-3 py-2 rounded-xl transition-all min-h-[38px] ${
                    orderFilter === "preparing"
                      ? "bg-amber-500 text-stone-950 font-black"
                      : "bg-stone-900 border border-stone-800 text-stone-300 hover:border-stone-700"
                  }`}
                >
                  En préparation
                </button>
                <button
                  type="button"
                  onClick={() => setOrderFilter("delivery")}
                  className={`text-xs font-bold px-3 py-2 rounded-xl transition-all min-h-[38px] ${
                    orderFilter === "delivery"
                      ? "bg-amber-500 text-stone-950 font-black"
                      : "bg-stone-900 border border-stone-800 text-stone-300 hover:border-stone-700"
                  }`}
                >
                  Livraisons
                </button>
              </div>

              {/* Recherche Commande */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="N° commande, client, tél, email..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full bg-[#1c1917] border border-stone-800 focus:border-amber-500 rounded-xl pl-9 pr-4 py-2 text-xs text-stone-200 placeholder:text-stone-600 outline-none min-h-[40px]"
                />
              </div>
            </div>

            {/* Liste des Commandes */}
            {filteredOrders.length === 0 ? (
              <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-10 text-center space-y-2">
                <ShoppingBag className="w-8 h-8 text-stone-600 mx-auto" />
                <div className="text-sm font-bold text-stone-300">Aucune commande trouvée</div>
                <p className="text-xs text-stone-500">Modifiez vos critères de recherche ou de filtre.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((ord) => {
                  const isPendingTransfer =
                    ord.payment_status === "transfer_notified" || ord.status === "payment_notified"
                  const isPaid = ord.payment_status === "paid" || ord.status === "paid"
                  const shipping = ord.shipping_address || {}
                  const items = ord.items || []

                  return (
                    <div
                      key={ord.id}
                      className={`bg-[#1c1917] border-2 rounded-2xl p-5 sm:p-6 space-y-4 transition-all ${
                        isPendingTransfer
                          ? "border-amber-500/70 shadow-lg shadow-amber-500/5 bg-[#1f1a14]"
                          : "border-stone-800"
                      }`}
                    >
                      {/* En-tête Commande */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800/80">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="font-mono font-black text-amber-400 text-base sm:text-lg">
                            {ord.order_number}
                          </span>
                          <span className="text-xs text-stone-500">
                            Passée le {new Date(ord.created_at).toLocaleString("fr-FR")}
                          </span>

                          {/* Badge de statut */}
                          <span
                            className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${
                              isPaid
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                : isPendingTransfer
                                ? "bg-amber-500 text-stone-950 border-amber-400 font-black animate-pulse"
                                : ord.status === "preparing"
                                ? "bg-sky-500/10 border-sky-500/30 text-sky-400"
                                : ord.status === "out_for_delivery"
                                ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                                : ord.status === "delivered"
                                ? "bg-emerald-600/20 border-emerald-500/40 text-emerald-300"
                                : "bg-stone-800 border-stone-700 text-stone-300"
                            }`}
                          >
                            {isPendingTransfer
                              ? "⚠️ VIREMENT SIGNALÉ PAR LE CLIENT"
                              : isPaid
                              ? "Paiement Validé"
                              : ord.status === "preparing"
                              ? "En préparation hangar"
                              : ord.status === "out_for_delivery"
                              ? "En cours de livraison"
                              : ord.status === "delivered"
                              ? "Livrée"
                              : "En attente de virement"}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-xl sm:text-2xl font-black text-stone-100 font-mono">
                            {formatPrice(ord.total_cents)}
                          </span>
                          <span className="text-[10px] text-stone-500 block uppercase">TTC Livré</span>
                        </div>
                      </div>

                      {/* Coordonnées Client & Lieu de Dépose */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        {/* Client */}
                        <div className="bg-stone-900/60 border border-stone-800/80 rounded-xl p-3.5 space-y-1.5">
                          <span className="text-[10px] uppercase font-bold text-stone-500 block">
                            Client &amp; Contact
                          </span>
                          <div className="font-bold text-stone-200">{ord.customer_name}</div>
                          <div className="flex items-center gap-1 text-stone-400">
                            <Mail className="w-3.5 h-3.5 text-stone-500" />
                            <a href={`mailto:${ord.customer_email}`} className="hover:text-amber-400">
                              {ord.customer_email}
                            </a>
                          </div>
                          <div className="flex items-center gap-1 text-stone-400">
                            <Phone className="w-3.5 h-3.5 text-stone-500" />
                            <a href={`tel:${ord.customer_phone}`} className="hover:text-amber-400 font-semibold text-stone-200">
                              {ord.customer_phone}
                            </a>
                          </div>
                        </div>

                        {/* Adresse & Accès */}
                        <div className="bg-stone-900/60 border border-stone-800/80 rounded-xl p-3.5 space-y-1.5">
                          <span className="text-[10px] uppercase font-bold text-stone-500 block">
                            Adresse de Livraison
                          </span>
                          <div className="text-stone-300 font-medium">
                            {shipping.street || "Non spécifié"}
                            <br />
                            {shipping.postal_code} {shipping.city}
                          </div>
                          {shipping.delivery_notes && (
                            <div className="text-[11px] text-amber-400/90 pt-1 border-t border-stone-800">
                              <span className="font-bold">Accès : </span>
                              {shipping.delivery_notes}
                            </div>
                          )}
                        </div>

                        {/* Créneau & Articles */}
                        <div className="bg-stone-900/60 border border-stone-800/80 rounded-xl p-3.5 space-y-1.5">
                          <span className="text-[10px] uppercase font-bold text-stone-500 block">
                            Articles Commandés ({items.length})
                          </span>
                          <div className="space-y-1">
                            {items.map((it: any, idx: number) => (
                              <div key={idx} className="flex justify-between text-[11px]">
                                <span className="text-stone-300 truncate max-w-[170px]">{it.name}</span>
                                <span className="text-stone-400 font-bold shrink-0">x{it.quantity}</span>
                              </div>
                            ))}
                          </div>
                          {shipping.preferred_week && (
                            <div className="text-[11px] text-stone-400 pt-1 border-t border-stone-800">
                              Période : {shipping.preferred_week}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Notes Administrateur */}
                      {ord.admin_notes && (
                        <div className="bg-stone-950/80 border border-stone-800/80 rounded-xl p-3 text-xs text-stone-400 font-mono whitespace-pre-line">
                          <span className="text-[10px] font-sans font-bold text-stone-500 uppercase block mb-1">
                            Historique des Notes &amp; Notifications :
                          </span>
                          {ord.admin_notes}
                        </div>
                      )}

                      {/* Barre d'Action Admin sur la commande */}
                      <div className="pt-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-t border-stone-800">
                        {/* Validation Virement Prioritaire */}
                        {isPendingTransfer && (
                          <button
                            type="button"
                            onClick={() => handleConfirmTransfer(ord.id)}
                            disabled={orderActionLoading === ord.id}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-4 py-3 sm:py-2.5 rounded-xl uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-50 min-h-[44px] shrink-0 text-center"
                          >
                            {orderActionLoading === ord.id ? (
                              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4 stroke-[2.5] shrink-0" />
                            )}
                            <span className="sm:hidden leading-tight">Valider le virement reçu</span>
                            <span className="hidden sm:inline leading-tight">Valider la réception du virement</span>
                          </button>
                        )}

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full lg:w-auto flex-1">
                          {/* Progression du statut */}
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="text-stone-500 font-medium w-full sm:w-auto">Changer statut :</span>
                            {ord.status !== "preparing" && (
                              <button
                                type="button"
                                onClick={() => handleUpdateOrderStatus(ord.id, "preparing")}
                                className="px-3 py-2 sm:py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 font-semibold border border-stone-800 transition-colors min-h-[40px] sm:min-h-[36px]"
                              >
                                En préparation
                              </button>
                            )}
                            {ord.status !== "out_for_delivery" && (
                              <button
                                type="button"
                                onClick={() => handleUpdateOrderStatus(ord.id, "out_for_delivery")}
                                className="px-3 py-2 sm:py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-purple-300 font-semibold border border-stone-800 transition-colors min-h-[40px] sm:min-h-[36px]"
                              >
                                En livraison
                              </button>
                            )}
                            {ord.status !== "delivered" && (
                              <button
                                type="button"
                                onClick={() => handleUpdateOrderStatus(ord.id, "delivered")}
                                className="px-3 py-2 sm:py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-emerald-400 font-semibold border border-stone-800 transition-colors min-h-[40px] sm:min-h-[36px]"
                              >
                                Marquer livrée
                              </button>
                            )}
                          </div>

                          {/* Supprimer la commande */}
                          <button
                            type="button"
                            onClick={() => handleDeleteOrder(ord.id)}
                            className="inline-flex items-center justify-center sm:justify-start gap-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 sm:bg-transparent border border-rose-500/20 sm:border-0 px-3 py-2 sm:p-1.5 rounded-lg min-h-[40px] sm:min-h-[36px] self-start sm:self-auto"
                            title="Supprimer la commande"
                          >
                            <Trash2 className="w-4 h-4 shrink-0" />
                            <span>Supprimer</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ================= ONGLET CLIENTS INSCRITS ================= */}
        {activeTab === "customers" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-stone-100">
                  Comptes Clients Enregistrés ({customers.length})
                </h2>
                <p className="text-xs text-stone-400">
                  Visualisez les coordonnées, dates de création, dernières connexions et commandes passées.
                </p>
              </div>

              {/* Recherche Client */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email, tél..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full bg-[#1c1917] border border-stone-800 focus:border-amber-500 rounded-xl pl-9 pr-4 py-2 text-xs text-stone-200 placeholder:text-stone-600 outline-none min-h-[40px]"
                />
              </div>
            </div>

            {filteredCustomers.length === 0 ? (
              <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-10 text-center space-y-2">
                <Users className="w-8 h-8 text-stone-600 mx-auto" />
                <div className="text-sm font-bold text-stone-300">Aucun client trouvé</div>
                <p className="text-xs text-stone-500">Aucun utilisateur ne correspond à votre recherche.</p>
              </div>
            ) : (
              <div className="bg-[#1c1917] border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-900/80 border-b border-stone-800 text-stone-400 uppercase tracking-wider text-[10px] font-bold">
                      <tr>
                        <th className="py-3 px-4">Client</th>
                        <th className="py-3 px-4">Coordonnées</th>
                        <th className="py-3 px-4">Inscription</th>
                        <th className="py-3 px-4">Dernière Connexion</th>
                        <th className="py-3 px-4">Commandes</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800">
                      {filteredCustomers.map((cust) => (
                        <tr key={cust.id} className="hover:bg-stone-900/40 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-stone-200">
                              {cust.full_name || "Nom non renseigné"}
                            </div>
                            <span className="text-[11px] text-stone-500 font-mono">
                              ID: {cust.id.slice(0, 8)}...
                            </span>
                          </td>
                          <td className="py-3.5 px-4 space-y-0.5">
                            <div className="text-stone-300 font-medium">{cust.email}</div>
                            {cust.phone && (
                              <div className="text-stone-400 text-[11px]">{cust.phone}</div>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-stone-400">
                            {new Date(cust.created_at).toLocaleDateString("fr-FR")}
                          </td>
                          <td className="py-3.5 px-4">
                            {cust.last_sign_in_at ? (
                              <span className="text-stone-300">
                                {new Date(cust.last_sign_in_at).toLocaleString("fr-FR")}
                              </span>
                            ) : (
                              <span className="text-stone-600 italic">Jamais connecté</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-amber-400">
                              {cust.order_count} commande{cust.order_count > 1 ? "s" : ""}
                            </div>
                            {cust.total_spent_cents > 0 && (
                              <span className="text-[11px] text-emerald-400 block">
                                {formatPrice(cust.total_spent_cents)}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedCustomerInfo(cust)
                                  setCopiedId(false)
                                }}
                                title="Informations de connexion du client"
                                aria-label={`Informations de connexion de ${cust.email}`}
                                className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 border border-amber-500/30 transition-colors shrink-0"
                              >
                                <Info className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setCustomerToDelete(cust)}
                                className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 px-3 py-1.5 rounded-lg transition-colors min-h-[36px]"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Supprimer</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= ONGLET PRODUITS (GESTION COMPLÈTE) ================= */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-stone-100">
                  Catalogue Produits &amp; Stocks ({filteredProducts.length})
                </h2>
                <p className="text-xs text-stone-400">
                  Modifiez les photos, les descriptions, les prix et les spécifications techniques.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filtrer un produit..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full bg-[#1c1917] border border-stone-800 focus:border-amber-500 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-200 outline-none min-h-[40px]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setIsCreatingProduct(true)}
                  className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider transition-all shadow-md shrink-0 active:scale-95 min-h-[40px]"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Nouveau Produit</span>
                </button>
              </div>
            </div>

            {/* Filtre par catégorie de produit */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap min-h-[36px] ${
                    selectedCategory === cat.id
                      ? "bg-amber-500 text-stone-950 font-black"
                      : "bg-[#1c1917] border border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Grille des Produits */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className={`bg-[#1c1917] border rounded-2xl overflow-hidden flex flex-col justify-between transition-all ${
                    p.is_active ? "border-stone-800 hover:border-amber-500/40" : "border-stone-800/60 opacity-60"
                  }`}
                >
                  <div>
                    {/* Image Produit */}
                    <div className="relative aspect-[16/10] w-full bg-stone-950 border-b border-stone-800">
                      <Image
                        src={p.image_url}
                        alt={p.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="text-[10px] bg-stone-950/90 text-stone-300 font-bold px-2 py-0.5 rounded border border-stone-800 backdrop-blur-sm uppercase">
                          {p.category.replace("_", " ")}
                        </span>
                        {p.badge && (
                          <span className="text-[10px] bg-amber-500 text-stone-950 font-black px-2 py-0.5 rounded uppercase">
                            {p.badge}
                          </span>
                        )}
                      </div>

                      <div className="absolute top-2.5 right-2.5">
                        <button
                          type="button"
                          onClick={() => handleToggleProductStatus(p)}
                          className={`p-1.5 rounded-lg text-xs font-bold transition-colors backdrop-blur-md flex items-center gap-1 border ${
                            p.is_active
                              ? "bg-emerald-950/80 text-emerald-400 border-emerald-800/60 hover:bg-rose-950/80 hover:text-rose-400 hover:border-rose-800"
                              : "bg-stone-900/90 text-stone-500 border-stone-800 hover:bg-emerald-950/80 hover:text-emerald-400"
                          }`}
                          title={p.is_active ? "Désactiver ce produit" : "Activer ce produit"}
                        >
                          {p.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          <span className="text-[10px] font-bold">{p.is_active ? "En ligne" : "Masqué"}</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <h3 className="font-bold text-stone-100 text-sm leading-snug line-clamp-2">
                        {p.name}
                      </h3>
                      <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed">
                        {p.short_description || p.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
                        {p.wood_length_cm && (
                          <span className="bg-stone-900 text-stone-300 border border-stone-800 px-2 py-0.5 rounded font-mono">
                            {p.wood_length_cm} cm
                          </span>
                        )}
                        {p.volume_stere && (
                          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-bold">
                            {p.volume_stere} Stères
                          </span>
                        )}
                        {p.weight_kg && (
                          <span className="bg-stone-900 text-stone-400 border border-stone-800 px-2 py-0.5 rounded">
                            {p.weight_kg} kg
                          </span>
                        )}
                        {p.humidity_rate && (
                          <span className="bg-stone-900 text-sky-400 border border-stone-800 px-2 py-0.5 rounded">
                            &lt; {p.humidity_rate}% hum.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Prix & Bouton Édition */}
                  <div className="p-4 pt-0">
                    <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-500 block">Prix Livré</span>
                        <div className="text-lg font-black text-amber-500 font-mono">
                          {formatPrice(p.unit_price_cents)}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct(p)
                          setProductFeedback(null)
                        }}
                        className="inline-flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-stone-200 hover:text-amber-400 border border-stone-800 hover:border-amber-500/40 text-xs font-bold px-3 py-2 rounded-xl transition-all min-h-[38px]"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-amber-500" />
                        <span>Modifier</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ================= MODALE INFORMATIONS DE CONNEXION CLIENT ================= */}
      {selectedCustomerInfo && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setSelectedCustomerInfo(null)}
        >
          <div
            className="bg-[#1c1917] border border-stone-800 rounded-t-3xl sm:rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-5 sm:zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* En-tête */}
            <div className="p-5 border-b border-stone-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-stone-100 text-base truncate">
                    Informations de Connexion Client
                  </h3>
                  <p className="text-xs text-amber-400 font-semibold truncate">
                    {selectedCustomerInfo.email}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCustomerInfo(null)}
                className="text-stone-400 hover:text-white p-2 rounded-lg hover:bg-stone-900 min-w-[40px] min-h-[40px] flex items-center justify-center shrink-0"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenu scrollable */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
              {/* Identité & Statut Compte */}
              <div className="bg-stone-900/70 border border-stone-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-stone-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Identité &amp; Authentification
                  </span>
                  {selectedCustomerInfo.email_confirmed_at ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded uppercase">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Email vérifié</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded uppercase">
                      <Clock className="w-3 h-3" />
                      <span>Vérification en attente</span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase font-bold block">Nom complet</span>
                    <span className="text-stone-200 font-bold">
                      {selectedCustomerInfo.full_name || "Non renseigné"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase font-bold block">Téléphone</span>
                    <span className="text-stone-200 font-semibold">
                      {selectedCustomerInfo.phone || "Non renseigné"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase font-bold block">Méthode d&apos;accès</span>
                    <span className="text-stone-200 font-semibold uppercase">
                      {selectedCustomerInfo.auth_providers.join(", ")}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase font-bold block">Date d&apos;inscription</span>
                    <span className="text-stone-300">
                      {new Date(selectedCustomerInfo.created_at).toLocaleString("fr-FR")}
                    </span>
                  </div>
                </div>

                {/* UUID complet + Copier */}
                <div className="pt-2 border-t border-stone-800 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] text-stone-500 uppercase font-bold block">Identifiant UUID Supabase</span>
                    <span className="font-mono text-[11px] text-stone-300 break-all">
                      {selectedCustomerInfo.id}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedCustomerInfo.id)
                      setCopiedId(true)
                      setTimeout(() => setCopiedId(false), 2000)
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-950 border border-stone-800 hover:border-amber-500/40 text-stone-300 hover:text-amber-400 text-[11px] font-bold shrink-0 min-h-[34px]"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId ? "Copié" : "Copier"}</span>
                  </button>
                </div>
              </div>

              {/* Connexion, IP & Appareil */}
              <div className="bg-stone-900/70 border border-stone-800 rounded-xl p-4 space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 pb-2 border-b border-stone-800 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-amber-500" />
                  <span>Dernière Connexion &amp; Réseau</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase font-bold block">Dernière authentification</span>
                    <span className="text-stone-200 font-semibold">
                      {selectedCustomerInfo.last_sign_in_at
                        ? new Date(selectedCustomerInfo.last_sign_in_at).toLocaleString("fr-FR")
                        : "Jamais connecté"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase font-bold block">Dernière adresse IP</span>
                    <span className="font-mono text-amber-400 font-bold">
                      {selectedCustomerInfo.last_ip || "Non enregistrée"}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-bold block mb-1">
                    Appareil &amp; Navigateur détecté
                  </span>
                  <div className="flex items-center gap-2 text-stone-200 font-semibold">
                    <Monitor className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{formatUserAgent(selectedCustomerInfo.last_user_agent)}</span>
                  </div>
                  {selectedCustomerInfo.last_user_agent && (
                    <p className="text-[10px] text-stone-500 font-mono mt-1 break-all bg-stone-950 p-2 rounded-lg border border-stone-800/80">
                      {selectedCustomerInfo.last_user_agent}
                    </p>
                  )}
                </div>
              </div>

              {/* Historique des Sessions */}
              <div className="bg-stone-900/70 border border-stone-800 rounded-xl p-4 space-y-2.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 pb-2 border-b border-stone-800 flex items-center justify-between">
                  <span>Sessions enregistrées ({selectedCustomerInfo.sessions.length})</span>
                </div>

                {selectedCustomerInfo.sessions.length === 0 ? (
                  <p className="text-stone-500 italic text-[11px]">
                    Aucune session active ou récente trouvée dans l&apos;historique.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {selectedCustomerInfo.sessions.map((sess, idx) => (
                      <div
                        key={idx}
                        className="bg-stone-950/80 border border-stone-800/80 rounded-lg p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[11px]"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="font-mono font-bold text-amber-400">
                            IP : {sess.ip || "N/A"}
                          </div>
                          <div className="text-stone-300 truncate">
                            {formatUserAgent(sess.user_agent)}
                          </div>
                        </div>
                        <div className="text-stone-500 sm:text-right shrink-0 text-[10px]">
                          <div>Ouverte : {new Date(sess.created_at).toLocaleString("fr-FR")}</div>
                          <div>Activité : {new Date(sess.updated_at).toLocaleString("fr-FR")}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Adresse enregistrée & Commandes */}
              {selectedCustomerInfo.shipping_address && (
                <div className="bg-stone-900/70 border border-stone-800 rounded-xl p-4 space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    <span>Adresse de livraison enregistrée</span>
                  </div>
                  <p className="text-stone-300 text-xs">
                    {selectedCustomerInfo.shipping_address.street || ""}{" "}
                    {selectedCustomerInfo.shipping_address.postal_code || ""}{" "}
                    {selectedCustomerInfo.shipping_address.city || ""}
                  </p>
                </div>
              )}
            </div>

            {/* Pied de modale */}
            <div className="p-4 border-t border-stone-800 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              {selectedCustomerInfo.order_count > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const email = selectedCustomerInfo.email
                    setSelectedCustomerInfo(null)
                    setOrderFilter("all")
                    setOrderSearch(email)
                    setActiveTab("orders")
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs uppercase tracking-wider min-h-[42px]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Voir ses {selectedCustomerInfo.order_count} commande(s)</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedCustomerInfo(null)}
                className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 font-bold text-xs border border-stone-800 min-h-[42px] sm:ml-auto"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODALE SUPPRESSION CLIENT ================= */}
      {customerToDelete && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-stone-100 text-base">
                Confirmer la suppression du client
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Êtes-vous sûr de vouloir supprimer définitivement le compte client{" "}
                <strong className="text-stone-200">{customerToDelete.email}</strong> ?
                Cette action supprimera ses accès de connexion et son profil.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCustomerToDelete(null)}
                className="w-full bg-stone-900 hover:bg-stone-800 text-stone-300 font-bold text-xs py-2.5 rounded-xl border border-stone-800 transition-colors min-h-[40px]"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={handleDeleteCustomerConfirm}
                disabled={customerDeleteLoading}
                className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 min-h-[40px] disabled:opacity-50"
              >
                {customerDeleteLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>Supprimer</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TIROIR MODIFICATION PRODUIT ================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#1c1917] border border-stone-800 rounded-t-3xl sm:rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-5">
            {/* Entête du tiroir */}
            <div className="p-5 border-b border-stone-800 flex items-center justify-between">
              <div>
                <h3 className="font-black text-stone-100 text-base">Modifier le Produit</h3>
                <p className="text-xs text-stone-400 font-mono">{editingProduct.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="text-stone-400 hover:text-white p-2 rounded-lg hover:bg-stone-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulaire scrollable */}
            <form onSubmit={handleSaveProduct} className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
              {productFeedback && (
                <div
                  className={`p-3 rounded-xl border font-bold text-xs flex items-center gap-2 ${
                    productFeedback.type === "success"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                      : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{productFeedback.message}</span>
                </div>
              )}

              {/* Titre & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-300 uppercase tracking-wider text-[10px]">
                    Nom du Produit *
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingProduct.name}
                    required
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl px-3 py-2 text-stone-100 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-300 uppercase tracking-wider text-[10px]">
                    Slug URL *
                  </label>
                  <input
                    type="text"
                    name="slug"
                    defaultValue={editingProduct.slug}
                    required
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl px-3 py-2 text-stone-100 outline-none font-mono"
                  />
                </div>
              </div>

              {/* Photo & Prévisualisation */}
              <div className="space-y-2">
                <label className="font-bold text-stone-300 uppercase tracking-wider text-[10px] flex items-center justify-between">
                  <span>Photo du Produit (URL ou chemin local) *</span>
                </label>
                <input
                  type="text"
                  name="image_url"
                  id="edit_image_url"
                  defaultValue={editingProduct.image_url}
                  required
                  className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl px-3 py-2 text-stone-100 outline-none font-mono"
                />

                {/* Galerie rapide de photos scierie */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] text-stone-400 font-semibold block">
                    Ou choisissez une photo réelle de la scierie :
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {AVAILABLE_GALLERY_PHOTOS.map((pic, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          const el = document.getElementById("edit_image_url") as HTMLInputElement
                          if (el) el.value = pic.url
                        }}
                        className="px-2.5 py-1 rounded bg-stone-900 border border-stone-800 hover:border-amber-500 text-[10px] text-stone-300 whitespace-nowrap min-h-[30px]"
                      >
                        {pic.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Catégorie & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-300 uppercase tracking-wider text-[10px]">
                    Catégorie *
                  </label>
                  <select
                    name="category"
                    defaultValue={editingProduct.category}
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl px-3 py-2 text-stone-100 outline-none"
                  >
                    {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-300 uppercase tracking-wider text-[10px]">
                    Badge Spécial (Promo / Exclusif)
                  </label>
                  <input
                    type="text"
                    name="badge"
                    defaultValue={editingProduct.badge || ""}
                    placeholder="Ex: NOUVEAUTÉ, MEILLEURE VENTE..."
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl px-3 py-2 text-stone-100 outline-none"
                  />
                </div>
              </div>

              {/* Prix (€) & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-amber-400 uppercase tracking-wider text-[10px]">
                    Prix TTC livré (€) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="unit_price_euros"
                    defaultValue={(editingProduct.unit_price_cents / 100).toFixed(2)}
                    required
                    className="w-full bg-stone-950 border border-amber-500/50 focus:border-amber-400 rounded-xl px-3 py-2 text-amber-400 font-black text-sm outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-300 uppercase tracking-wider text-[10px]">
                    Quantité en Stock *
                  </label>
                  <input
                    type="number"
                    name="stock_quantity"
                    defaultValue={editingProduct.stock_quantity}
                    required
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl px-3 py-2 text-stone-100 outline-none font-bold"
                  />
                </div>
              </div>

              {/* Description courte & longue */}
              <div className="space-y-1">
                <label className="font-bold text-stone-300 uppercase tracking-wider text-[10px]">
                  Description Courte
                </label>
                <textarea
                  name="short_description"
                  rows={2}
                  defaultValue={editingProduct.short_description || ""}
                  className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl px-3 py-2 text-stone-100 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-300 uppercase tracking-wider text-[10px]">
                  Description Complète
                </label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingProduct.description || ""}
                  className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl px-3 py-2 text-stone-100 outline-none"
                />
              </div>

              {/* Spécifications techniques */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div className="space-y-1">
                  <label className="font-bold text-stone-400 text-[10px] uppercase block">
                    Bûches (cm)
                  </label>
                  <input
                    type="number"
                    name="wood_length_cm"
                    defaultValue={editingProduct.wood_length_cm || ""}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-2.5 py-1.5 text-stone-200 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-stone-400 text-[10px] uppercase block">
                    Stères
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="volume_stere"
                    defaultValue={editingProduct.volume_stere || ""}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-2.5 py-1.5 text-stone-200 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-stone-400 text-[10px] uppercase block">
                    Poids (kg)
                  </label>
                  <input
                    type="number"
                    name="weight_kg"
                    defaultValue={editingProduct.weight_kg || ""}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-2.5 py-1.5 text-stone-200 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-stone-400 text-[10px] uppercase block">
                    Humidité (%)
                  </label>
                  <input
                    type="number"
                    name="humidity_rate"
                    defaultValue={editingProduct.humidity_rate || ""}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-2.5 py-1.5 text-stone-200 outline-none"
                  />
                </div>
              </div>

              {/* Essences */}
              <div className="space-y-1">
                <label className="font-bold text-stone-300 uppercase tracking-wider text-[10px]">
                  Essences / Matériaux (séparés par des virgules)
                </label>
                <input
                  type="text"
                  name="species"
                  defaultValue={editingProduct.species ? editingProduct.species.join(", ") : ""}
                  placeholder="Ex: Chêne, Charme, Hêtre"
                  className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl px-3 py-2 text-stone-100 outline-none"
                />
              </div>

              {/* Interrupteur Actif */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  name="is_active"
                  id="edit_is_active"
                  defaultChecked={editingProduct.is_active}
                  className="w-4 h-4 rounded border-stone-700 text-amber-500 focus:ring-0"
                />
                <label htmlFor="edit_is_active" className="font-bold text-stone-200 text-xs cursor-pointer">
                  Produit Actif et visible immédiatement sur la boutique
                </label>
              </div>

              {/* Bouton Enregistrer */}
              <div className="pt-4 border-t border-stone-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 font-bold hover:bg-stone-800 min-h-[40px]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={productFormLoading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black uppercase tracking-wider shadow-md active:scale-95 disabled:opacity-50 min-h-[40px]"
                >
                  {productFormLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Enregistrer les modifications</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= TIROIR CRÉATION NOUVEAU PRODUIT ================= */}
      {isCreatingProduct && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#1c1917] border border-stone-800 rounded-t-3xl sm:rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-5">
            <div className="p-5 border-b border-stone-800 flex items-center justify-between">
              <div>
                <h3 className="font-black text-stone-100 text-base">Ajouter un Nouveau Produit</h3>
                <p className="text-xs text-stone-400">Création et synchronisation immédiate en base de données</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreatingProduct(false)}
                className="text-stone-400 hover:text-white p-2 rounded-lg hover:bg-stone-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
              {productFeedback && (
                <div
                  className={`p-3 rounded-xl border font-bold text-xs flex items-center gap-2 ${
                    productFeedback.type === "success"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                      : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{productFeedback.message}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-300 uppercase tracking-wider text-[10px]">
                    Nom du Produit *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Ex: Chêne Séché sous Hangar 33cm"
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl px-3 py-2 text-stone-100 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-300 uppercase tracking-wider text-[10px]">
                    Slug URL *
                  </label>
                  <input
                    type="text"
                    name="slug"
                    required
                    placeholder="chene-seche-hangar-33cm"
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl px-3 py-2 text-stone-100 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-stone-300 uppercase tracking-wider text-[10px]">
                  Photo du Produit (URL ou chemin local) *
                </label>
                <input
                  type="text"
                  name="image_url"
                  id="create_image_url"
                  required
                  defaultValue="/images/products/chene-charme-33cm.jpg"
                  className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl px-3 py-2 text-stone-100 outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-300 uppercase tracking-wider text-[10px]">
                    Catégorie *
                  </label>
                  <select
                    name="category"
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl px-3 py-2 text-stone-100 outline-none"
                  >
                    {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-amber-400 uppercase tracking-wider text-[10px]">
                    Prix TTC livré (€) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="unit_price_euros"
                    required
                    placeholder="289.00"
                    className="w-full bg-stone-950 border border-amber-500/50 focus:border-amber-400 rounded-xl px-3 py-2 text-amber-400 font-black text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div className="space-y-1">
                  <label className="font-bold text-stone-400 text-[10px] uppercase block">
                    Stock Initial *
                  </label>
                  <input
                    type="number"
                    name="stock_quantity"
                    defaultValue="25"
                    required
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-2.5 py-1.5 text-stone-200 outline-none font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-stone-400 text-[10px] uppercase block">
                    Bûches (cm)
                  </label>
                  <input
                    type="number"
                    name="wood_length_cm"
                    defaultValue="33"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-2.5 py-1.5 text-stone-200 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-stone-400 text-[10px] uppercase block">
                    Stères
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="volume_stere"
                    defaultValue="2"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-2.5 py-1.5 text-stone-200 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-stone-400 text-[10px] uppercase block">
                    Humidité (%)
                  </label>
                  <input
                    type="number"
                    name="humidity_rate"
                    defaultValue="18"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-2.5 py-1.5 text-stone-200 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-300 uppercase tracking-wider text-[10px]">
                  Description Courte
                </label>
                <textarea
                  name="short_description"
                  rows={2}
                  placeholder="Bref résumé accrocheur..."
                  className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl px-3 py-2 text-stone-100 outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  name="is_active"
                  id="create_is_active"
                  defaultChecked={true}
                  className="w-4 h-4 rounded border-stone-700 text-amber-500"
                />
                <label htmlFor="create_is_active" className="font-bold text-stone-200 text-xs cursor-pointer">
                  Publier immédiatement le produit sur le site
                </label>
              </div>

              <div className="pt-4 border-t border-stone-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingProduct(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 font-bold hover:bg-stone-800 min-h-[40px]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={productFormLoading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black uppercase tracking-wider shadow-md active:scale-95 disabled:opacity-50 min-h-[40px]"
                >
                  {productFormLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 stroke-[3]" />}
                  <span>Créer le produit</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
