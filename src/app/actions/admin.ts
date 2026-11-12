"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import type { Product } from "@/lib/supabase/database.types"

// ================= SCHÉMAS DE VALIDATION ZOD STRICTS =================
const productUpdateSchema = z.object({
  id: z.string().uuid("Identifiant produit invalide"),
  name: z.string().min(3, "Le nom du produit doit contenir au moins 3 caractères"),
  slug: z.string().min(3, "Le slug doit contenir au moins 3 caractères"),
  short_description: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  category: z.enum([
    "bois_buches",
    "granules_pellets",
    "buches_compressees",
    "allumage",
    "charbon_bois",
    "poeles",
  ]),
  species: z.array(z.string()).nullable().optional(),
  humidity_rate: z.number().nullable().optional(),
  wood_length_cm: z.number().nullable().optional(),
  packaging: z.string().default("palette"),
  volume_stere: z.number().nullable().optional(),
  weight_kg: z.number().nullable().optional(),
  unit_price_cents: z.number().int().positive("Le prix doit être supérieur à zéro"),
  stock_quantity: z.number().int().min(0, "La quantité en stock doit être positive ou nulle"),
  image_url: z.string().min(1, "L'URL ou chemin de l'image est requis"),
  badge: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
})

export type ProductUpdateInput = z.infer<typeof productUpdateSchema>

const productCreateSchema = productUpdateSchema.omit({ id: true })
export type ProductCreateInput = z.infer<typeof productCreateSchema>

// ================= VÉRIFICATION DE SESSION ADMINISTRATEUR =================
export async function verifyAdminSession() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { isAdmin: false, user: null }
  }

  // Vérification de rôle par email privilégié ou par métadonnée / table profiles
  if (user.email === "admin@lena-directa.company" || user.user_metadata?.role === "admin") {
    return { isAdmin: true, user }
  }

  // Vérification via la table profiles (colonne is_admin)
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()

  if (profile?.is_admin === true) {
    return { isAdmin: true, user }
  }

  return { isAdmin: false, user }
}

// ================= LECTURE DE TOUS LES PRODUITS (ADMIN) =================
export async function getAdminProducts(): Promise<{ products: Product[] | null; error: string | null }> {
  const { isAdmin } = await verifyAdminSession()
  if (!isAdmin) {
    return { products: null, error: "Accès refusé. Veuillez vous connecter en tant qu'administrateur." }
  }

  try {
    const adminSupabase = createAdminClient()
    const { data: products, error } = await adminSupabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      return { products: null, error: error.message }
    }

    return { products: products || [], error: null }
  } catch (err: any) {
    return { products: null, error: err?.message || "Erreur lors de la récupération des produits" }
  }
}

// ================= MISE À JOUR D'UN PRODUIT =================
export async function updateProductAction(rawInput: ProductUpdateInput) {
  const { isAdmin } = await verifyAdminSession()
  if (!isAdmin) {
    return { error: "Accès non autorisé. Seul un administrateur peut modifier un produit." }
  }

  const parsed = productUpdateSchema.safeParse(rawInput)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || "Données de produit non valides"
    return { error: firstError }
  }

  const data = parsed.data
  try {
    const adminSupabase = createAdminClient()
    const { data: updatedProduct, error } = await adminSupabase
      .from("products")
      .update({
        name: data.name,
        slug: data.slug,
        short_description: data.short_description || null,
        description: data.description || null,
        category: data.category,
        species: data.species || null,
        humidity_rate: data.humidity_rate !== undefined ? data.humidity_rate : null,
        wood_length_cm: data.wood_length_cm !== undefined ? data.wood_length_cm : null,
        packaging: data.packaging,
        volume_stere: data.volume_stere !== undefined ? data.volume_stere : null,
        weight_kg: data.weight_kg !== undefined ? data.weight_kg : null,
        unit_price_cents: data.unit_price_cents,
        stock_quantity: data.stock_quantity,
        image_url: data.image_url,
        badge: data.badge || null,
        is_active: data.is_active,
      })
      .eq("id", data.id)
      .select()
      .single()

    if (error) {
      return { error: `Erreur Supabase: ${error.message}` }
    }

    // Invalidation intelligente de tout le cache produit
    revalidatePath("/", "layout")
    revalidatePath("/catalogue")
    revalidatePath(`/produit/${data.slug}`)
    revalidatePath("/bois-de-chauffage")
    revalidatePath("/bois-compresse")
    revalidatePath("/granules-de-bois")
    revalidatePath("/charbon-de-bois")
    revalidatePath("/poeles-a-bois")
    revalidatePath("/admin")

    return { success: true, product: updatedProduct }
  } catch (err: any) {
    return { error: err?.message || "Erreur interne lors de la mise à jour" }
  }
}

