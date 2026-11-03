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

export const dynamic = "force-dynamic"

export default async function MonComptePage() {
  const data = await getUserProfileAndOrders()

  if (!data) {
    redirect("/connexion")
  }

  const { user, profile, orders } = data
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
          <ThemeToggle />
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
          {/* Colonne Principale : Mes Commandes (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-6 sm:p-7 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                <div className="flex items-center gap-2.5">
                  <Package className="w-5 h-5 text-amber-500" />
                  <h2 className="font-bold text-base text-stone-100">
                    Mes Commandes &amp; Livraisons ({orders.length})
                  </h2>
                </div>
                <Link
                  href="/catalogue"
                  className="text-xs text-amber-400 hover:text-amber-300 font-bold"
                >
                  Commander du bois
                </Link>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center mx-auto text-stone-500">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-semibold text-stone-300">
                    Vous n'avez pas encore passé de commande
                  </div>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Découvrez nos stères de chêne séché sous abri (&lt; 20% humidité) et nos granulés de bois Din+.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/catalogue"
                      className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs px-5 py-2.5 rounded-xl transition-all uppercase tracking-wider"
                    >
                      <span>Voir le catalogue de bois</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => {
                    const ordItems = (ord.items as Array<{ name: string; quantity: number }>) || []
                    return (
                      <div
                        key={ord.id}
                        className="p-4 sm:p-5 rounded-xl bg-stone-900/70 border border-stone-800 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-amber-400 text-sm">
                                {ord.order_number}
                              </span>
                              <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                                {ord.status === "pending"
                                  ? "En attente de virement"
                                  : ord.status === "confirmed"
                                  ? "Confirmée - Préparation hangar"
                                  : ord.status}
                              </span>
                            </div>
                            <span className="text-[11px] text-stone-400 mt-0.5 block">
                              Passée le {new Date(ord.created_at).toLocaleDateString("fr-FR")}
                            </span>
                          </div>

                          <div className="text-right">
                            <div className="font-black text-stone-100 text-base">
                              {formatPrice(ord.total_cents)}
                            </div>
                            <span className="text-[11px] text-stone-500">TTC (TVA 10%)</span>
                          </div>
                        </div>

                        {/* Articles de la commande */}
                        <div className="pt-2 border-t border-stone-800/80 text-xs text-stone-300 space-y-1">
                          {ordItems.map((it, idx) => (
                            <div key={idx} className="flex justify-between text-[11px]">
                              <span>{it.name}</span>
                              <span className="text-stone-400 font-semibold">Qté : {it.quantity}</span>
                            </div>
                          ))}
                        </div>

                        {/* Action : Voir reçu et coordonnées de virement */}
                        <div className="pt-2 border-t border-stone-800 flex justify-end">
                          <Link
                            href={`/confirmation/${ord.id}`}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Voir le reçu &amp; instructions RIB</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
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
                  <div className="text-stone-200 font-semibold">LENADIRETA SAS</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-stone-400 font-sans">Banque</div>
                  <div className="text-stone-300">Crédit Agricole d'Île-de-France</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-stone-400 font-sans">IBAN</div>
                  <div className="text-amber-400 font-bold text-[11px] select-all">
                    FR76 1027 8000 0000 1234 5678 901
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-stone-400 font-sans">BIC / SWIFT</div>
                  <div className="text-stone-300 font-bold">AGRIFRPP</div>
                </div>
              </div>
            </div>

            {/* Assistance Scierie */}
            <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5 text-xs text-stone-300 space-y-2">
              <div className="font-bold text-stone-100 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-amber-500" />
                <span>Service Client &amp; Expéditions</span>
              </div>
              <p className="text-stone-400 text-[11px] leading-relaxed">
                Une question sur un cubage, un accès ou un virement ? Nos conseillers sont joignables du lundi au samedi.
              </p>
              <a
                href="tel:0189000000"
                className="block text-center font-bold text-amber-400 hover:text-amber-300 py-2 bg-stone-900 border border-stone-800 rounded-xl"
              >
                01 89 00 00 00
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
