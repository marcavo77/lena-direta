import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

/**
 * Client Supabase universel et sans cookies.
 * Utilisé pour le rendu statique (SSG / ISR / generateStaticParams)
 * et pour servir le contenu public (produits, catégories) ultra-rapidement
 * via le Edge Cache Vercel sans bloquer sur les cookies HTTP.
 */
export function getPublicSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  
  return createClient<Database>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