// ================= CRÉATION D'UN NOUVEAU PRODUIT =================
export async function createProductAction(rawInput: ProductCreateInput) {
  const { isAdmin } = await verifyAdminSession()
  if (!isAdmin) {
    return { error: "Accès non autorisé." }
  }

  const parsed = productCreateSchema.safeParse(rawInput)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || "Données invalides"
    return { error: firstError }
  }

  const data = parsed.data
  try {
    const adminSupabase = createAdminClient()
    const { data: newProduct, error } = await adminSupabase
      .from("products")
      .insert({
        name: data.name,
        slug: data.slug,
        short_description: data.short_description || null,
        description: data.description || null,
        category: data.category,
        species: data.species || null,
        humidity_rate: data.humidity_rate !== undefined ? data.humidity_rate : null,
        wood_length_cm: data.wood_length_cm !== undefined ? data.wood_length_cm : null,
        packaging: data.packaging,
        volume_stere: data.volume_stere !== undefined ? data.volume_stere : null,
        weight_kg: data.weight_kg !== undefined ? data.weight_kg : null,
        unit_price_cents: data.unit_price_cents,
        stock_quantity: data.stock_quantity,
        image_url: data.image_url,
        badge: data.badge || null,
        is_active: data.is_active,
      })
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/", "layout")
    revalidatePath("/catalogue")
    revalidatePath("/admin")

    return { success: true, product: newProduct }
  } catch (err: any) {
    return { error: err?.message || "Erreur lors de la création du produit" }
  }
}

// ================= BASCULEMENT RAPIDE STATUT EN LIGNE / HORS LIGNE =================
export async function toggleProductStatusAction(id: string, currentStatus: boolean) {
  const { isAdmin } = await verifyAdminSession()
  if (!isAdmin) {
    return { error: "Accès non autorisé." }
  }

  try {
    const adminSupabase = createAdminClient()
    const { error } = await adminSupabase
      .from("products")
      .update({ is_active: !currentStatus })
      .eq("id", id)

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/", "layout")
    revalidatePath("/catalogue")
    revalidatePath("/admin")

    return { success: true, newStatus: !currentStatus }
  } catch (err: any) {
    return { error: err?.message || "Erreur lors du changement de statut" }
  }
}

// ================= DONNÉES GLOBALES POUR LE TABLEAU DE BORD =================
export interface AdminCustomerSession {
  ip: string | null
  user_agent: string | null
  created_at: string
  updated_at: string
}

export interface AdminCustomer {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  created_at: string
  last_sign_in_at: string | null
  email_confirmed_at: string | null
  shipping_address: any
  order_count: number
  total_spent_cents: number
  is_admin: boolean
  auth_providers: string[]
  last_ip: string | null
  last_user_agent: string | null
  sessions: AdminCustomerSession[]
}

export interface AdminDashboardPayload {
  products: Product[]
  orders: any[]
  customers: AdminCustomer[]
  stats: {
    totalCustomers: number
    totalOrders: number
    pendingTransferCount: number
    totalRevenueCents: number
    activeDeliveriesCount: number
    totalProductsCount: number
  }
}

