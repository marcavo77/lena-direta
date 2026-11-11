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
