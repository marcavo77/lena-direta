"use client"

import React, { useState, useEffect, useRef } from "react"
import { Globe, ChevronDown, Check, X } from "lucide-react"

export interface Language {
  code: string
  name: string
  nativeName: string
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "fr", name: "Français", nativeName: "Français" },
  { code: "en", name: "Anglais", nativeName: "English" },
  { code: "es", name: "Espagnol", nativeName: "Español" },
  { code: "pt", name: "Portugais", nativeName: "Português" },
  { code: "de", name: "Allemand", nativeName: "Deutsch" },
  { code: "it", name: "Italien", nativeName: "Italiano" },
  { code: "nl", name: "Néerlandais", nativeName: "Nederlands" },
  { code: "pl", name: "Polonais", nativeName: "Polski" },
  { code: "ro", name: "Roumain", nativeName: "Română" },
  { code: "cs", name: "Tchèque", nativeName: "Čeština" },
  { code: "uk", name: "Ukrainien", nativeName: "Українська" },
  { code: "ar", name: "Arabe", nativeName: "العربية" },
]

/**
 * Composant de rendu de drapeau vectoriel SVG pur
 * Garantit un affichage net et coloré sur 100% des systèmes (Windows, Mac, iOS, Android)
 */
export function FlagIcon({
  code,
  className = "w-5 h-3.5",
}: {
  code: string
  className?: string
}) {
  const baseClasses = `inline-block object-cover rounded-[2px] shadow-xs border border-black/15 shrink-0 align-middle ${className}`

  switch (code.toLowerCase()) {
    case "fr":
      // Drapeau France (Bleu / Blanc / Rouge)
      return (
        <svg viewBox="0 0 24 16" className={baseClasses} xmlns="http://www.w3.org/2000/svg">
          <rect width="8" height="16" fill="#002654" />
          <rect x="8" width="8" height="16" fill="#FFFFFF" />
          <rect x="16" width="8" height="16" fill="#CE1126" />
        </svg>
      )

    case "en":
    case "gb":
      // Union Jack (Royaume-Uni)
      return (
        <svg viewBox="0 0 60 30" className={baseClasses} xmlns="http://www.w3.org/2000/svg">
          <clipPath id="uk-clip">
            <rect width="60" height="30" />
          </clipPath>
          <g clipPath="url(#uk-clip)">
            <rect width="60" height="30" fill="#012169" />
            <path d="M0 0 L60 30 M60 0 L0 30" stroke="#FFFFFF" strokeWidth="6" />
            <path d="M0 0 L30 15 M60 30 L30 15 M60 0 L30 15 M0 30 L30 15" stroke="#C8102E" strokeWidth="2" />
            <path d="M30 0 v30 M0 15 h60" stroke="#FFFFFF" strokeWidth="10" />
            <path d="M30 0 v30 M0 15 h60" stroke="#C8102E" strokeWidth="6" />
          </g>
        </svg>
      )

    case "es":
      // Drapeau Espagne (Rouge / Jaune / Rouge + Blason stylisé)
      return (
        <svg viewBox="0 0 24 16" className={baseClasses} xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="4" fill="#AA151B" />
          <rect y="4" width="24" height="8" fill="#F1BF00" />
          <rect y="12" width="24" height="4" fill="#AA151B" />
          <g transform="translate(6, 6) scale(0.65)">
            <path d="M0 0 h4 v3 a2 2 0 0 1 -4 0 z" fill="#AA151B" />
            <path d="M0.8 0.8 h2.4 v2 a1 1 0 0 1 -2 0 z" fill="#F1BF00" />
            <circle cx="2" cy="-0.8" r="0.9" fill="#AA151B" />
          </g>
        </svg>
      )

    case "pt":
      // Drapeau Portugal (Vert 38% / Rouge 62% + Sphère armillaire)
      return (
        <svg viewBox="0 0 24 16" className={baseClasses} xmlns="http://www.w3.org/2000/svg">
          <rect width="9" height="16" fill="#046A38" />
          <rect x="9" width="15" height="16" fill="#DA291C" />
          <circle cx="9" cy="8" r="3.2" fill="#FFC72C" />
          <circle cx="9" cy="8" r="2.2" fill="#DA291C" />
          <rect x="8" y="6.6" width="2" height="2.8" rx="0.3" fill="#FFFFFF" />
          <rect x="8.5" y="7.1" width="1" height="1.8" fill="#002654" />
        </svg>
      )

    case "de":
      // Drapeau Allemagne (Noir / Rouge / Or)
      return (
        <svg viewBox="0 0 24 16" className={baseClasses} xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="5.33" fill="#000000" />
          <rect y="5.33" width="24" height="5.33" fill="#DD0000" />
          <rect y="10.66" width="24" height="5.34" fill="#FFCE00" />
        </svg>
      )

    case "it":
      // Drapeau Italie (Vert / Blanc / Rouge)
      return (
        <svg viewBox="0 0 24 16" className={baseClasses} xmlns="http://www.w3.org/2000/svg">
          <rect width="8" height="16" fill="#009246" />
          <rect x="8" width="8" height="16" fill="#FFFFFF" />
          <rect x="16" width="8" height="16" fill="#CE2B37" />
        </svg>
      )

    case "nl":
      // Drapeau Pays-Bas (Rouge / Blanc / Bleu)
      return (
        <svg viewBox="0 0 24 16" className={baseClasses} xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="5.33" fill="#C8102E" />
          <rect y="5.33" width="24" height="5.33" fill="#FFFFFF" />
          <rect y="10.66" width="24" height="5.34" fill="#21468B" />
        </svg>
      )

    case "pl":
      // Drapeau Pologne (Blanc / Rouge)
      return (
        <svg viewBox="0 0 24 16" className={baseClasses} xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="8" fill="#FFFFFF" />
          <rect y="8" width="24" height="8" fill="#DC143C" />
        </svg>
      )

    case "ro":
      // Drapeau Roumanie (Bleu / Jaune / Rouge)
      return (
        <svg viewBox="0 0 24 16" className={baseClasses} xmlns="http://www.w3.org/2000/svg">
          <rect width="8" height="16" fill="#002B7F" />
          <rect x="8" width="8" height="16" fill="#FCD116" />
          <rect x="16" width="8" height="16" fill="#CE1126" />
        </svg>
      )

    case "cs":
      // Drapeau République Tchèque (Blanc / Rouge + Triangle Bleu)
      return (
        <svg viewBox="0 0 24 16" className={baseClasses} xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="8" fill="#FFFFFF" />
          <rect y="8" width="24" height="8" fill="#D7141A" />
          <polygon points="0,0 12,8 0,16" fill="#11457E" />
        </svg>
      )

    case "uk":
      // Drapeau Ukraine (Bleu / Jaune)
      return (
        <svg viewBox="0 0 24 16" className={baseClasses} xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="8" fill="#0057B7" />
          <rect y="8" width="24" height="8" fill="#FFDD00" />
        </svg>
      )

    case "ar":
      // Drapeau Émirats Arabes Unis / Monde Arabe (Vert / Blanc / Noir + Bande Rouge)
      return (
        <svg viewBox="0 0 24 16" className={baseClasses} xmlns="http://www.w3.org/2000/svg">
          <rect x="6" width="18" height="5.33" fill="#00732F" />
          <rect x="6" y="5.33" width="18" height="5.33" fill="#FFFFFF" />
          <rect x="6" y="10.66" width="18" height="5.34" fill="#000000" />
          <rect width="6" height="16" fill="#FF0000" />
        </svg>
      )

    default:
      return (
        <span className={`${baseClasses} bg-stone-700 flex items-center justify-center text-[9px] font-bold text-stone-200`}>
          {code.toUpperCase()}
        </span>
      )
  }
}

