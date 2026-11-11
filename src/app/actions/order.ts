"use server"

import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { LOCAL_PRODUCTS } from "@/lib/products"
import type { Product } from "@/lib/supabase/database.types"

// Schéma de validation Zod strict pour la création de commande
const createOrderSchema = z.object({
  customerName: z.string().min(2, "Le nom complet est obligatoire"),
  customerEmail: z.string().email("Adresse email invalide"),
  customerPhone: z
    .string()
    .min(10, "Numéro de téléphone mobile obligatoire pour la prise de RDV transporteur"),
  streetAddress: z.string().min(5, "L'adresse de livraison est obligatoire"),
  postalCode: z.string().min(4, "Code postal obligatoire"),
  city: z.string().min(2, "La ville est obligatoire"),
  deliveryNotes: z.string().optional(),
  fulfillmentMethod: z.enum(["delivery", "drive"]),
  preferredWeek: z.string().optional(),
  preferredTimeSlot: z.enum(["morning", "afternoon", "flexible"]).default("flexible"),
  paymentMethod: z.enum(["card", "deposit", "transfer"]),
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().positive(),
    })
  ).min(1, "Votre panier est vide"),
  promoCode: z.string().nullable().optional(),
  accessDiagnostic: z
    .object({
      truckAccess: z.enum(["ok", "narrow", "tight"]),
      groundType: z.enum(["asphalt", "concrete", "gravel", "lawn"]),
      heightClearance: z.enum(["ok", "low"]),
      turnaroundArea: z.enum(["yes", "no"]),
      slope: z.enum(["flat", "moderate", "steep"]),
      deliveryEngin: z.enum(["standard_19t", "all_terrain_forklift", "tailgate_truck"]),
      confirmed: z.boolean(),
    })
    .optional()
    .nullable(),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>

