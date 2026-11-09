import { getPublicSupabase } from "@/lib/supabase/public"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { ProductCard } from "@/components/shop/ProductCard"
import Link from "next/link"
import {
  Flame,
  Award,
  ShieldCheck,
  Truck,
  Droplet,
  ChevronRight,
  Warehouse,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
} from "lucide-react"

export const metadata = {
  title: "Granulés de Bois & Pellets Din+ / EnPlus A1 | LeñaDirecta Scierie",
  description:
    "Pellets de bois 100% résineux certifiés Din+ et EnPlus A1. Palettes de 66 sacs de 15 kg ou vrac camion souffleur avec pesée certifiée.",
}

// Cache CDN Vercel instantané & régénération en arrière-plan
export const revalidate = 60

export default async function GranulesDeBoisPage() {
  const supabase = getPublicSupabase()

  // Récupération des produits granulés et pellets
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("category", "granules_pellets")
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
              <span className="text-stone-200">Granulés de Bois &amp; Pellets</span>
            </nav>
          </div>
        </div>

        {/* Hero Section Pellets */}
        <section className="bg-[#181615] border-b border-stone-800 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Double Certification Din+ 7A304 &amp; EnPlus A1</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-stone-100 tracking-tight leading-tight">
                Granulés de Bois &amp; <span className="text-amber-500">Pellets Premium</span>
              </h1>

              <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
                Produits à partir de co-produits de scierie (sciures de résineux sans écorce ni liant chimique), nos granulés de bois garantissent une combustion complète, une chaleur constante et un encrassement minimal de votre poêle ou chaudière.
              </p>

              {/* 4 Piliers Techniques Pellets */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs font-semibold">
                <div className="bg-stone-900 border border-stone-800 p-3 rounded-xl">
                  <div className="text-amber-400 font-bold text-base">&gt; 4,9 kWh/kg</div>
                  <div className="text-stone-400 text-[11px] mt-0.5">Pouvoir calorifique élevé</div>
                </div>

                <div className="bg-stone-900 border border-stone-800 p-3 rounded-xl">
                  <div className="text-emerald-400 font-bold text-base">&lt; 0,5%</div>
                  <div className="text-stone-400 text-[11px] mt-0.5">Taux de cendres résiduelles</div>
                </div>

                <div className="bg-stone-900 border border-stone-800 p-3 rounded-xl">
                  <div className="text-sky-400 font-bold text-base">&lt; 8%</div>
                  <div className="text-stone-400 text-[11px] mt-0.5">Taux d&apos;humidité moyen</div>
                </div>

                <div className="bg-stone-900 border border-stone-800 p-3 rounded-xl">
                  <div className="text-stone-200 font-bold text-base">&gt; 98,5%</div>
                  <div className="text-stone-400 text-[11px] mt-0.5">Durabilité mécanique (zéro poussière)</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Grille des Produits Granulés */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-100">
                Nos Formats Granulés en Stock
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mt-1">
                Disponibles en palette de 66 sacs de 15 kg (990 kg) ou livrés en vrac par camion souffleur.
              </p>
            </div>

            <div className="text-xs font-bold text-stone-400 bg-stone-900 border border-stone-800 px-3.5 py-2 rounded-xl">
              {products?.length || 0} références en stock scierie
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            {products?.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>

        {/* Spécifications Techniques Din+ & EnPlus A1 */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-6 sm:p-10 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
                Cahier des Charges Qualité
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-100 mt-1">
                Fiche d&apos;Analyse de Laboratoire
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mt-1">
                Résultats des analyses par lot selon les normes européennes ISO 17225-2
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-4 space-y-2">
                <div className="flex justify-between pb-2 border-b border-stone-800">
                  <span className="text-stone-400">Origine des bois</span>
                  <span className="font-bold text-stone-200">100% Résineux (Pin, Épicéa, Sapin)</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-stone-800">
                  <span className="text-stone-400">Diamètre des pellets</span>
                  <span className="font-bold text-stone-200">6 mm (± 0.5 mm)</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-stone-800">
                  <span className="text-stone-400">Longueur moyenne</span>
                  <span className="font-bold text-stone-200">3,15 à 40 mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Masse volumique apparente</span>
                  <span className="font-bold text-stone-200">&gt; 650 kg/m³</span>
                </div>
              </div>

              <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-4 space-y-2">
                <div className="flex justify-between pb-2 border-b border-stone-800">
                  <span className="text-stone-400">Teneur en fines (poussières)</span>
                  <span className="font-bold text-emerald-400">&lt; 0,5% en sortie d&apos;ensachage</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-stone-800">
                  <span className="text-stone-400">Température de fusion des cendres</span>
                  <span className="font-bold text-stone-200">&gt; 1 200°C (Anti-mâchefer)</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-stone-800">
                  <span className="text-stone-400">Liants ou additifs chimiques</span>
                  <span className="font-bold text-emerald-400">0% (Lignine naturelle seule)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Certifications d&apos;audit</span>
                  <span className="font-bold text-amber-400">Din+ 7A304 • EnPlus A1 FR014</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Focus Livraison Vrac Camion Souffleur */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="bg-[#181615] border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-stone-800">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-stone-100">
                  Livraison en Vrac par Camion Souffleur
                </h3>
                <p className="text-xs text-stone-400">
                  Spécifique pour les chaudières automatiques et silos textiles ou maçonnés
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-300">
              <div className="space-y-2 bg-stone-900/60 border border-stone-800 p-4 rounded-xl">
                <div className="font-bold text-stone-100">Pesée certifiée embarquée</div>
                <p className="text-stone-400 leading-relaxed text-[11px]">
                  Nos camions disposent d&apos;une bascule homologuée par la métrologie légale. Vous payez exactement la tonne injectée dans votre silo, ticket imprimé sur place.
                </p>
              </div>

              <div className="space-y-2 bg-stone-900/60 border border-stone-800 p-4 rounded-xl">
                <div className="font-bold text-stone-100">Aspiration des poussières</div>
                <p className="text-stone-400 leading-relaxed text-[11px]">
                  Un tuyau de retour avec filtre cyclone aspire l&apos;air et les éventuelles poussières lors du remplissage, garantissant un silo propre et sans pression excessive.
                </p>
              </div>

              <div className="space-y-2 bg-stone-900/60 border border-stone-800 p-4 rounded-xl">
                <div className="font-bold text-stone-100">Tuyau souple jusqu&apos;à 35 mètres</div>
                <p className="text-stone-400 leading-relaxed text-[11px]">
                  Le camion peut rester stationné sur la voie publique ou dans votre cour goudronnée tout en raccordant le raccord pompier Guillemin de votre installation.
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
                <span>Retrait Drive en Dépôt</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-stone-100">
                -40 € sur votre palette de 66 sacs au Drive
              </h3>
              <p className="text-xs text-stone-400">
                Nos caristes posent la palette entière directement au chariot élévateur dans votre véhicule ou remorque à Nangis (77), Melun, Meaux ou Évry.
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
