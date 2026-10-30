"use server"

import { createClient } from "@/lib/supabase/server"

export interface DeliveryCheckResult {
  eligible: boolean
  department: string | null
  baseFeeCents: number
  freeShippingThresholdCents: number | null
  minOrderCents: number
  message: string
}

export async function checkPostalCodeEligibility(postalCode: string): Promise<DeliveryCheckResult> {
  const cleanCode = postalCode.trim()
  if (!/^\d{5}$/.test(cleanCode)) {
    return {
      eligible: false,
      department: null,
      baseFeeCents: 0,
      freeShippingThresholdCents: null,
      minOrderCents: 0,
      message: "Format de code postal invalide (5 chiffres requis).",
    }
  }

  const prefix = cleanCode.substring(0, 2)
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("delivery_zones")
    .select("*")
    .eq("postal_code_prefix", prefix)
    .single()

  if (error || !data || !data.is_deliverable) {
    return {
      eligible: false,
      department: null,
      baseFeeCents: 0,
      freeShippingThresholdCents: null,
      minOrderCents: 0,
      message: `Nous ne livrons pas encore directement dans le département ${prefix}. Contactez-nous pour un devis spécifique.`,
    }
  }

  return {
    eligible: true,
    department: data.department_name,
    baseFeeCents: data.base_delivery_fee_cents,
    freeShippingThresholdCents: data.free_shipping_threshold_cents,
    minOrderCents: data.min_order_cents,
    message: `Livraison éligible pour ${data.department_name} (${cleanCode}).`,
  }
}
