"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Flame,
  Trees,
  Award,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react"

interface SlideData {
  id: string
  image: string
  badgeText: string
  badgeIcon: React.ComponentType<{ className?: string }>
  titlePrefix: string
  titleHighlight: string
  titleSuffix?: string
  description: string
  primaryCta: {
    label: string
    href: string
  }
  secondaryCta: {
    label: string
    href: string
  }
}

const SLIDES: SlideData[] = [
  {
    id: "bois-de-chauffage",
    image: "/images/hero/hero-bois-chauffage.jpg",
    badgeText: "Bois Sec H1 Garanti • < 20% Humidité",
    badgeIcon: Trees,
    titlePrefix: "Bois de Chauffage Sec",
    titleHighlight: "Chêne, Charme & Hêtre",
    titleSuffix: "",
    description:
      "Bûches dures de première qualité fendues en 25, 33 ou 50 cm. Séchage certifié sous hangar ventilé pour un rendement calorifique maximal.",
    primaryCta: {
      label: "Commander mon bois",
      href: "/bois-de-chauffage",
    },
    secondaryCta: {
      label: "Calculateur de stères",
      href: "/#simulateur",
    },
  },
  {
    id: "buches-compressees",
    image: "/images/hero/hero-buches-compressees.jpg",
    badgeText: "Biomasse Compressée • Pouvoir Calorifique x3",
    badgeIcon: Flame,
    titlePrefix: "Bûches Compressées",
    titleHighlight: "Chaleur Intense Jour & Nuit",
    titleSuffix: "",
    description:
      "Sciures de bois dur densifiées sous très haute pression sans colle. 1h30 à 2h de flammes franches ou de braises lentes pour la nuit.",
    primaryCta: {
      label: "Voir le bois compressé",
      href: "/bois-compresse",
    },
    secondaryCta: {
      label: "Calculer mes besoins",
      href: "/#simulateur",
    },
  },
  {
    id: "pellets-granules",
    image: "/images/hero/hero-pellets-granules.jpg",
    badgeText: "Certifié Din+ & ENplus A1 • 100% Résineux",
    badgeIcon: Award,
    titlePrefix: "Granulés de Bois Din+",
    titleHighlight: "Haute Performance",
    titleSuffix: "",
    description:
      "Rendement calorifique supérieur (> 5 kWh/kg) et taux de cendre ultra-faible (< 0,5%). Combustion propre pour tous poêles et chaudières.",
    primaryCta: {
      label: "Découvrir les granulés",
      href: "/granules-de-bois",
    },
    secondaryCta: {
      label: "Retrait Dépôt (-40€)",
      href: "/nos-depots",
    },
  },
  {
    id: "charbon-de-bois",
    image: "/images/hero/hero-charbon-bois.jpg",
    badgeText: "Qualité Restauration • Braise 4h+",
    badgeIcon: Sparkles,
    titlePrefix: "Charbon de Bois Artisanal",
    titleHighlight: "Gros Calibre Feuillus Durs",
    titleSuffix: "",
    description:
      "Morceaux purs sélectionnés sans brisures ni poussière. Allumage rapide et tenue de braise vive longue durée.",
    primaryCta: {
      label: "Voir le catalogue",
      href: "/catalogue",
    },
    secondaryCta: {
      label: "Nos 4 dépôts drive",
      href: "/nos-depots",
    },
  },
]

