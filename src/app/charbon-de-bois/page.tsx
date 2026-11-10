import { getAllProducts } from "@/lib/products"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { ProductCard } from "@/components/shop/ProductCard"
import Link from "next/link"
import Image from "next/image"
import {
  Flame,
  ShieldCheck,
  Truck,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Clock,
  Award,
  Zap,
  Wind,
} from "lucide-react"

export const metadata = {
  title: "Charbon de Bois Hexagonal Restaurant & Artisanal | LeñaDirecta",
  description:
    "Briquettes de charbon de bois hexagonal extrudé avec trou central (effet cheminée) et charbon artisanal français. Plus de 5h de braises vives, zéro fumée, résidu cendre < 4%. Sacs 10kg et palettes pro.",
}

// Cache CDN Vercel instantané & régénération en arrière-plan
export const revalidate = 60

export default async function CharbonDeBoisPage() {
  const allProducts = await getAllProducts()
  const charcoalProducts = allProducts.filter((p) => p.category === "charbon_bois")

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
              <span className="text-stone-200">Charbon de Bois &amp; Briquettes Hexagonales</span>
            </nav>
          </div>
        </div>

        {/* HERO SECTION DE LA CATÉGORIE CHARBON */}
        <section className="relative overflow-hidden bg-[#171514] border-b border-stone-800 py-10 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Colonne Gauche : Argumentaire & Titre */}
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 border border-amber-500/40 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Qualité Restauration &amp; Barbecue Pro</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-100 tracking-tight leading-tight">
                  Charbon de Bois Hexagonal Extrudé &amp; Artisanal
                </h1>

                <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                  Briquettes hexagonales dures avec trou central effet cheminée, issues de sciures de bois dur densifiées sous très haute pression sans colle ni adjuvant.
                  Idéal pour les restaurants de grillades, rôtisseries, barbecues Kamado et cuissons lentes.
                </p>

                {/* 4 Puces Métier Fortes */}
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-bold text-stone-300">
                  <div className="flex items-center gap-2 bg-stone-900/90 border border-stone-800 p-2.5 rounded-lg">
                    <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Braises vives 5h à 6h</span>
                  </div>
                  <div className="flex items-center gap-2 bg-stone-900/90 border border-stone-800 p-2.5 rounded-lg">
                    <Wind className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Zéro fumée ni odeur parasite</span>
                  </div>
                  <div className="flex items-center gap-2 bg-stone-900/90 border border-stone-800 p-2.5 rounded-lg">
                    <Flame className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Chaleur constante &gt; 350°C</span>
                  </div>
                  <div className="flex items-center gap-2 bg-stone-900/90 border border-stone-800 p-2.5 rounded-lg">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Taux de cendre &lt; 4%</span>
                  </div>
                </div>
              </div>

              {/* Colonne Droite : Visuel HD du Charbon Hexagonal */}
              <div className="lg:col-span-5">
                <div className="relative aspect-4/3 sm:aspect-16/10 rounded-2xl overflow-hidden border border-stone-800 bg-stone-900 shadow-2xl">
                  <Image
                    src="/images/products/charbon-hexagonal-extrude.png"
                    alt="Briquettes de charbon de bois hexagonal extrudé avec trou central"
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 500px"
                  />
                  <div className="absolute bottom-3 left-3 right-3 bg-stone-950/90 border border-stone-800 backdrop-blur-sm p-3 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-stone-100">Trou Central Effet Cheminée</div>
                      <div className="text-[11px] text-stone-400">Allumage rapide et circulation d&apos;air continue</div>
                    </div>
                    <span className="text-amber-400 font-extrabold shrink-0">100% Bois Dur</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION GRILLE DES PRODUITS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-wider mb-1.5">
                <Award className="w-4 h-4" />
                <span>Nos Conditionnements &amp; Tarifs Directs</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-100 tracking-tight">
                Gamme Charbon Hexagonal &amp; Artisanal
              </h2>
            </div>
            <span className="text-xs text-stone-400 font-medium">
              {charcoalProducts.length} références disponibles en stock
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {charcoalProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>

        {/* SECTION GUIDE TECHNIQUE : POURQUOI CHOISIR LE CHARBON HEXAGONAL */}
        <section className="bg-stone-900 border-t border-b border-stone-800 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <span className="text-amber-500 text-xs font-bold uppercase tracking-wider">
                Expertise &amp; Rôtisserie
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-stone-100 mt-1">
                Pourquoi les Restaurateurs Préfèrent le Charbon Hexagonal Extrudé ?
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 mt-2">
                Comparé au charbon de bois classique en morceaux aléatoires, le charbon extrudé offre une régularité de braise et une rentabilité sans comparaison.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#1c1917] border border-stone-800 rounded-xl p-5">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
                  <Flame className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-stone-100 text-base mb-2">Autonomie Record (5h à 6h)</h4>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Grâce à une densité deux fois supérieure au bois brut, un seul chargement suffit pour tout un service de restauration ou une longue séance de fumage / cuisson lente.
                </p>
              </div>

              <div className="bg-[#1c1917] border border-stone-800 rounded-xl p-5">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
                  <Wind className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-stone-100 text-base mb-2">Zéro Fumée &amp; Goût Pur</h4>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Totalement exempt de goudrons, liants ou colles chimiques. La combustion ne dégage aucune odeur âcre, préservant ainsi la saveur authentique de vos viandes, poissons et légumes.
                </p>
              </div>

              <div className="bg-[#1c1917] border border-stone-800 rounded-xl p-5">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-stone-100 text-base mb-2">Économie de Consommation (-40%)</h4>
                <p className="text-xs text-stone-400 leading-relaxed">
                  La forme géométrique uniforme et la teneur élevée en carbone fixe (&gt; 85%) réduisent de 40% la masse de combustible nécessaire par rapport au charbon de bois standard.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION PROTOCOLE DE LIVRAISON */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16">
          <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-wider">
                <Truck className="w-4 h-4" />
                <span>Logistique &amp; Déchargement Scierie</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-stone-100">
                Livraison à Domicile ou Retrait Dépôt (-40€)
              </h3>
              <p className="text-xs sm:text-sm text-stone-400">
                Vos sacs ou palettes de charbon sont acheminés par camion avec chariot élévateur tout-terrain embarqué pour une dépose directe dans votre cour, abri ou garage.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/catalogue"
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 py-3 rounded-xl text-xs sm:text-sm transition-all shadow-md"
              >
                Voir tout le catalogue
              </Link>
              <Link
                href="/nos-depots"
                className="bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 font-bold px-4 py-3 rounded-xl text-xs sm:text-sm transition-all"
              >
                Nos 4 Dépôts Drive
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
