"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  Flame,
  FileText,
  Clock,
  Eye,
  EyeOff,
} from "lucide-react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon"
import { loginAction, signupAction } from "@/app/actions/auth"

function AuthContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTarget = searchParams.get("redirect") || "/mon-compte"
  const defaultTab = searchParams.get("tab") === "signup" ? "signup" : "login"
  const [tab, setTab] = useState<"login" | "signup">(defaultTab)

  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    const formData = new FormData(e.currentTarget)
    const res = await loginAction(formData)

    if (res?.error) {
      setErrorMessage(res.error)
      setLoading(false)
    } else {
      setSuccessMessage("Connexion réussie ! Redirection...")
      setTimeout(() => {
        router.push(redirectTarget)
        router.refresh()
      }, 600)
    }
  }

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    const formData = new FormData(e.currentTarget)
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.")
      setLoading(false)
      return
    }

    const res = await signupAction(formData)

    if (res?.error) {
      setErrorMessage(res.error)
      setLoading(false)
    } else {
      setSuccessMessage(
        "Compte créé avec succès ! Synchronisation avec votre espace..."
      )
      setTimeout(() => {
        router.push(redirectTarget)
        router.refresh()
      }, 700)
    }
  }

  return (
    <div className="bg-[#121110] min-h-screen text-stone-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 py-10 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Fil d'Ariane */}
        <nav className="flex items-center gap-2 text-xs text-stone-400 mb-6 font-medium">
          <Link href="/" className="hover:text-amber-400 transition-colors">
            Accueil
          </Link>
          <span>/</span>
          <span className="text-stone-200">Espace Client &amp; Connexion</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Formulaire Principal (7 cols) */}
          <div className="lg:col-span-7 bg-[#1c1917] border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-6">
            {/* Bascule Onglets */}
            <div className="flex border-b border-stone-800 pb-3 gap-6 text-sm font-bold">
              <button
                type="button"
                onClick={() => {
                  setTab("login")
                  setErrorMessage(null)
                }}
                className={`pb-2 relative transition-colors ${
                  tab === "login"
                    ? "text-amber-400 font-extrabold"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                <span>Se connecter</span>
                {tab === "login" && (
                  <span className="absolute bottom-[-13px] left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setTab("signup")
                  setErrorMessage(null)
                }}
                className={`pb-2 relative transition-colors ${
                  tab === "signup"
                    ? "text-amber-400 font-extrabold"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                <span>Créer un compte</span>
                {tab === "signup" && (
                  <span className="absolute bottom-[-13px] left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
                )}
              </button>
            </div>

            {/* Messages Feedback */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Formulaire Connexion */}
            {tab === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1.5">
                    Adresse Email *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      placeholder="votre.email@exemple.fr"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 pl-10 text-sm text-stone-100 focus:outline-none focus:border-amber-500 min-h-[44px]"
                    />
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-stone-300">
                      Mot de passe *
                    </label>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        alert(
                          "Pour réinitialiser votre mot de passe, contactez notre support à contact@lenadireta.com ou sur WhatsApp au +34 672 86 83 32."
                        )
                      }}
                      className="text-[11px] text-stone-400 hover:text-amber-400 transition-colors"
                    >
                      Mot de passe oublié ?
                    </a>
                  </div>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      name="password"
                      required
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 pl-10 pr-11 text-sm text-stone-100 focus:outline-none focus:border-amber-500 min-h-[44px]"
                    />
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword((prev) => !prev)}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-stone-400 hover:text-amber-400 transition-colors rounded-lg focus:outline-none"
                      aria-label={showLoginPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                      title={showLoginPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      {showLoginPassword ? (
                        <EyeOff className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3.5 px-6 rounded-xl transition-all min-h-[48px] shadow-lg shadow-amber-500/10 text-sm"
                >
                  {loading ? (
                    <span>Connexion en cours...</span>
                  ) : (
                    <>
                      <span>Me connecter à mon espace</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Formulaire Inscription */
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1.5">
                    Nom et Prénom *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="Jean Dupont"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 pl-10 text-sm text-stone-100 focus:outline-none focus:border-amber-500 min-h-[44px]"
                    />
                    <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1.5">
                    Adresse Email *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      placeholder="jean.dupont@exemple.fr"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 pl-10 text-sm text-stone-100 focus:outline-none focus:border-amber-500 min-h-[44px]"
                    />
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1.5">
                    Téléphone Mobile (Prise de RDV livraison) *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      required
                      autoComplete="tel"
                      placeholder="06 12 34 56 78"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 pl-10 text-sm text-stone-100 focus:outline-none focus:border-amber-500 min-h-[44px]"
                    />
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1.5">
                      Mot de passe *
                    </label>
                    <div className="relative">
                      <input
                        type={showSignupPassword ? "text" : "password"}
                        name="password"
                        required
                        placeholder="Min. 6 caractères"
                        className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 pl-10 pr-11 text-sm text-stone-100 focus:outline-none focus:border-amber-500 min-h-[44px]"
                      />
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword((prev) => !prev)}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-stone-400 hover:text-amber-400 transition-colors rounded-lg focus:outline-none"
                        aria-label={showSignupPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                        title={showSignupPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                      >
                        {showSignupPassword ? (
                          <EyeOff className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1.5">
                      Confirmer mot de passe *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        required
                        placeholder="••••••••"
                        className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 pl-10 pr-11 text-sm text-stone-100 focus:outline-none focus:border-amber-500 min-h-[44px]"
                      />
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-stone-400 hover:text-amber-400 transition-colors rounded-lg focus:outline-none"
                        aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                        title={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3.5 px-6 rounded-xl transition-all min-h-[48px] shadow-lg shadow-amber-500/10 text-sm"
                >
                  {loading ? (
                    <span>Création du compte...</span>
                  ) : (
                    <>
                      <span>Créer mon compte client</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Avantages & Réassurance (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-6 sm:p-7 space-y-5">
              <h3 className="font-bold text-base text-stone-100 flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                <span>Pourquoi créer un compte LeñaDirecta ?</span>
              </h3>

              <div className="space-y-4 text-xs text-stone-300">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center shrink-0 text-amber-500">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-stone-100">Suivi direct de livraison</div>
                    <p className="text-stone-400 text-[11px] mt-0.5">
                      Statut de préparation en scierie et créneau fixé avec le transporteur.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center shrink-0 text-amber-500">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-stone-100">Factures conformes téléchargeables</div>
                    <p className="text-stone-400 text-[11px] mt-0.5">
                      Téléchargez vos attestations d'achat et justificatifs TVA 10% en PDF.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center shrink-0 text-amber-500">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-stone-100">Historique de vos stères</div>
                    <p className="text-stone-400 text-[11px] mt-0.5">
                      Retrouvez votre volume consommé l'hiver dernier et recommandez en 1 clic.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-800 text-xs text-stone-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Vos données sont protégées et hébergées en France (RGPD).</span>
              </div>
            </div>

            {/* Aide par WhatsApp */}
            <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5 text-xs text-stone-300 flex items-center justify-between gap-4">
              <div>
                <div className="font-bold text-stone-100">Besoin d'aide pour commander ?</div>
                <div className="text-stone-400 text-[11px] mt-0.5">Discussion directe sur WhatsApp du lundi au samedi.</div>
              </div>
              <a
                href="https://wa.me/34672868332"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-colors"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                <span>+34 672 86 83 32</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      </main>

      <Footer />
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="bg-[#121110] min-h-screen text-stone-100 flex items-center justify-center p-6 text-xs text-stone-400">Chargement de votre espace...</div>}>
      <AuthContent />
    </Suspense>
  )
}
