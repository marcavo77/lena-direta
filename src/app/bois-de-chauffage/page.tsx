import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { ProductCard } from "@/components/shop/ProductCard"
import Link from "next/link"
import {
  Trees,
  Droplet,
  Truck,
  ShieldCheck,
  ChevronRight,
  Flame,
  Award,
  Warehouse,
  Ruler,
  HelpCircle,
  Calendar,
} from "lucide-react"

export const metadata = {
  title: "Bois de Chauffage en Stères & Palettes | LenaDireta Scierie",
  description:
    "Bûches de chêne, charme et hêtre fendues et séchées sous abri (< 20% humidité). Coupes 25cm, 33cm et 50cm rangées sur palettes de 2 à 4 stères.",
}

export const dynamic = "force-dynamic"

export default async function BoisDeChauffagePage() {
  const supabase = await createClient()

  // Récupération des produits bois de chauffage et allumage
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .in("category", ["bois_buches", "allumage"])
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
              <span className="text-stone-200">Bois de Chauffage Traditionnel</span>
            </nav>
          </div>
        </div>

        {/* Hero Section Bois de Chauffage */}
        <section className="bg-[#181615] border-b border-stone-800 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                <Trees className="w-4 h-4 text-emerald-400" />
                <span>100% Chêne, Charme &amp; Hêtre • Forêts Françaises PEFC</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-stone-100 tracking-tight leading-tight">
                Bois de Chauffage <span className="text-amber-500">Sec &amp; Fendu</span>
              </h1>

              <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
                Issu d&apos;exploitations forestières durables et fendu dans notre scierie, notre bois de chauffage est séché naturellement sous hangars ouverts ventilés. Taux d&apos;humidité contrôlé inférieur à 20% (Norme NF H1) pour un allumage immédiat et une chaleur généreuse.
              </p>

              {/* 4 Piliers Techniques Bois Traditionnel */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs font-semibold">
                <div className="bg-stone-900 border border-stone-800 p-3 rounded-xl">
                  <div className="text-sky-400 font-bold text-base">&lt; 20% H1</div>
                  <div className="text-stone-400 text-[11px] mt-0.5">Humidité contrôlée scierie</div>
                </div>

                <div className="bg-stone-900 border border-stone-800 p-3 rounded-xl">
                  <div className="text-emerald-400 font-bold text-base">Groupe 1 (G1)</div>
                  <div className="text-stone-400 text-[11px] mt-0.5">Feuillus durs à haute densité</div>
                </div>

                <div className="bg-stone-900 border border-stone-800 p-3 rounded-xl">
                  <div className="text-amber-400 font-bold text-base">25, 33 et 50 cm</div>
                  <div className="text-stone-400 text-[11px] mt-0.5">Coupes calibrées et régulières</div>
                </div>

                <div className="bg-stone-900 border border-stone-800 p-3 rounded-xl">
                  <div className="text-stone-200 font-bold text-base">Palettes Rangées</div>
                  <div className="text-stone-400 text-[11px] mt-0.5">Volume garanti sans vide</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Grille des Produits Bois Traditionnel */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-100">
                Nos Palettes de Bois en Stock
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mt-1">
                Bûches empilées et sanglées avec soin. Prêtes à être entreposées sous votre hangar ou abri de jardin.
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

        {/* Tableau d'équivalence officiel AFNOR : Stères vs m³ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-6 sm:p-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
                  Transparence &amp; Règlements Forestiers
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-100 mt-1">
                  Comprendre l&apos;Équivalence Stère / Mètre Cube (m³)
                </h2>
                <p className="text-xs sm:text-sm text-stone-400 mt-1">
                  Tableau officiel de conversion issu de la norme française AFNOR NF B55-001.
                </p>
              </div>

              <Link
                href="/#simulateur"
                className="inline-flex items-center gap-2 bg-stone-900 border border-stone-800 hover:border-amber-500/50 text-amber-400 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shrink-0"
              >
                <Ruler className="w-4 h-4" />
                <span>Ouvrir le simulateur de stères</span>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-stone-800 text-stone-400 uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Longueur des bûches</th>
                    <th className="py-3 px-4">Volume apparent (m³ rangé)</th>
                    <th className="py-3 px-4">Coefficient multiplicateur</th>
                    <th className="py-3 px-4">Usage poêle / foyer recommandé</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/80">
                  <tr className="hover:bg-stone-900/40">
                    <td className="py-3.5 px-4 font-bold text-stone-200">100 cm (1 mètre de référence)</td>
                    <td className="py-3.5 px-4 font-bold text-amber-400">1,00 m³</td>
                    <td className="py-3.5 px-4 text-stone-400">1,00</td>
                    <td className="py-3.5 px-4 text-stone-400">Gros foyers de chaudière bois bûche</td>
                  </tr>
                  <tr className="hover:bg-stone-900/40">
                    <td className="py-3.5 px-4 font-bold text-stone-200">50 cm</td>
                    <td className="py-3.5 px-4 font-bold text-amber-400">0,80 m³</td>
                    <td className="py-3.5 px-4 text-stone-400">1,25</td>
                    <td className="py-3.5 px-4 text-stone-400">Grandes cheminées ouvertes &amp; inserts larges</td>
                  </tr>
                  <tr className="hover:bg-stone-900/40 bg-amber-500/5">
                    <td className="py-3.5 px-4 font-bold text-amber-400">33 cm (Format Standard)</td>
                    <td className="py-3.5 px-4 font-bold text-amber-400">0,70 m³</td>
                    <td className="py-3.5 px-4 text-stone-400">1,43</td>
                    <td className="py-3.5 px-4 text-stone-200">La majorité des poêles à bois et inserts récents</td>
                  </tr>
                  <tr className="hover:bg-stone-900/40">
                    <td className="py-3.5 px-4 font-bold text-stone-200">25 cm</td>
                    <td className="py-3.5 px-4 font-bold text-amber-400">0,60 m³</td>
                    <td className="py-3.5 px-4 text-stone-400">1,67</td>
                    <td className="py-3.5 px-4 text-stone-400">Poêles compacts haute performance (RT2012 / RE2020)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 text-xs text-stone-300 space-y-1">
              <div className="font-bold text-stone-200 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span>Pourquoi le volume en m³ diminue-t-il lorsque la bûche est plus courte ?</span>
              </div>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Lorsque des bûches de 1 mètre sont recoupées en 33 cm ou 25 cm, les morceaux s&apos;emboîtent beaucoup plus étroitement. Les espaces d&apos;air vides diminuent, ce qui réduit le volume géométrique apparent (0,70 m³ au lieu de 1 m³), mais la quantité de matière ligneuse, le poids sec et le pouvoir de chauffe sont exactement les mêmes !
              </p>
            </div>
          </div>
        </section>

        {/* Dépose tout-terrain & chariot élévateur */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="bg-[#181615] border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-stone-800">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-stone-100">
                  Dépose au plus près de votre stockage
                </h3>
                <p className="text-xs text-stone-400">
                  Notre matériel logistique spécialisé évite la corvée de transport manuel
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-300">
              <div className="space-y-2 bg-stone-900/60 border border-stone-800 p-4 rounded-xl">
                <div className="font-bold text-stone-100">Chariot élévateur embarqué</div>
                <p className="text-stone-400 leading-relaxed text-[11px]">
                  Équipé de roues larges basse pression, notre chariot tout-terrain roule sur les graviers, allées pavées et pelouses sans abîmer votre propriété.
                </p>
              </div>

              <div className="space-y-2 bg-stone-900/60 border border-stone-800 p-4 rounded-xl">
                <div className="font-bold text-stone-100">Dépose sous abri ou garage</div>
                <p className="text-stone-400 leading-relaxed text-[11px]">
                  Si l&apos;accès dispose d&apos;une hauteur libre de 2,10m et d&apos;une largeur de 2,30m, le chariot pénètre dans votre garage pour y poser la palette.
                </p>
              </div>

              <div className="space-y-2 bg-stone-900/60 border border-stone-800 p-4 rounded-xl">
                <div className="font-bold text-stone-100">Prise de rendez-vous téléphonique</div>
                <p className="text-stone-400 leading-relaxed text-[11px]">
                  Aucun créneau imprécis : notre transporteur vous appelle au moins 24h avant pour convenir de la demi-journée exacte selon votre emploi du temps.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Retrait Drive */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
          <div className="bg-stone-900/70 border border-stone-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider">
                <Warehouse className="w-4 h-4" />
                <span>Retrait Drive Scierie</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-stone-100">
                Vous disposez d&apos;une remorque ou d&apos;une camionnette ?
              </h3>
              <p className="text-xs text-stone-400">
                Bénéficiez d&apos;une remise immédiate de 40 € par palette en venant retirer à l&apos;exploitation forestière à Nangis ou dans nos 3 dépôts partenaires.
              </p>
            </div>

            <Link
              href="/nos-depots"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shrink-0 min-h-[44px]"
            >
              <span>Choisir un dépôt de retrait</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
