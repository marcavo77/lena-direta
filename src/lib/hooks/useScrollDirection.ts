"use client"

import { useState, useEffect, useRef } from "react"

/**
 * Hook performant pour détecter la direction du défilement (scroll).
 * Retourne `true` si la barre doit être visible (scroll vers le haut ou haut de page),
 * et `false` si l'utilisateur défile vers le bas (pour masquer la barre).
 */
export function useScrollDirection(threshold = 8) {
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    let ticking = false

    const updateScrollDir = () => {
      const scrollY = window.scrollY

      // Tout en haut de la page : toujours visible
      if (scrollY <= 50) {
        setIsVisible(true)
        lastScrollY.current = scrollY
        ticking = false
        return
      }

      const diff = scrollY - lastScrollY.current

      // Filtre les micro-mouvements (seuil en px)
      if (Math.abs(diff) >= threshold) {
        if (diff > 0) {
          // Défilement vers le bas -> masquer
          setIsVisible(false)
        } else {
          // Défilement vers le haut -> afficher
          setIsVisible(true)
        }
        lastScrollY.current = scrollY
      }

      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir)
        ticking = true
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [threshold])

  return isVisible
}