export async function createOrder(input: CreateOrderInput) {
  try {
    // 1. Validation Zod du payload
    const parsed = createOrderSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues.map((i) => i.message).join(", "),
      }
    }

    const {
      customerName,
      customerEmail,
      customerPhone,
      streetAddress,
      postalCode,
      city,
      deliveryNotes,
      fulfillmentMethod,
      preferredWeek,
      preferredTimeSlot,
      paymentMethod,
      items: rawItems,
      promoCode,
      accessDiagnostic,
    } = parsed.data

    const supabase = await createClient()

    // Récupération de l'utilisateur connecté si présent
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    const currentUserId = authUser?.id || null

    // Interdiction stricte aux comptes administrateurs de passer commande
    if (authUser?.email === "admin@lena-directa.company" || authUser?.user_metadata?.role === "admin") {
      return {
        success: false,
        error: "Compte Administrateur : Vous ne pouvez pas passer de commande avec un compte administrateur. Accédez à votre tableau de bord pour gérer les produits, clients et commandes.",
      }
    }

    // 2. Vérification des prix côté serveur d'après la base Supabase et le catalogue scierie
    const productIds = rawItems.map((i) => i.productId)
    let dbProducts: Product[] = []
    try {
      const { data, error: prodErr } = await supabase
        .from("products")
        .select("*")
        .in("id", productIds)

      if (data && !prodErr) {
        dbProducts = [...data]
      }
    } catch (e) {
      console.warn("Erreur fetch DB products:", e)
    }

    // Compléter avec le catalogue local si certains produits (ex: charbon) ne sont pas encore insérés en DB
    for (const pid of productIds) {
      if (!dbProducts.some((p) => p.id === pid)) {
        const local = LOCAL_PRODUCTS.find((p) => p.id === pid)
        if (local) {
          dbProducts.push(local)
        }
      }
    }

    if (dbProducts.length === 0) {
      return { success: false, error: "Impossible de récupérer les articles commandés." }
    }

    // Calcul du sous-total
    let subtotalCents = 0
    let totalUnits = 0
    const snapshotItems = []

    for (const rawItem of rawItems) {
      const prod = dbProducts.find((p) => p.id === rawItem.productId)
      if (!prod) {
        return { success: false, error: `Produit introuvable (${rawItem.productId})` }
      }
      const lineTotal = prod.unit_price_cents * rawItem.quantity
      subtotalCents += lineTotal
      totalUnits += rawItem.quantity

      snapshotItems.push({
        product_id: prod.id,
        name: prod.name,
        wood_species: prod.species ? prod.species.join(", ") : "Feuillus durs",
        log_length_cm: prod.wood_length_cm,
        packaging: prod.packaging,
        unit_price_cents: prod.unit_price_cents,
        quantity: rawItem.quantity,
        total_cents: lineTotal,
      })
    }

    // Calcul de la remise volume
    let volumeDiscountCents = 0
    if (totalUnits >= 3) {
      volumeDiscountCents = 6000 // -60 €
    } else if (totalUnits >= 2) {
      volumeDiscountCents = 2500 // -25 €
    }

    // Calcul de l'économie Drive
    let driveDiscountCents = 0
    if (fulfillmentMethod === "drive") {
      driveDiscountCents = totalUnits * 4000 // -40 € / palette
    }

    // Calcul des frais de port réels côté serveur
    let deliveryFeeCents = 0
    if (fulfillmentMethod === "delivery") {
      const prefix = postalCode.slice(0, 2)
      const { data: zone } = await supabase
        .from("delivery_zones")
        .select("*")
        .eq("postal_code_prefix", prefix)
        .single()

      if (zone && zone.is_deliverable) {
        if (
          zone.free_shipping_threshold_cents &&
          subtotalCents >= zone.free_shipping_threshold_cents
        ) {
          deliveryFeeCents = 0
        } else {
          deliveryFeeCents = zone.base_delivery_fee_cents
        }
      } else {
        // Frais forfaitaire standard si zone non listée
        deliveryFeeCents = 4900
      }
    }

    // Remise code promo serveur
    let promoDiscountCents = 0
    if (promoCode) {
      const clean = promoCode.trim().toUpperCase()
      if (clean === "LENA15" || clean === "BIENVENUE" || clean === "HIVER2026") {
        promoDiscountCents = 1500
      }
    }

    const totalCents = Math.max(
      0,
      subtotalCents -
        volumeDiscountCents -
        driveDiscountCents -
        promoDiscountCents +
        deliveryFeeCents
    )

    // 3. Génération du numéro de commande humain (ex: LD-2026-8K2Q)
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase()
    const orderNumber = `LD-2026-${randomHex}`

    // 4. Insertion dans la table `orders`
    const { data: createdOrder, error: insertErr } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: currentUserId,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        shipping_address: {
          street: streetAddress,
          postal_code: postalCode,
          city: city,
          delivery_notes: deliveryNotes || "",
          fulfillment_method: fulfillmentMethod,
          payment_method: paymentMethod,
          preferred_week: preferredWeek || "",
          preferred_time_slot: preferredTimeSlot,
        },
        access_constraints: accessDiagnostic || {
          truckAccess: "ok",
          groundType: "asphalt",
          heightClearance: "ok",
          turnaroundArea: "yes",
          slope: "flat",
          deliveryEngin: "standard_19t",
        },
        items: snapshotItems,
        subtotal_cents: subtotalCents,
        delivery_fee_cents: deliveryFeeCents,
        total_cents: totalCents,
        status: "pending",
        payment_method: paymentMethod,
        payment_status: "pending",
        delivery_slot: preferredTimeSlot,
      })
      .select("id, order_number")
      .single()

    if (insertErr || !createdOrder) {
      console.error("Order insertion error:", insertErr)
      return {
        success: false,
        error: "Erreur lors de l'enregistrement de votre commande. Veuillez réessayer.",
      }
    }

    return {
      success: true,
      orderId: createdOrder.id,
      orderNumber: createdOrder.order_number,
    }
  } catch (err: unknown) {
    console.error("Server error creating order:", err)
    return {
      success: false,
      error: "Une erreur inattendue est survenue lors du traitement.",
    }
  }
}

/**
 * Signale à l'administration que le client a effectué son virement bancaire
 */
export async function notifyTransferSent(orderId: string, reference?: string) {
  try {
    const supabase = await createClient()

    const { data: existing, error: fetchErr } = await supabase
      .from("orders")
      .select("id, status, payment_status, order_number, admin_notes")
      .eq("id", orderId)
      .single()

    if (fetchErr || !existing) {
      return { success: false, error: "Commande introuvable." }
    }

    const noteAppend = reference
      ? `\nVirement bancaire signalé par le client (Réf: ${reference.trim()}) le ${new Date().toLocaleString("fr-FR")}`
      : `\nVirement bancaire signalé par le client le ${new Date().toLocaleString("fr-FR")}`

    const updatedNotes = ((existing.admin_notes || "") + noteAppend).trim()

    const { error: updateErr } = await supabase
      .from("orders")
      .update({
        payment_status: "transfer_notified",
        status: "payment_notified",
        payment_notified_at: new Date().toISOString(),
        admin_notes: updatedNotes,
      })
      .eq("id", orderId)

    if (updateErr) {
      console.error("Error updating transfer notified status:", updateErr)
      return { success: false, error: "Erreur lors de la mise à jour du statut." }
    }

    const { revalidatePath } = await import("next/cache")
    revalidatePath("/admin")
    revalidatePath("/mon-compte")
    revalidatePath(`/confirmation/${orderId}`)

    return { success: true }
  } catch (err) {
    console.error("notifyTransferSent error:", err)
    return { success: false, error: "Erreur serveur lors de la notification." }
  }
}
