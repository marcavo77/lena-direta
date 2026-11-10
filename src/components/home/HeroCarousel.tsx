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
  ShieldCheck,
  CheckCircle2,
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
  tags: string[]
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
    badgeText: "Bois Sec H1 Garanti • Humidité < 20%",
    badgeIcon: Trees,
    titlePrefix: "Bois de Chauffage Sec en Bûches",
    titleHighlight: "Chêne, Charme & Hêtre",
    titleSuffix: "Prêts à Brûler",
    description:
      "Bûches dures de première qualité fendues en 25 cm, 33 cm ou 50 cm. Séchage certifié sous hangar ventilé pour un pouvoir calorifique maximal et un conduit parfaitement préservé.",
    tags: ["Feuillus durs français", "Prêt à l'emploi immédiat", "Livraison tout-terrain"],
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
    id: "pellets-granules",
    image: "/images/hero/hero-pellets-granules.jpg",
    badgeText: "Certification Din+ & ENplus A1 • 100% Résineux",
    badgeIcon: Award,
    titlePrefix: "Granulés de Bois Din+",
    titleHighlight: "Pellets Haute Densité",
    titleSuffix: "0% Additif Chimique",
    description:
      "Rendement calorifique supérieur (> 5,0 kWh/kg) et taux de cendre ultra-faible (< 0,5%). Conçus pour une combustion propre et régulière dans tous les poêles et chaudières.",
    tags: ["Pouvoir calorifique > 5 kWh/kg", "Taux de cendre < 0,5%", "Sacs 15kg & Palettes"],
    primaryCta: {
      label: "Découvrir les granulés",
      href: "/granules-de-bois",
    },
    secondaryCta: {
      label: "Retrait Dépôt (-40€/pal.)",
      href: "/nos-depots",
    },
  },
  {
    id: "charbon-de-bois",
    image: "/images/hero/hero-charbon-bois.jpg",
    badgeText: "Qualité Restauration • Braise Longue Durée",
    badgeIcon: Sparkles,
    titlePrefix: "Charbon de Bois Artisanal",
    titleHighlight: "Gros Calibre de Feuillus Durs",
    titleSuffix: "Sans Poussière",
    description:
      "Morceaux purs calibrés de chêne et charme carbonisés selon les méthodes traditionnelles. Allumage rapide, braises vives constantes pendant des heures sans fumée acre.",
    tags: ["Gros morceaux sans brisures", "Tenue de braise 4h+", "Allumage sans odeur"],
    primaryCta: {
      label: "Voir le catalogue",
      href: "/catalogue",
    },
    secondaryCta: {
      label: "Conditions de livraison",
      href: "/livraison-et-acces",
    },
  },
  {
    id: "buches-compressees",
    image: "/images/hero/hero-buches-compressees.jpg",
    badgeText: "Biomasse Compressée • Pouvoir Calorifique x3",
    badgeIcon: Flame,
    titlePrefix: "Bûches Compressées Écologiques",
    titleHighlight: "Chaleur Intense Jour & Nuit",
    titleSuffix: "100% Chêne et Hêtre",
    description:
      "Sciures de bois dur densifiées sous très haute pression sans colle ni adjuvant. Une bûche garantit 1h30 à 2h de flammes franches ou de braises lentes pour la nuit.",
    tags: ["Moins de 10% d'humidité", "Propreté & gain de place x3", "Combustion propre"],
    primaryCta: {
      label: "Voir le bois compressé",
      href: "/bois-compresse",
    },
    secondaryCta: {
      label: "Contact & Devis",
      href: "/contact",
    },
  },
]

const SLIDE_DURATION = 6000 // 6 secondes par diapositive

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
      className="relative w-full rounded-2xl overflow-hidden border border-stone-800 bg-[#121110] shadow-2xl select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Carrousel des combustibles LeñaDirecta"
    >
      {/* 1. Conteneur des Images de Fond avec fondu fluide */}
      <div className="relative w-full min-h-[460px] sm:min-h-[480px] md:min-h-[500px] lg:min-h-[520px] flex items-center">
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
                className="object-cover object-center scale-100"
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
              {/* Voile sombre mat pour lisibilité sans dégradé néon (conforme AGENTS.md) */}
              <div className="absolute inset-0 bg-stone-950/70" />
            </div>
          )
        })}

        {/* 2. Contenu Texte HTML Réel (Traduisible automatiquement en 12+ langues) */}
        <div className="relative z-20 w-full px-4 sm:px-8 md:px-12 py-8 sm:py-12">
          <div className="max-w-2xl bg-[#121110]/90 border border-stone-800/90 rounded-2xl p-5 sm:p-8 backdrop-blur-md shadow-2xl">
            {/* Badge de réassurance */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-900 border border-amber-500/30 text-amber-400 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3.5">
              <BadgeIcon className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{currentSlide.badgeText}</span>
            </div>

            {/* Titre fort avec mise en valeur ambre */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-stone-100 tracking-tight leading-[1.15]">
              {currentSlide.titlePrefix}{" "}
              <span className="text-amber-500">{currentSlide.titleHighlight}</span>{" "}
              {currentSlide.titleSuffix}
            </h1>

            {/* Description détaillée */}
            <p className="mt-3 text-xs sm:text-sm md:text-base text-stone-300 font-normal leading-relaxed">
              {currentSlide.description}
            </p>

            {/* Puces de certification / caractéristiques techniques */}
            <div className="mt-4 flex flex-wrap gap-2">
              {currentSlide.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-stone-300 bg-stone-900/80 border border-stone-800 px-2.5 py-1 rounded-md"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>

            {/* Boutons d'action (CTAs) */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={currentSlide.primaryCta.href}
                className="bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-black px-5 sm:px-6 py-3 rounded-xl text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 transition-all min-h-[44px] shadow-lg shadow-amber-500/20"
              >
                <span>{currentSlide.primaryCta.label}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href={currentSlide.secondaryCta.href}
                className="bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 hover:border-amber-500/60 font-bold px-4 sm:px-5 py-3 rounded-xl text-xs sm:text-sm transition-all min-h-[44px] flex items-center gap-2"
              >
                <span>{currentSlide.secondaryCta.label}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 3. Boutons Précédent / Suivant (Accessibilité tactile 44x44px) */}
        <button
          type="button"
          onClick={goToPrev}
          aria-label="Diapositive précédente"
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-stone-950/80 hover:bg-stone-900 text-stone-200 hover:text-amber-400 border border-stone-800 hover:border-amber-500 flex items-center justify-center transition-all backdrop-blur-sm"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          type="button"
          onClick={goToNext}
          aria-label="Diapositive suivante"
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-stone-950/80 hover:bg-stone-900 text-stone-200 hover:text-amber-400 border border-stone-800 hover:border-amber-500 flex items-center justify-center transition-all backdrop-blur-sm"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* 4. Barre de Navigation / Pagination en Bas du Carrousel */}
        <div className="absolute bottom-3.5 left-0 right-0 z-30 flex items-center justify-center gap-2 px-4">
          {SLIDES.map((slide, idx) => {
            const isActive = idx === currentIndex
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToSlide(idx)}
                aria-label={`Aller à la diapositive ${idx + 1}`}
                className={`relative h-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? "w-8 sm:w-12 bg-amber-500"
                    : "w-2 sm:w-3 bg-stone-700/80 hover:bg-stone-500"
                }`}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
