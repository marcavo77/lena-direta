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
  Utensils,
  Thermometer,
} from "lucide-react"

export const metadata = {
  title: "Poêles à Bois avec Four de Cuisson & Granulés | LeñaDirecta",
  description:
    "Découvrez nos poêles à bois avec four intégré, poêles scandinaves en fonte et poêles à granulés étanches WiFi. Haute efficacité Flamme Verte 7 étoiles et EcoDesign 2022. Livraison sur palette sécurisée.",
}

// Cache CDN Vercel instantané & régénération en arrière-plan
export const revalidate = 60

export default async function PoelesABoisPage() {
  const allProducts = await getAllProducts()
  const stoveProducts = allProducts.filter((p) => p.category === "poeles")

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
              <span className="text-stone-200">Poêles à Bois &amp; Cuisinières avec Four</span>
            </nav>
          </div>
        </div>

        {/* HERO SECTION DE LA CATÉGORIE POÊLES */}
        <section className="relative overflow-hidden bg-[#171514] border-b border-stone-800 py-10 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Colonne Gauche : Argumentaire & Titre */}
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 border border-amber-500/40 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <Utensils className="w-3.5 h-3.5 text-amber-500" />
                  <span>Chauffage Haute Performance &amp; Four de Cuisson</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-100 tracking-tight leading-tight">
                  Poêles à Bois avec Four &amp; Appareils de Chauffage
                </h1>

                <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                  Alliez le plaisir d&apos;une flambée chaleureuse et la saveur inimitable de la cuisine au feu de bois.
                  Nos poêles en fonte et acier réfractaire intègrent un four de cuisson supérieur vitré avec thermomètre de précision,
                  assurant un chauffage autonome économique et des plats mijotés parfaits.
                </p>

                {/* 4 Puces Métier Fortes */}
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-bold text-stone-300">
                  <div className="flex items-center gap-2 bg-stone-900/90 border border-stone-800 p-2.5 rounded-lg">
                    <Thermometer className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Four supérieur vitré &amp; thermomètre</span>
                  </div>
                  <div className="flex items-center gap-2 bg-stone-900/90 border border-stone-800 p-2.5 rounded-lg">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Norme EcoDesign 2022 &amp; Flamme Verte</span>
                  </div>
                  <div className="flex items-center gap-2 bg-stone-900/90 border border-stone-800 p-2.5 rounded-lg">
                    <Flame className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Rendement certifié &gt; 80%</span>
                  </div>
                  <div className="flex items-center gap-2 bg-stone-900/90 border border-stone-800 p-2.5 rounded-lg">
                    <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Livraison sur palette caissée</span>
                  </div>
                </div>
              </div>

              {/* Colonne Droite : Visuel du Poêle avec Four en Situation Réelle */}
              <div className="lg:col-span-5">
                <div className="relative aspect-4/5 rounded-2xl overflow-hidden border border-stone-800 bg-stone-900 shadow-2xl">
                  <Image
                    src="/images/products/poele-a-bois-avec-four-gourmet.jpg"
                    alt="Poêle à bois avec four intégré en fonctionnement avec flammes vives"
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 500px"
                  />
                  <div className="absolute bottom-3 left-3 right-3 bg-stone-950/90 border border-stone-800 backdrop-blur-sm p-3.5 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-stone-100">Foyer Chauffage + Four Supérieur</div>
                      <div className="text-[11px] text-stone-400">Pains, gratins, pizzas &amp; chaleur douce</div>
                    </div>
                    <span className="text-amber-400 font-extrabold shrink-0 bg-stone-900 border border-amber-500/30 px-2 py-1 rounded">
                      9 à 11 kW
                    </span>
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
                <span>Nos Modèles &amp; Tarifs Directs</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-100 tracking-tight">
                Gamme Poêles à Bois, Cuisinières &amp; Granulés
              </h2>
            </div>
            <span className="text-xs text-stone-400 font-medium">
              {stoveProducts.length} modèles disponibles
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {stoveProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>

        {/* SECTION LES AVANTAGES DU POÊLE AVEC FOUR */}
        <section className="bg-stone-900 border-t border-b border-stone-800 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <span className="text-amber-500 text-xs font-bold uppercase tracking-wider">
                Confort &amp; Autonomie
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-stone-100 mt-1">
                Pourquoi Choisir un Poêle à Bois avec Four Intégré ?
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 mt-2">
                Le compromis parfait entre l&apos;indépendance énergétique et l&apos;art culinaire au feu de bois traditionnel.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#1c1917] border border-stone-800 rounded-xl p-5">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
                  <Utensils className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-stone-100 text-base mb-2">Cuisine Économique 2-en-1</h4>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Profitez de la chaleur de vos bûches pour faire cuire vos plats sans dépenser un seul kilowatt d&apos;électricité. Idéal pour les cuissons lentes et savoureuses.
                </p>
              </div>

              <div className="bg-[#1c1917] border border-stone-800 rounded-xl p-5">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-stone-100 text-base mb-2">Double Combustion Écologique</h4>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Les gaz issus du bois sont réinjectés et brûlés dans une seconde chambre, atteignant un rendement supérieur à 80% avec des rejets de particules ultra-faibles conformes EcoDesign 2022.
                </p>
              </div>

              <div className="bg-[#1c1917] border border-stone-800 rounded-xl p-5">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-stone-100 text-base mb-2">Inertie Thermique Fonte</h4>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Les composants en fonte massive et doublage vermiculite emmagasinent la chaleur pour la restituer doucement et régulièrement dans toute la maison.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION COMBUSTIBLES ASSOCIÉS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16">
          <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-wider">
                <Truck className="w-4 h-4" />
                <span>Commandez Votre Bois Sec avec Votre Poêle</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-stone-100">
                Bûches 33cm et 50cm Séchées sous Abri (&lt; 20% H1)
              </h3>
              <p className="text-xs sm:text-sm text-stone-400">
                Alimentez votre nouvel appareil avec nos stères de chêne, charme et hêtre garantis prêts à l&apos;emploi pour un tirage parfait sans encrassement de vitre.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/bois-de-chauffage"
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 py-3 rounded-xl text-xs sm:text-sm transition-all shadow-md"
              >
                Voir nos bûches de bois
              </Link>
              <Link
                href="/granules-de-bois"
                className="bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 font-bold px-4 py-3 rounded-xl text-xs sm:text-sm transition-all"
              >
                Granulés Din+
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
