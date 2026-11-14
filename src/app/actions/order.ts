"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { LOCAL_PRODUCTS } from "@/lib/products"
import { formatPrice } from "@/lib/utils"
import { sendOrderCreatedEmails, sendTransferNotifiedAdminEmail, sendSignupEmails } from "@/lib/email/mailer"
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
  accountPassword: z.string().min(6, "Le mot de passe doit comporter au moins 6 caractères").optional().nullable(),
  isExistingAccount: z.boolean().optional().default(false),
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
      accountPassword,
      isExistingAccount,
    } = parsed.data

    const supabase = await createClient()
    const adminSupabase = createAdminClient()

    // Récupération de l'utilisateur connecté si présent
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    // Interdiction stricte aux comptes administrateurs de passer commande
    if (authUser?.email === "admin@lena-directa.company" || authUser?.user_metadata?.role === "admin") {
      return {
        success: false,
        error: "Compte Administrateur : Vous ne pouvez pas passer de commande avec un compte administrateur. Accédez à votre tableau de bord pour gérer les produits, clients et commandes.",
      }
    }

    let activeUserId = authUser?.id || null
    const cleanEmail = customerEmail.trim().toLowerCase()

    // Si aucun utilisateur n'est connecté, la création ou connexion au compte est OBLIGATOIRE à l'étape règlement
    if (!authUser) {
      if (!accountPassword || accountPassword.length < 6) {
        return {
          success: false,
          requiresAccount: true,
          error: "Veuillez définir un mot de passe (au moins 6 caractères) pour créer votre compte client et valider votre commande.",
        }
      }

      if (isExistingAccount) {
        // Mode connexion compte existant
        const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: accountPassword,
        })

        if (signInErr || !signInData?.user) {
          return {
            success: false,
            error: `Identifiants incorrects pour le compte ${cleanEmail}. Veuillez vérifier votre mot de passe habituel.`,
          }
        }
        activeUserId = signInData.user.id
      } else {
        // Mode création de nouveau compte client via adminSupabase (confirmation email immédiate)
        const { data: createdUserData, error: createAuthErr } = await adminSupabase.auth.admin.createUser({
          email: cleanEmail,
          password: accountPassword,
          email_confirm: true,
          user_metadata: {
            full_name: customerName,
            phone: customerPhone,
          },
        })

        if (createAuthErr) {
          const errLower = createAuthErr.message.toLowerCase()
          if (errLower.includes("already") || errLower.includes("exists") || createAuthErr.status === 422) {
            // L'utilisateur existe déjà : tentative de connexion avec le mot de passe fourni
            const { data: existingSignIn, error: existingErr } = await supabase.auth.signInWithPassword({
              email: cleanEmail,
              password: accountPassword,
            })

            if (!existingErr && existingSignIn?.user) {
              activeUserId = existingSignIn.user.id
            } else {
              return {
                success: false,
                error: `Un compte client existe déjà avec l'adresse ${cleanEmail}. Veuillez cliquer sur "Déjà un compte ? Se connecter" et renseigner votre mot de passe habituel pour valider votre commande.`,
              }
            }
          } else {
            return {
              success: false,
              error: `Erreur lors de la création de votre compte : ${createAuthErr.message}`,
            }
          }
        } else if (createdUserData?.user) {
          activeUserId = createdUserData.user.id

          // Enregistrement synchronisé direct dans la table profiles
          await adminSupabase.from("profiles").upsert({
            id: activeUserId,
            email: cleanEmail,
            full_name: customerName,
            phone: customerPhone,
            shipping_address: {
              street: streetAddress,
              postal_code: postalCode,
              city: city,
            },
          })

          // Connexion immédiate dans la session du navigateur (dépose les cookies de session HTTP-Only)
          await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password: accountPassword,
          })

          // Envoi automatique des emails personnalisés (Bienvenue Client + Alerte Admin)
          try {
            await sendSignupEmails({
              fullName: customerName,
              email: cleanEmail,
              phone: customerPhone,
            })
          } catch (mailErr) {
            console.warn("Order signup emails error (non-blocking):", mailErr)
          }
        }
      }
    }

    // 2. Vérification des prix côté serveur d'après la base Supabase et le catalogue scierie
    const productIds = rawItems.map((i) => i.productId)
    let dbProducts: Product[] = []
    try {
      const { data, error: prodErr } = await adminSupabase
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
      const { data: zone } = await adminSupabase
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

    // 4. Insertion dans la table `orders` via adminSupabase (bypasses RLS et sécurise l'association)
    const { data: createdOrder, error: insertErr } = await adminSupabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: activeUserId,
        customer_name: customerName,
        customer_email: cleanEmail,
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

    // Envoi email confirmation commande + alerte admin via contact@lena-directa.company
    try {
      await sendOrderCreatedEmails({
        orderId: createdOrder.id,
        orderNumber: createdOrder.order_number,
        customerName,
        customerEmail: cleanEmail,
        customerPhone,
        totalFormatted: formatPrice(totalCents),
        items: snapshotItems.map((it) => ({
          name: it.name,
          quantity: it.quantity,
          totalFormatted: formatPrice(it.total_cents),
        })),
      })
    } catch (mailErr) {
      console.warn("Order email send error (non-blocking):", mailErr)
    }

    revalidatePath("/admin")
    revalidatePath("/mon-compte")

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
    const idCheck = z.string().uuid().safeParse(orderId)
    if (!idCheck.success) {
      return { success: false, error: "Identifiant de commande invalide." }
    }

    const adminSupabase = createAdminClient()

    const { data: existing, error: fetchErr } = await adminSupabase
      .from("orders")
      .select("id, status, payment_status, order_number, admin_notes, customer_name, customer_email, total_cents")
      .eq("id", orderId)
      .single()

    if (fetchErr || !existing) {
      return { success: false, error: "Commande introuvable." }
    }

    const noteAppend = reference
      ? `\nVirement bancaire signalé par le client (Réf: ${reference.trim()}) le ${new Date().toLocaleString("fr-FR")}`
      : `\nVirement bancaire signalé par le client le ${new Date().toLocaleString("fr-FR")}`

    const updatedNotes = ((existing.admin_notes || "") + noteAppend).trim()
    const notifiedAt = new Date().toISOString()

    const { error: updateErr } = await adminSupabase
      .from("orders")
      .update({
        payment_status: "transfer_notified",
        status: "payment_notified",
        payment_notified_at: notifiedAt,
        admin_notes: updatedNotes,
      })
      .eq("id", orderId)

    if (updateErr) {
      console.error("Error updating transfer notified status:", updateErr)
      return { success: false, error: "Erreur lors de la mise à jour du statut." }
    }

    // Alerte email immédiate à l'admin sur contact@lena-directa.company
    try {
      await sendTransferNotifiedAdminEmail({
        orderNumber: existing.order_number,
        customerName: existing.customer_name,
        customerEmail: existing.customer_email,
        totalFormatted: formatPrice(existing.total_cents),
        reference,
      })
    } catch (mailErr) {
      console.warn("Transfer notification email error (non-blocking):", mailErr)
    }

    revalidatePath("/admin")
    revalidatePath("/mon-compte")
    revalidatePath(`/confirmation/${orderId}`)

    return {
      success: true,
      status: "payment_notified",
      payment_status: "transfer_notified",
      payment_notified_at: notifiedAt,
    }
  } catch (err) {
    console.error("notifyTransferSent error:", err)
    return { success: false, error: "Erreur serveur lors de la notification." }
  }
}

/**
 * Récupère en direct le statut d'une commande spécifique (utilisé pour mise à jour sans rechargement)
 */
export async function getOrderLiveStatusAction(orderId: string) {
  try {
    const idCheck = z.string().uuid().safeParse(orderId)
    if (!idCheck.success) return null

    const supabase = await createClient()
    const { data, error } = await supabase.rpc("get_order_by_id", {
      p_order_id: orderId,
    })

    if (error || !data || data.length === 0) return null
    const ord = data[0]
    return {
      id: ord.id,
      status: ord.status,
      payment_status: ord.payment_status,
      payment_notified_at: ord.payment_notified_at,
    }
  } catch {
    return null
  }
}

/**
 * Récupère en direct les commandes du client connecté
 */
export async function getMyOrdersLiveAction() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const { data: orders } = await supabase
      .from("orders")
      .select("*")
      .or(`user_id.eq.${user.id},customer_email.eq.${user.email}`)
      .order("created_at", { ascending: false })

    return orders || []
  } catch {
    return null
  }
}
