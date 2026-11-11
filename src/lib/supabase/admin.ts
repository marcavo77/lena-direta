import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

/**
 * Client Supabase sécurisé réservé exclusivement au serveur (Server Actions / API Routes).
 * Utilise la SUPABASE_SERVICE_ROLE_KEY pour les mutations d'administration avec privilèges élevés.
 * STRICTEMENT interdit d'importation dans les composants clients ("use client").
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  return createClient<Database>(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
