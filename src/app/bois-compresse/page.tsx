import { getPublicSupabase } from "@/lib/supabase/public"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { ProductCard } from "@/components/shop/ProductCard"
import Link from "next/link"
import {
  Flame,
  Droplet,
  ShieldCheck,
  Truck,
  Trees,
  Award,
  ChevronRight,
  Sparkle,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Clock,
  Warehouse,
} from "lucide-react"

export const metadata = {
  title: "Bois Compressé & Bûches Densifiées | LeñaDirecta Scierie",
  description:
    "Achetez vos bûches densifiées de jour, packs nuit longue durée (8h) et pavés 100% chêne. Livraison sur palette avec chariot tout-terrain.",
}

// Cache CDN Vercel instantané & régénération en arrière-plan
export const revalidate = 60

export default async function BoisCompressePage() {
  const supabase = getPublicSupabase()

  // Récupération des produits bois compressé et allumage
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .in("category", ["buches_compressees", "allumage"])
    .order("unit_price_cents", { ascending: true })

  return (
    <div className="min-h-screen bg-[#121110] text-stone-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 pb-16">
        {/* Fil d'Ariane */}
        <div className="bg-[#1c1917] border-b border-stone-800 py-3.5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <nav className="flex items-center gap-2 text-xs text-stone-400 font-medium">
              <Link href="/" className="hover:text-amber-400 transition-colors">
                Accueil
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
              <Link href="/catalogue" className="hover:text-amber-400 transition-colors">
                Boutique
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
              <span className="text-stone-200">Bois Compressé &amp; Bûches Densifiées</span>
            </nav>
          </div>
        </div>

        {/* Hero Banner Spécifique Catégorie */}
        <section className="bg-[#181615] border-b border-stone-800 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                <Flame className="w-4 h-4 fill-amber-500" />
                <span>Rendement Calorifique Maximal • Scierie Française</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-stone-100 tracking-tight leading-tight">
                Bois Compressé &amp; <span className="text-amber-500">Bûches Densifiées</span>
              </h1>

              <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
                Fabriquées exclusivement à partir de sciures et copeaux de chêne et feuillus durs non traités, nos bûches densifiées offrent un pouvoir calorifique exceptionnel (&gt; 4,8 kWh/kg) avec un taux d&apos;humidité inférieur à 9%.
              </p>

              {/* 4 Piliers Techniques */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs font-semibold">
                <div className="bg-stone-900 border border-stone-800 p-3 rounded-xl">
                  <div className="text-amber-400 font-bold text-base">&gt; 4,8 kWh/kg</div>
                  <div className="text-stone-400 text-[11px] mt-0.5">Pouvoir calorifique (PCI)</div>
                </div>

                <div className="bg-stone-900 border border-stone-800 p-3 rounded-xl">
                  <div className="text-sky-400 font-bold text-base">&lt; 8,5%</div>
                  <div className="text-stone-400 text-[11px] mt-0.5">Taux d&apos;humidité ultra-sec</div>
                </div>

                <div className="bg-stone-900 border border-stone-800 p-3 rounded-xl">
                  <div className="text-emerald-400 font-bold text-base">Jusqu&apos;à 8h</div>
                  <div className="text-stone-400 text-[11px] mt-0.5">Braise continue (Pack nuit)</div>
                </div>

                <div className="bg-stone-900 border border-stone-800 p-3 rounded-xl">
                  <div className="text-amber-400 font-bold text-base">Division par 3</div>
                  <div className="text-stone-400 text-[11px] mt-0.5">Volume de stockage requis</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Grille des Produits Bois Compressé */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-100">
                Nos Références Disponibles en Stock
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mt-1">
                Conditionnées sur palettes filmées hermétiques pour un stockage garanti sous abri ou garage.
              </p>
            </div>

            <div className="text-xs font-bold text-stone-400 bg-stone-900 border border-stone-800 px-3.5 py-2 rounded-xl">
              {products?.length || 0} références en stock scierie
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products?.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>

        {/* Tableau Comparatif : Bois Compressé vs Bûches Traditionnelles */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-6 sm:p-10 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
                Comparatif Technique Scierie
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-100 mt-1">
                Pourquoi Choisir le Bois Compressé ?
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mt-1">
                Comparaison certifiée pour 1 tonne de combustible bois
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-stone-800 text-stone-400 uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Critère de performance</th>
                    <th className="py-3 px-4 bg-amber-500/10 text-amber-400 font-bold rounded-t-lg">
                      Bûches Compressées LeñaDirecta
                    </th>
                    <th className="py-3 px-4 text-stone-300">Bûches Traditionnelles</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/80">
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-stone-300">Pouvoir calorifique (PCI)</td>
                    <td className="py-3.5 px-4 bg-amber-500/5 font-bold text-amber-400">
                      4,8 à 5,0 kWh/kg (Chaleur vive)
                    </td>
                    <td className="py-3.5 px-4 text-stone-400">3,8 à 4,0 kWh/kg</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-stone-300">Taux d&apos;humidité</td>
                    <td className="py-3.5 px-4 bg-amber-500/5 font-bold text-emerald-400">
                      &lt; 8,5% (Prêt direct à l&apos;emploi)
                    </td>
                    <td className="py-3.5 px-4 text-stone-400">18% à 20% (Norme H1)</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-stone-300">Espace de stockage requis</td>
                    <td className="py-3.5 px-4 bg-amber-500/5 font-bold text-stone-100">
                      1 m² pour 1 palette (Propre en garage)
                    </td>
                    <td className="py-3.5 px-4 text-stone-400">3 à 4 m² sous abri ventilé</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-stone-300">Production de cendres</td>
                    <td className="py-3.5 px-4 bg-amber-500/5 font-bold text-amber-400">
                      &lt; 1% (Vitre de poêle propre)
                    </td>
                    <td className="py-3.5 px-4 text-stone-400">2% à 3%</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-stone-300">Encrassement du conduit</td>
                    <td className="py-3.5 px-4 bg-amber-500/5 font-bold text-emerald-400">
                      Quasi nul (Zéro bistre ni goudron)
                    </td>
                    <td className="py-3.5 px-4 text-stone-400">Faible à modéré si bien séché</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Guide d'utilisation : Comment brûler les bûches densifiées */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="bg-[#181615] border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-stone-800">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-stone-100">
                  Conseils d&apos;utilisation de notre chef d&apos;atelier
                </h3>
                <p className="text-xs text-stone-400">
                  Nos recommandations pour profiter au mieux de vos bûches densifiées
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-300">
              <div className="space-y-2 bg-stone-900/60 border border-stone-800 p-4 rounded-xl">
                <div className="font-bold text-stone-100 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-amber-500 text-stone-950 font-black flex items-center justify-center text-xs">
                    1
                  </span>
                  <span>Une seule bûche à la fois</span>
                </div>
                <p className="text-stone-400 leading-relaxed text-[11px]">
                  Le pouvoir chauffant est très dense. Ne chargez jamais plus d&apos;une bûche compressée dans un poêle compact, car le bois gonfle légèrement en brûlant.
                </p>
              </div>

              <div className="space-y-2 bg-stone-900/60 border border-stone-800 p-4 rounded-xl">
                <div className="font-bold text-stone-100 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-amber-500 text-stone-950 font-black flex items-center justify-center text-xs">
                    2
                  </span>
                  <span>Allumage avec laine de bois</span>
                </div>
                <p className="text-stone-400 leading-relaxed text-[11px]">
                  Cassez une rondelle de bûche ou utilisez un cube de laine de bois pour amorcer la combustion sans solvant chimique.
                </p>
              </div>

              <div className="space-y-2 bg-stone-900/60 border border-stone-800 p-4 rounded-xl">
                <div className="font-bold text-stone-100 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-amber-500 text-stone-950 font-black flex items-center justify-center text-xs">
                    3
                  </span>
                  <span>Stockage impérativement au sec</span>
                </div>
                <p className="text-stone-400 leading-relaxed text-[11px]">
                  Les bûches compressées ne supportent pas l&apos;humidité directe ou la pluie. Stockez-les dans un garage fermé, un cellier ou une chaufferie sèche.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Rappel des dépôts et retrait Drive */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
          <div className="bg-stone-900/70 border border-stone-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider">
                <Warehouse className="w-4 h-4" />
                <span>Option Retrait Drive Scierie</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-stone-100">
                Économisez 40 € par palette en venant retirer à nos dépôts
              </h3>
              <p className="text-xs text-stone-400">
                Nos caristes chargent directement votre remorque ou utilitaire à Nangis (77), Melun, Meaux ou Évry.
              </p>
            </div>

            <Link
              href="/nos-depots"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shrink-0 min-h-[44px]"
            >
              <span>Voir les 4 dépôts Drive</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