export function LanguageSelector({
  className = "",
}: {
  className?: string
  compact?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState<string>("fr")
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Lecture d'un cookie
  const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
      return parts.pop()?.split(";").shift() || null
    }
    return null
  }

  // Initialisation au montage côté client
  useEffect(() => {
    setMounted(true)

    // Détecter la langue actuelle depuis googtrans ou localStorage
    const savedCookie = getCookie("googtrans")
    if (savedCookie) {
      const match = savedCookie.match(/\/fr\/([a-z]{2})/i)
      if (match && match[1]) {
        const code = match[1].toLowerCase()
        if (SUPPORTED_LANGUAGES.some((l) => l.code === code)) {
          setCurrentLang(code)
        }
      }
    } else {
      const stored = localStorage.getItem("preferred_lang")
      if (stored && SUPPORTED_LANGUAGES.some((l) => l.code === stored)) {
        setCurrentLang(stored)
      }
    }

    // Définir la fonction globale requise par le script Google Translate
    if (!(window as any).googleTranslateElementInit) {
      ;(window as any).googleTranslateElementInit = () => {
        if ((window as any).google && (window as any).google.translate) {
          try {
            new (window as any).google.translate.TranslateElement(
              {
                pageLanguage: "fr",
                includedLanguages: SUPPORTED_LANGUAGES.map((l) => l.code).join(","),
                autoDisplay: false,
              },
              "google_translate_element"
            )
          } catch (e) {
            console.warn("Erreur d'initialisation Google Translate:", e)
          }
        }
      }
    }

    // Injecter le conteneur masqué dans le body si absent
    if (!document.getElementById("google_translate_element")) {
      const div = document.createElement("div")
      div.id = "google_translate_element"
      div.style.display = "none"
      div.style.position = "absolute"
      div.style.top = "-9999px"
      div.style.left = "-9999px"
      document.body.appendChild(div)
    }

    // Injecter le script officiel Google Translate si absent
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script")
      script.id = "google-translate-script"
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  // Fermeture du dropdown lors d'un clic extérieur ou appui sur Échap
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  // Changement de langue avec persistance de cookie et rechargement
  const handleSelectLanguage = (langCode: string) => {
    setCurrentLang(langCode)
    setIsOpen(false)

    try {
      localStorage.setItem("preferred_lang", langCode)

      const hostname = window.location.hostname
      const domainParts = hostname.split(".")
      const rootDomain =
        domainParts.length > 1 ? "." + domainParts.slice(-2).join(".") : hostname

      if (langCode === "fr") {
        // Retour au français d'origine : suppression propre des cookies
        const paths = ["/", ""]
        const domains = [hostname, rootDomain, `.${hostname}`, ""]

        domains.forEach((d) => {
          paths.forEach((p) => {
            document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${p};${
              d ? ` domain=${d};` : ""
            }`
          })
        })
        document.cookie = "googtrans=/fr/fr; path=/;"
      } else {
        // Activation de la traduction vers la langue cible
        const cookieVal = `/fr/${langCode}`
        document.cookie = `googtrans=${cookieVal}; path=/;`
        document.cookie = `googtrans=${cookieVal}; domain=${hostname}; path=/;`
        if (domainParts.length > 1) {
          document.cookie = `googtrans=${cookieVal}; domain=${rootDomain}; path=/;`
        }
      }

      // Tenter de modifier le sélecteur natif Google s'il est déjà injecté
      const combo = document.querySelector<HTMLSelectElement>(
        "#google_translate_element select.goog-te-combo, select.goog-te-combo"
      )
      if (combo) {
        combo.value = langCode
        combo.dispatchEvent(new Event("change", { bubbles: true }))
      }

      // Rechargement rapide pour garantir une traduction intégrale et propre de la page
      setTimeout(() => {
        window.location.reload()
      }, 150)
    } catch (e) {
      console.error("Erreur lors de la sélection de langue:", e)
      window.location.reload()
    }
  }

  const selectedLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0]

  if (!mounted) {
    return (
      <div
        className={`h-7 sm:h-8 px-2 sm:px-2.5 rounded-full bg-stone-800/80 border border-stone-700/60 opacity-0 shrink-0 ${className}`}
        aria-hidden="true"
      />
    )
  }

  return (
    <div ref={containerRef} className={`relative inline-block text-left shrink-0 ${className}`}>
      {/* Bouton Déclencheur avec vrai drapeau SVG + Code Langue + Flèche */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Langue actuelle : ${selectedLang.name}. Cliquer pour changer de langue`}
        title={`Traduire le site (Actuellement : ${selectedLang.name})`}
        className="language-toggle-btn inline-flex items-center gap-1.5 h-7 sm:h-8 px-2 sm:px-2.5 rounded-full bg-stone-800/90 hover:bg-stone-700 text-stone-200 hover:text-amber-400 border border-stone-700/80 transition-all shadow-sm active:scale-95 cursor-pointer select-none shrink-0"
      >
        <FlagIcon code={selectedLang.code} className="w-4 h-2.5 sm:w-4.5 sm:h-3 rounded-[2px]" />
        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-stone-100">
          {selectedLang.code}
        </span>
        <ChevronDown
          className={`w-2.5 h-2.5 sm:w-3 sm:h-3 text-stone-400 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-amber-400" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {/* ================= OVERLAY BACKDROP SUR MOBILE (Tapotement extérieur ferme le menu) ================= */}
      {isOpen && (
        <div
          className="sm:hidden fixed inset-0 bg-stone-950/60 backdrop-blur-xs z-[110] animate-in fade-in duration-150"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ================= MENU DÉROULANT DES LANGUES (Optimisé Mobile-First) ================= */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Sélectionner une langue de traduction"
          className="language-dropdown fixed top-12 left-3 right-3 max-w-[340px] mx-auto z-[120] rounded-2xl bg-[#1c1917] border border-stone-800 p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md sm:fixed-none sm:absolute sm:top-full sm:left-auto sm:right-0 sm:inset-x-auto sm:mt-1.5 sm:w-64 sm:max-w-none sm:rounded-xl sm:p-1.5"
        >
          {/* En-tête du menu avec bouton de fermeture sur mobile */}
          <div className="px-2.5 py-1.5 mb-1 border-b border-stone-800/80 flex items-center justify-between text-stone-400">
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[10px] uppercase font-black tracking-wider text-stone-300">
                Traduction automatique
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-stone-800 text-stone-400">
                {SUPPORTED_LANGUAGES.length} langues
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Fermer le sélecteur de langue"
                className="sm:hidden w-6 h-6 rounded-md bg-stone-800/80 text-stone-400 hover:text-stone-100 flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Liste des langues (Scrollable avec touch targets confortables) */}
          <div className="max-h-[60vh] sm:max-h-80 overflow-y-auto space-y-0.5 pr-0.5">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang.code === currentLang
              return (
                <button
                  key={lang.code}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`language-item-hover w-full flex items-center justify-between px-2.5 py-2.5 sm:py-2 rounded-lg text-left text-xs transition-colors group ${
                    isSelected
                      ? "bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30"
                      : "text-stone-200 hover:bg-stone-800/80 hover:text-amber-400"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FlagIcon
                      code={lang.code}
                      className="w-5 h-3.5 sm:w-5 sm:h-3.5 rounded-[2px] shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="truncate font-semibold text-stone-100 group-hover:text-amber-400">
                        {lang.nativeName}
                      </span>
                      {lang.nativeName !== lang.name && (
                        <span className="text-[10px] text-stone-400 truncate">
                          {lang.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-stone-800/80 text-stone-400 border border-stone-700/40">
                      {lang.code}
                    </span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