const SLIDE_DURATION = 5500 // 5.5 secondes par diapositive

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length)
  }, [])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Défilement automatique
  useEffect(() => {
    if (isPaused) return

    timerRef.current = setInterval(() => {
      goToNext()
    }, SLIDE_DURATION)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPaused, goToNext])

  // Gestion des gestes tactiles (swipe mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
    setIsPaused(true)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX - touchEndX

    if (diff > 45) {
      goToNext()
    } else if (diff < -45) {
      goToPrev()
    }
    setTouchStartX(null)
    setIsPaused(false)
  }

  const currentSlide = SLIDES[currentIndex]
  const BadgeIcon = currentSlide.badgeIcon

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-stone-800 bg-[#121110] shadow-xl select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Carrousel des combustibles LeñaDirecta"
    >
      {/* 
        Conteneur avec EXACTEMENT la même taille et proportions que l'ancienne bannière :
        h-44 sm:h-64 md:h-72 lg:h-80 w-full
      */}
      <div className="relative h-44 sm:h-64 md:h-72 lg:h-80 w-full flex items-center overflow-hidden">
        {/* Images de fond en transition fluide */}
        {SLIDES.map((slide, idx) => {
          const isActive = idx === currentIndex
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <Image
                src={slide.image}
                alt={`${slide.titlePrefix} ${slide.titleHighlight}`}
                fill
                priority={idx === 0}
                className="object-cover object-center"
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
              {/* Voile sombre uni pour un contraste optimal sans dégradé fluo (conforme AGENTS.md) */}
              <div className="absolute inset-0 bg-stone-950/50" />
            </div>
          )
        })}

        {/* 
          Texte DIRECTEMENT sur l'image (sans aucune boîte/carte autour)
          Adapté pour mobile (h-44) et grands écrans
        */}
        <div className="relative z-20 h-full w-full flex flex-col justify-center px-4 sm:px-10 md:px-14 max-w-xl sm:max-w-2xl lg:max-w-3xl">
          {/* Badge compact de réassurance */}
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded bg-stone-900/80 border border-amber-500/40 text-amber-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider w-fit shadow-sm mb-1 sm:mb-2">
            <BadgeIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
            <span>{currentSlide.badgeText}</span>
          </div>

          {/* Titre franc et lisible */}
          <h2 className="text-base sm:text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            {currentSlide.titlePrefix}{" "}
            <span className="text-amber-400">{currentSlide.titleHighlight}</span>
          </h2>

          {/* Description courte (masquée sur très petit mobile pour garder les proportions parfaites, visible dès 640px) */}
          <p className="hidden sm:block mt-1 sm:mt-2 text-xs sm:text-sm md:text-base text-stone-200 font-medium line-clamp-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] max-w-xl">
            {currentSlide.description}
          </p>

          {/* Boutons d'action directs sur l'image */}
          <div className="mt-2 sm:mt-4 flex items-center gap-2.5 sm:gap-3">
            <Link
              href={currentSlide.primaryCta.href}
              className="bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-bold px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-lg text-xs sm:text-sm inline-flex items-center gap-1.5 shadow-md transition-all"
            >
              <span>{currentSlide.primaryCta.label}</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>

            <Link
              href={currentSlide.secondaryCta.href}
              className="hidden sm:inline-flex bg-stone-900/80 hover:bg-stone-900 text-stone-200 border border-stone-700/80 hover:border-amber-500 font-semibold px-4 py-2.5 rounded-lg text-xs sm:text-sm transition-all"
            >
              <span>{currentSlide.secondaryCta.label}</span>
            </Link>
          </div>
        </div>

        {/* Boutons Précédent / Suivant discrets sur les côtés */}
        <button
          type="button"
          onClick={goToPrev}
          aria-label="Diapositive précédente"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-stone-950/60 hover:bg-stone-900 text-stone-200 hover:text-amber-400 border border-stone-700/60 flex items-center justify-center transition-all"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          type="button"
          onClick={goToNext}
          aria-label="Diapositive suivante"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-stone-950/60 hover:bg-stone-900 text-stone-200 hover:text-amber-400 border border-stone-700/60 flex items-center justify-center transition-all"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Indicateurs de pagination en bas */}
        <div className="absolute bottom-2 sm:bottom-3 left-0 right-0 z-30 flex items-center justify-center gap-1.5 sm:gap-2">
          {SLIDES.map((slide, idx) => {
            const isActive = idx === currentIndex
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToSlide(idx)}
                aria-label={`Aller à la diapositive ${idx + 1}`}
                className={`relative h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? "w-6 sm:w-9 bg-amber-500"
                    : "w-1.5 sm:w-2 bg-stone-500/70 hover:bg-stone-400"
                }`}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
