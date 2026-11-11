"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const check = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          if (mounted) {
            setIsAdmin(false)
            setLoading(false)
          }
          return
        }

        if (user.email === "admin@lena-directa.company" || user.user_metadata?.role === "admin") {
          if (mounted) {
            setIsAdmin(true)
            setLoading(false)
          }
          return
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", user.id)
          .single()

        if (mounted) {
          setIsAdmin(Boolean(profile?.is_admin))
          setLoading(false)
        }
      } catch {
        if (mounted) {
          setIsAdmin(false)
          setLoading(false)
        }
      }
    }

    check()
    return () => {
      mounted = false
    }
  }, [])

  return { isAdmin, loading }
}