export async function getAdminDashboardData(): Promise<{ data: AdminDashboardPayload | null; error: string | null }> {
  const { isAdmin } = await verifyAdminSession()
  if (!isAdmin) {
    return { data: null, error: "Accès refusé. Veuillez vous connecter en tant qu'administrateur." }
  }

  try {
    const adminSupabase = createAdminClient()

    const [usersRes, profilesRes, ordersRes, productsRes, sessionsRes] = await Promise.all([
      adminSupabase.auth.admin.listUsers({ perPage: 1000 }),
      adminSupabase.from("profiles").select("*"),
      adminSupabase.from("orders").select("*").order("created_at", { ascending: false }),
      adminSupabase.from("products").select("*").order("created_at", { ascending: false }),
      (adminSupabase as any).rpc("admin_get_user_sessions").then(
        (res: any) => res,
        () => ({ data: [] })
      ),
    ])

    const authUsers = usersRes.data?.users || []
    const profiles = profilesRes.data || []
    const orders = ordersRes.data || []
    const products = productsRes.data || []
    const allSessions: Array<{
      user_id: string
      ip: string | null
      user_agent: string | null
      created_at: string
      updated_at: string
    }> = sessionsRes?.data || []

    // Regroupement des sessions par user_id
    const sessionsByUser = new Map<string, AdminCustomerSession[]>()
    for (const s of allSessions) {
      if (!s.user_id) continue
      const list = sessionsByUser.get(s.user_id) || []
      list.push({
        ip: s.ip,
        user_agent: s.user_agent,
        created_at: s.created_at,
        updated_at: s.updated_at,
      })
      sessionsByUser.set(s.user_id, list)
    }

    // Fusion des informations clients
    const customersMap = new Map<string, AdminCustomer>()

    for (const u of authUsers) {
      if (u.email === "admin@lena-directa.company") continue // On ne liste pas le compte admin suprême dans les clients

      const userSessions = sessionsByUser.get(u.id) || []
      const browserSession = userSessions.find((s) => s.user_agent && s.user_agent !== "node") || userSessions[0]
      const providers = Array.isArray(u.app_metadata?.providers)
        ? u.app_metadata.providers
        : u.app_metadata?.provider
        ? [u.app_metadata.provider]
        : ["email"]

      customersMap.set(u.id, {
        id: u.id,
        email: u.email || "",
        full_name: u.user_metadata?.full_name || null,
        phone: u.phone || u.user_metadata?.phone || null,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at || null,
        email_confirmed_at: u.email_confirmed_at || null,
        shipping_address: null,
        order_count: 0,
        total_spent_cents: 0,
        is_admin: false,
        auth_providers: providers,
        last_ip: browserSession?.ip || null,
        last_user_agent: browserSession?.user_agent || null,
        sessions: userSessions,
      })
    }

    for (const p of profiles) {
      if (p.email === "admin@lena-directa.company" || p.is_admin) continue

      const existing = customersMap.get(p.id)
      if (existing) {
        existing.full_name = p.full_name || existing.full_name
        existing.phone = p.phone || existing.phone
        existing.shipping_address = p.shipping_address
        existing.is_admin = Boolean(p.is_admin)
      } else {
        const userSessions = sessionsByUser.get(p.id) || []
        const browserSession = userSessions.find((s) => s.user_agent && s.user_agent !== "node") || userSessions[0]
        customersMap.set(p.id, {
          id: p.id,
          email: p.email,
          full_name: p.full_name,
          phone: p.phone,
          created_at: p.created_at,
          last_sign_in_at: null,
          email_confirmed_at: null,
          shipping_address: p.shipping_address,
          order_count: 0,
          total_spent_cents: 0,
          is_admin: Boolean(p.is_admin),
          auth_providers: ["email"],
          last_ip: browserSession?.ip || null,
          last_user_agent: browserSession?.user_agent || null,
          sessions: userSessions,
        })
      }
    }

    // Calcul des statistiques de commandes par client
    for (const ord of orders) {
      let cust = ord.user_id ? customersMap.get(ord.user_id) : undefined
      if (!cust && ord.customer_email) {
        cust = Array.from(customersMap.values()).find(
          (c) => c.email.toLowerCase() === ord.customer_email.toLowerCase()
        )
      }
      if (cust) {
        cust.order_count += 1
        if (ord.payment_status === "paid" || ord.status === "paid" || ord.status === "delivered") {
          cust.total_spent_cents += ord.total_cents
        }
      }
    }

    const customers = Array.from(customersMap.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    // Calcul des métriques globales
    let totalRevenueCents = 0
    let pendingTransferCount = 0
    let activeDeliveriesCount = 0

    for (const ord of orders) {
      if (ord.payment_status === "transfer_notified" || ord.status === "payment_notified") {
        pendingTransferCount += 1
      }
      if (ord.payment_status === "paid" || ord.status === "paid" || ord.status === "delivered") {
        totalRevenueCents += ord.total_cents
      }
      if (ord.status === "preparing" || ord.status === "out_for_delivery") {
        activeDeliveriesCount += 1
      }
    }

    return {
      data: {
        products,
        orders,
        customers,
        stats: {
          totalCustomers: customers.length,
          totalOrders: orders.length,
          pendingTransferCount,
          totalRevenueCents,
          activeDeliveriesCount,
          totalProductsCount: products.length,
        },
      },
      error: null,
    }
  } catch (err: any) {
    console.error("getAdminDashboardData error:", err)
    return { data: null, error: err?.message || "Erreur de chargement du tableau de bord" }
  }
}

// ================= VALIDATION DU PAIEMENT D'UN VIREMENT =================
export async function confirmOrderPaymentAction(orderId: string) {
  const { isAdmin } = await verifyAdminSession()
  if (!isAdmin) {
    return { error: "Accès non autorisé." }
  }

  try {
    const adminSupabase = createAdminClient()

    const { data: ord, error: fetchErr } = await adminSupabase
      .from("orders")
      .select("admin_notes, status")
      .eq("id", orderId)
      .single()

    if (fetchErr || !ord) {
      return { error: "Commande introuvable" }
    }

    const newNote = ((ord.admin_notes || "") + `\n✓ Virement constaté & paiement validé par l'admin le ${new Date().toLocaleString("fr-FR")}`).trim()

    const { error: updateErr } = await adminSupabase
      .from("orders")
      .update({
        payment_status: "paid",
        status: "paid",
        admin_notes: newNote,
      })
      .eq("id", orderId)

    if (updateErr) {
      return { error: updateErr.message }
    }

    revalidatePath("/admin")
    revalidatePath("/mon-compte")
    revalidatePath(`/confirmation/${orderId}`)

    return { success: true }
  } catch (err: any) {
    return { error: err?.message || "Erreur lors de la validation du paiement" }
  }
}

// ================= MISE À JOUR DU STATUT D'UNE COMMANDE =================
export async function updateOrderStatusAction(orderId: string, newStatus: string, note?: string) {
  const { isAdmin } = await verifyAdminSession()
  if (!isAdmin) {
    return { error: "Accès non autorisé." }
  }

  try {
    const adminSupabase = createAdminClient()

    const { data: ord, error: fetchErr } = await adminSupabase
      .from("orders")
      .select("admin_notes")
      .eq("id", orderId)
      .single()

    if (fetchErr || !ord) {
      return { error: "Commande introuvable" }
    }

    let updatedNote = ord.admin_notes || ""
    if (note && note.trim()) {
      updatedNote = (updatedNote + `\n[${new Date().toLocaleDateString("fr-FR")}] Statut changé en ${newStatus} : ${note.trim()}`).trim()
    }

    const { error: updateErr } = await adminSupabase
      .from("orders")
      .update({
        status: newStatus,
        admin_notes: updatedNote,
      })
      .eq("id", orderId)

    if (updateErr) {
      return { error: updateErr.message }
    }

    revalidatePath("/admin")
    revalidatePath("/mon-compte")
    revalidatePath(`/confirmation/${orderId}`)

    return { success: true }
  } catch (err: any) {
    return { error: err?.message || "Erreur de mise à jour du statut" }
  }
}

// ================= SUPPRESSION D'UN CLIENT (AUTH & PROFIL) =================
export async function deleteCustomerAction(customerId: string) {
  const { isAdmin } = await verifyAdminSession()
  if (!isAdmin) {
    return { error: "Accès non autorisé." }
  }

  try {
    const adminSupabase = createAdminClient()

    // Vérifier que le compte à supprimer n'est pas l'admin
    const { data: targetUser } = await adminSupabase.auth.admin.getUserById(customerId)
    if (targetUser?.user?.email === "admin@lena-directa.company") {
      return { error: "Impossible de supprimer le compte administrateur principal." }
    }

    // 1. Supprimer le profil
    await adminSupabase.from("profiles").delete().eq("id", customerId)

    // 2. Supprimer l'utilisateur de Supabase Auth
    const { error: deleteAuthErr } = await adminSupabase.auth.admin.deleteUser(customerId)
    if (deleteAuthErr) {
      return { error: `Erreur Auth: ${deleteAuthErr.message}` }
    }

    revalidatePath("/admin")
    return { success: true }
  } catch (err: any) {
    return { error: err?.message || "Erreur lors de la suppression du client" }
  }
}

// ================= SUPPRESSION D'UNE COMMANDE =================
export async function deleteOrderAction(orderId: string) {
  const { isAdmin } = await verifyAdminSession()
  if (!isAdmin) {
    return { error: "Accès non autorisé." }
  }

  try {
    const adminSupabase = createAdminClient()
    const { error } = await adminSupabase.from("orders").delete().eq("id", orderId)
    if (error) {
      return { error: error.message }
    }

    revalidatePath("/admin")
    return { success: true }
  } catch (err: any) {
    return { error: err?.message || "Erreur lors de la suppression de la commande" }
  }
}
