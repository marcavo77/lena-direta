"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

/**
 * Écoute en temps réel les modifications/ajouts/masquages de produits dans Supabase
 * et rafraîchit instantanément les données serveur de la boutique sans rechargement manuel.
 */
export function RealtimeProductsSync() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (pathname?.startsWith("/admin")) {
      return
    }

    const supabase = createClient()
    let refreshTimer: ReturnType<typeof setTimeout> | null = null

    const channel = supabase
      .channel("storefront-products-sync")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => {
          if (refreshTimer) clearTimeout(refreshTimer)
          refreshTimer = setTimeout(() => {
            router.refresh()
          }, 200)
        }
      )
      .subscribe()

    return () => {
      if (refreshTimer) clearTimeout(refreshTimer)
      supabase.removeChannel(channel)
    }
  }, [pathname, router])

  return null
}
