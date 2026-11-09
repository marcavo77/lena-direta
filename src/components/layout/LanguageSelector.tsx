"use client"

import { useState, useEffect, useRef } from "react"
import { Globe, ChevronDown, Check } from "lucide-react"

export interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "fr", name: "Français", nativeName: "Français", flag: "🇫🇷" },
  { code: "en", name: "Anglais", nativeName: "English", flag: "🇬🇧" },
  { code: "es", name: "Espagnol", nativeName: "Español", flag: "🇪🇸" },
  { code: "pt", name: "Portugais", nativeName: "Português", flag: "🇵🇹" },
  { code: "de", name: "Allemand", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italien", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "nl", name: "Néerlandais", nativeName: "Nederlands", flag: "🇳🇱" },
  { code: "pl", name: "Polonais", nativeName: "Polski", flag: "🇵🇱" },
  { code: "ro", name: "Roumain", nativeName: "Română", flag: "🇷🇴" },
  { code: "cs", name: "Tchèque", nativeName: "Čeština", flag: "🇨🇿" },
  { code: "uk", name: "Ukrainien", nativeName: "Українська", flag: "🇺🇦" },
  { code: "ar", name: "Arabe", nativeName: "العربية", flag: "🇦🇪" },
]

export function LanguageSelector({
  className = "",
  compact = false,
}: {
  className?: string
  compact?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState<string>("fr")
  const [mounted, setMounted] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Lecture des cookies
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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
    <div ref={dropdownRef} className={`relative inline-block text-left shrink-0 ${className}`}>
      {/* Bouton Déclencheur (Compact & Ergonomique) */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Langue actuelle : ${selectedLang.name}. Cliquer pour changer de langue`}
        title={`Traduire le site (Actuellement : ${selectedLang.name})`}
        className="language-toggle-btn inline-flex items-center gap-1 sm:gap-1.5 h-7 sm:h-8 px-2 sm:px-2.5 rounded-full bg-stone-800/90 hover:bg-stone-700 text-stone-200 hover:text-amber-400 border border-stone-700/80 transition-all shadow-sm active:scale-95 cursor-pointer select-none shrink-0"
      >
        <span className="text-xs sm:text-sm leading-none shrink-0" aria-hidden="true">
          {selectedLang.flag}
        </span>
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

      {/* Menu Déroulant des Langues */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Sélectionner une langue de traduction"
          className="language-dropdown absolute left-0 sm:left-auto sm:right-0 mt-1.5 w-60 sm:w-64 max-h-80 overflow-y-auto rounded-xl bg-[#1c1917] border border-stone-800 p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md"
        >
          {/* En-tête du menu */}
          <div className="px-2.5 py-1.5 mb-1 border-b border-stone-800/80 flex items-center justify-between text-stone-400">
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[10px] uppercase font-black tracking-wider text-stone-300">
                Traduction automatique
              </span>
            </div>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-stone-800 text-stone-400">
              {SUPPORTED_LANGUAGES.length} langues
            </span>
          </div>

          {/* Liste des langues */}
          <div className="space-y-0.5">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang.code === currentLang
              return (
                <button
                  key={lang.code}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`language-item-hover w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs transition-colors group ${
                    isSelected
                      ? "bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30"
                      : "text-stone-200 hover:bg-stone-800/80 hover:text-amber-400"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base leading-none shrink-0" aria-hidden="true">
                      {lang.flag}
                    </span>
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
