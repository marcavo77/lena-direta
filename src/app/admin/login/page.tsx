"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Flame, Lock, Mail, ShieldAlert, ArrowRight, Loader2, CheckCircle2 } from "lucide-react"
import { loginAction } from "@/app/actions/auth"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("admin@lena-directa.company")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("email", email)
      formData.append("password", password)

      const res = await loginAction(formData)
      if (res?.error) {
        setError(res.error)
        setLoading(false)
      } else {
        router.push("/admin")
        router.refresh()
      }
    } catch (err: any) {
      setError(err?.message || "Erreur de connexion. Veuillez réessayer.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#121110] text-stone-100 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo & En-tête */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Flame className="w-7 h-7 fill-stone-950" />
            </div>
            <div className="text-left">
              <span className="text-2xl font-black tracking-tight text-stone-100">
                Leña<span className="text-amber-500">Directa</span>
              </span>
              <span className="block text-[11px] text-stone-400 uppercase tracking-widest font-bold">
                Espace Direction &amp; Gestion
              </span>
            </div>
          </Link>

          <h1 className="text-2xl font-black text-stone-100 tracking-tight mt-2">
            Connexion Administration
          </h1>
          <p className="text-xs text-stone-400 mt-1.5">
            Accès sécurisé pour la gestion du catalogue, stocks, images et descriptifs.
          </p>
        </div>

        {/* Boîte de Connexion */}
        <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-7 shadow-2xl">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                Identifiant Administrateur (Email)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@lena-directa.company"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-900 border border-stone-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-stone-100 text-sm placeholder:text-stone-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                  Mot de passe sécurisé
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-900 border border-stone-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-stone-100 text-sm placeholder:text-stone-500 outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 min-h-[48px] rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-98 text-stone-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Vérification des accès...</span>
                </>
              ) : (
                <>
                  <span>Accéder au Tableau de Bord</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Note d'accès rapide initial */}
          <div className="mt-6 pt-5 border-t border-stone-800 text-[11px] text-stone-400 space-y-1">
            <div className="flex items-center gap-1.5 text-stone-300 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
              <span>Compte d&apos;exploitation initial pré-configuré :</span>
            </div>
            <p className="font-mono text-stone-300 bg-stone-900 p-2 rounded-lg border border-stone-800">
              Email : <span className="text-amber-400 font-bold">admin@lena-directa.company</span>
              <br />
              Pass : <span className="text-amber-400 font-bold">LenaDirectaAdmin2026!</span>
            </p>
          </div>
        </div>

        {/* Retour au site */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs text-stone-400 hover:text-amber-400 transition-colors font-medium inline-flex items-center gap-1"
          >
            <span>← Retourner à la boutique publique</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
