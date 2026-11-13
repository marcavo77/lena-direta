import { redirect } from "next/navigation"
import Link from "next/link"
import {
  User,
  Package,
  MapPin,
  Phone,
  Building2,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  LogOut,
  Truck,
} from "lucide-react"
import { getUserProfileAndOrders, logoutAction } from "@/app/actions/auth"
import { formatPrice } from "@/lib/utils"
import { Footer } from "@/components/layout/Footer"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { LanguageSelector } from "@/components/layout/LanguageSelector"
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon"
import { ClientOrdersRealtime } from "@/components/account/ClientOrdersRealtime"

export const dynamic = "force-dynamic"

export default async function MonComptePage() {
  const data = await getUserProfileAndOrders()

  if (!data) {
    redirect("/connexion")
  }

  const { user, profile, orders } = data

  // Redirection automatique des administrateurs vers le panneau d'administration dédié
  const isAdmin =
    Boolean((profile as any)?.is_admin) ||
    user.email === "admin@lena-directa.company" ||
    user.user_metadata?.role === "admin"

  if (isAdmin) {
    redirect("/admin")
  }

  const shipping = (profile.shipping_address as { street?: string; postal_code?: string; city?: string }) || {}

  return (
    <div className="bg-[#121110] min-h-screen text-stone-100 flex flex-col font-sans">
      <main className="flex-1 py-10 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Fil d'Ariane & Bascule Thème */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <nav className="flex items-center gap-2 text-xs text-stone-400 font-medium">
            <Link href="/" className="hover:text-amber-400 transition-colors">
              Accueil
            </Link>
            <span>/</span>
            <span className="text-stone-200">Mon Compte Client</span>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSelector />
          </div>
        </div>

        <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center font-black text-xl shrink-0">
              <User className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-stone-100">
                Bienvenue, {profile.full_name || user.email}
              </h1>
              <p className="text-xs text-stone-400 mt-0.5">
                Compte client synchronisé • {user.email}
              </p>
            </div>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 text-xs font-bold text-rose-400 hover:text-rose-300 bg-stone-900 border border-stone-800 hover:border-rose-500/30 px-4 py-2.5 rounded-xl transition-colors min-h-[44px]"
            >
              <LogOut className="w-4 h-4" />
              <span>Se déconnecter</span>
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Colonne Principale : Mes Commandes en Direct (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <ClientOrdersRealtime
              initialOrders={orders}
              userId={user.id}
              userEmail={user.email || ""}
            />
          </div>

          {/* Colonne Latérale : Coordonnées RIB Officielles & Profil (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Boîte RIB Permanente */}
            <div className="bg-[#1c1917] border border-amber-500/30 rounded-2xl p-5 space-y-3.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Building2 className="w-4 h-4" />
                <span>Coordonnées Bancaires Officielles</span>
              </div>
              <h3 className="font-bold text-sm text-stone-100">
                Paiement par Virement Bancaire (RIB)
              </h3>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Effectuez vos virements directement vers le compte de notre scierie. Vos palettes sont préparées dès constatation bancaire.
              </p>

              <div className="bg-stone-900 border border-stone-800 rounded-xl p-3 text-xs space-y-2 font-mono">
                <div>
                  <div className="text-[10px] uppercase font-bold text-stone-400 font-sans">Titulaire</div>
                  <div className="text-stone-200 font-semibold">MARTIN NAVARRO SERGIO</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-stone-400 font-sans">Banque</div>
                  <div className="text-stone-300">ING (ING Bank Spain)</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-stone-400 font-sans">IBAN (Zone SEPA)</div>
                  <div className="text-amber-400 font-bold text-[11px] select-all">
                    ES52 1465 0230 4417 4407 3036
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-stone-400 font-sans">BIC / SWIFT</div>
                  <div className="text-stone-300 font-bold">INGDESMMXXX</div>
                </div>
              </div>
            </div>

            {/* Assistance Scierie */}
            <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5 text-xs text-stone-300 space-y-2">
              <div className="font-bold text-stone-100 flex items-center gap-1.5 text-emerald-400">
                <WhatsAppIcon className="w-4 h-4 text-emerald-400" />
                <span>Support Client &amp; Expéditions</span>
              </div>
              <p className="text-stone-400 text-[11px] leading-relaxed">
                Une question sur un cubage, un accès ou un virement ? Nos conseillers répondent en direct sur WhatsApp du lundi au samedi.
              </p>
              <a
                href="https://wa.me/34672868332"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full font-bold text-white py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>WhatsApp : +34 672 86 83 32</span>
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
