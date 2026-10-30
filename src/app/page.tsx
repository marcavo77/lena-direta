import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/shop/ProductCard"
import { StereCalculator } from "@/components/shop/StereCalculator"
import { DeliveryChecker } from "@/components/shop/DeliveryChecker"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Flame, ShieldCheck, Truck, Sparkles, ArrowDown } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch active products
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("unit_price_cents", { ascending: false })

  const productList = products || []

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-amber-500 selection:text-stone-950">
      <Header />

      <main className="flex-1">
        {/* HERO SECTION - Mobile-first */}
        <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-stone-800/60">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(245,158,11,0.15),rgba(255,255,255,0))]" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              {/* Badge supérieur */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Stocks Hiver Prêts à l&apos;Emploi • Taux d&apos;Humidité Garanti</span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] text-stone-100">
                Le Meilleur Bois de Chauffage &amp; Granulés,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">
                  Livrés chez Vous.
                </span>
              </h1>

              <p className="mt-5 text-sm sm:text-lg text-stone-400 leading-relaxed max-w-2xl mx-auto">
                Chêne, charme et hêtre fendus, séchés sous abri (&lt; 20% d&apos;humidité). Livraison directe par camion avec chariot embarqué au plus près de votre zone de stockage.
              </p>

              {/* CTAs Mobile-First */}
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                <Link
                  href="#catalogue"
                  className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 min-h-[48px] text-sm sm:text-base active:scale-95"
                >
                  <Flame className="w-5 h-5 fill-stone-950" />
                  <span>Commander mon bois</span>
                </Link>

                <Link
                  href="#simulateur"
                  className="bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 font-semibold px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 min-h-[48px] text-sm sm:text-base"
                >
                  <span>Calculer mon besoin</span>
                  <ArrowDown className="w-4 h-4 text-stone-400" />
                </Link>
              </div>
            </div>

            {/* Vérificateur de code postal rapide en bandeau */}
            <div id="livraison" className="mt-12 max-w-2xl mx-auto">
              <DeliveryChecker />
            </div>
          </div>
        </section>

        {/* SECTION CATALOGUE PRODUITS */}
        <section id="catalogue" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-amber-500 font-bold mb-1">
                Catalogue Certifié
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-stone-100">
                Nos Combustibles Premium
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 max-w-md">
              Conditionnés sur palettes stables ou en filets aérés pour préserver une combustion sans fumée et un rendement calorifique maximal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productList.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* SECTION SIMULATEUR DE STÈRES & CUBAGE */}
        <section id="simulateur" className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-stone-100">
              Combien de stères devez-vous commander ?
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-2 max-w-xl mx-auto">
              Le volume apparent d&apos;un stère change selon la longueur de coupe. Utilisez notre outil interactif pour ajuster précisément votre commande.
            </p>
          </div>

          <StereCalculator />
        </section>

        {/* SECTION ENGAGEMENTS QUALITÉ */}
        <section className="bg-stone-900/40 border-y border-stone-800/80 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-stone-950/60 border border-stone-800 p-6 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4 border border-amber-500/20">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-stone-100 mb-2">Taux d&apos;Humidité &lt; 20%</h3>
                <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                  Tout notre bois est fendu et séché sous hangar ventilé pendant 18 à 24 mois. Vos vitres restent claires et vos conduits ne s&apos;encrassent pas.
                </p>
              </div>

              <div className="bg-stone-950/60 border border-stone-800 p-6 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4 border border-amber-500/20">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-stone-100 mb-2">Dépose sur Mesure</h3>
                <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                  Pas de palette abandonnée sur le trottoir : nos chauffeurs utilisent un transpalette motorisé tout-terrain capable de rouler sur gravier et d&apos;entrer sous votre abri.
                </p>
              </div>

              <div className="bg-stone-950/60 border border-stone-800 p-6 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4 border border-amber-500/20">
                  <Flame className="w-6 h-6 fill-amber-500" />
                </div>
                <h3 className="text-lg font-bold text-stone-100 mb-2">100% Feuillus Durs</h3>
                <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                  Chêne, Charme, Hêtre et Frêne : des essences nobles à forte masse volumique assurant une braise longue et constante. Zéro bois résineux dans nos bûches.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
