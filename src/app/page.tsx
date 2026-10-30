import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/shop/ProductCard"
import { StereCalculator } from "@/components/shop/StereCalculator"
import { DeliveryChecker } from "@/components/shop/DeliveryChecker"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import {
  Flame,
  ShieldCheck,
  Truck,
  Star,
  CheckCircle2,
  PhoneCall,
  Clock,
  Sparkles,
  HelpCircle,
  Award,
  ChevronRight,
  TrendingDown,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const supabase = await createClient()

  // Récupération des combustibles actifs
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
        {/* HERO SECTION HAUT DE GAMME */}
        <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-stone-800/80">
          {/* Lueur d'ambiance braise */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-gradient-to-b from-amber-600/15 via-amber-700/5 to-transparent blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              {/* Badge supérieur de confiance */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-6 shadow-xl">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Fournisseur N°1 Direct Producteur • Bois Sec &lt; 20% Garanti</span>
              </div>

              {/* Titre percutant */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.12] text-stone-100">
                Le Bois de Chauffage &amp; Granulés d&apos;Excellence,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">
                  Déposés sous votre Abri.
                </span>
              </h1>

              {/* Sous-titre */}
              <p className="mt-5 text-sm sm:text-lg text-stone-300 leading-relaxed max-w-2xl mx-auto">
                Chêne, charme et hêtre durs séchés sous abri ventilé pendant 2 ans. Livraison soignée avec camion 19T et <strong>chariot élévateur tout-terrain</strong> pour une dépose directe devant votre garage.
              </p>

              {/* Éléments de preuve sociale */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-stone-400">
                <div className="flex items-center gap-1.5 bg-stone-900/80 border border-stone-800 px-3 py-1.5 rounded-full">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="font-bold text-stone-200">4.9 / 5</span>
                  <span>(2 840+ avis vérifiés)</span>
                </div>

                <div className="flex items-center gap-1.5 text-stone-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Zéro palette abandonnée sur le trottoir</span>
                </div>
              </div>

              {/* Boutons d'action principaux (Mobile-First >= 48px) */}
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5">
                <a
                  href="#catalogue"
                  className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-black px-7 py-4 rounded-xl shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2.5 min-h-[50px] text-base active:scale-95"
                >
                  <Flame className="w-5 h-5 fill-stone-950" />
                  <span>Commander mes stères de bois</span>
                </a>

                <a
                  href="#simulateur"
                  className="bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700/80 font-bold px-7 py-4 rounded-xl transition-all flex items-center justify-center gap-2 min-h-[50px] text-base"
                >
                  <span>Estimer ma consommation</span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </a>
              </div>
            </div>

            {/* VÉRIFICATEUR DE LIVRAISON DIRECT DANS LE HERO */}
            <div id="livraison" className="mt-14 max-w-3xl mx-auto">
              <DeliveryChecker />
            </div>
          </div>
        </section>

        {/* SECTION LES 4 ENGAGEMENTS D'EXCELLENCE */}
        <section className="py-12 bg-stone-900/40 border-b border-stone-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-stone-950/80 border border-stone-800/80 p-4 sm:p-5 rounded-2xl flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-100 text-xs sm:text-sm">Humidité &lt; 20% H1</h4>
                  <p className="text-[11px] text-stone-400 mt-0.5">Séchage naturel sous abri 18-24 mois</p>
                </div>
              </div>

              <div className="bg-stone-950/80 border border-stone-800/80 p-4 sm:p-5 rounded-2xl flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-100 text-xs sm:text-sm">Chariot Tout-Terrain</h4>
                  <p className="text-[11px] text-stone-400 mt-0.5">Roule sur gravier, herbe et pavés</p>
                </div>
              </div>

              <div className="bg-stone-950/80 border border-stone-800/80 p-4 sm:p-5 rounded-2xl flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-100 text-xs sm:text-sm">Créneau Fixé à l&apos;Avance</h4>
                  <p className="text-[11px] text-stone-400 mt-0.5">Appel du chauffeur 30 min avant</p>
                </div>
              </div>

              <div className="bg-stone-950/80 border border-stone-800/80 p-4 sm:p-5 rounded-2xl flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-100 text-xs sm:text-sm">Cubage Garanti</h4>
                  <p className="text-[11px] text-stone-400 mt-0.5">Palettes certifiées sans vide</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION CATALOGUE PRODUITS */}
        <section id="catalogue" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-amber-500 font-extrabold mb-2">
                <Flame className="w-3.5 h-3.5 fill-amber-500" />
                <span>Tarifs Direct Producteur</span>
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-stone-100 tracking-tight">
                Nos Combustibles en Stock
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 max-w-md">
              Palettes stables filmées et prêtes à ranger. Prix TTC avec livraison personnalisée par créneau téléphonique.
            </p>
          </div>

          {/* Grille de cartes produits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {productList.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* SECTION SIMULATEUR DE STÈRES & CUBAGE */}
        <section id="simulateur" className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <StereCalculator />
        </section>

        {/* SECTION LOGISTIQUE & DÉROULEMENT DE LIVRAISON */}
        <section className="bg-gradient-to-b from-stone-900/60 to-stone-950 py-16 sm:py-24 border-y border-stone-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <div className="text-xs uppercase tracking-widest text-amber-500 font-bold mb-2">
                Logistique Sans Stress
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-stone-100">
                Comment se déroule votre livraison ?
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mt-2">
                Oubliez les livreurs qui abandonnent 4 palettes sur le trottoir public : découvrez notre protocole de dépose propre.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-stone-950 border border-stone-800 rounded-2xl p-6 relative">
                <div className="text-amber-500 font-black text-4xl mb-4 opacity-40">01</div>
                <h3 className="font-bold text-stone-100 text-lg mb-2">Prise de Rendez-Vous Précis</h3>
                <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                  Notre service logistique vous contacte par téléphone dès la commande pour fixer une demi-journée de livraison compatible avec votre planning.
                </p>
              </div>

              <div className="bg-stone-950 border border-stone-800 rounded-2xl p-6 relative">
                <div className="text-amber-500 font-black text-4xl mb-4 opacity-40">02</div>
                <h3 className="font-bold text-stone-100 text-lg mb-2">Chariot Embarqué Tout-Terrain</h3>
                <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                  Le camion 19T reste stationné sans gêner la circulation. Le chauffeur décharge votre palette avec son chariot motorisé à trois roues larges.
                </p>
              </div>

              <div className="bg-stone-950 border border-stone-800 rounded-2xl p-6 relative">
                <div className="text-amber-500 font-black text-4xl mb-4 opacity-40">03</div>
                <h3 className="font-bold text-stone-100 text-lg mb-2">Dépose au Pied de votre Abri</h3>
                <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                  Gravier, allée en pavés, pelouse sèche ou fond de garage : la palette est déposée exactement là où vous devez ranger votre bois.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION AVIS CLIENTS VÉRIFIÉS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-stone-100">
              Ce que disent nos clients chauffés au bois
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-2">
              Avis 100% certifiés après livraison et contrôle hygrométrique à réception.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-stone-900/80 border border-stone-800 p-6 rounded-2xl">
              <div className="flex text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-stone-300 italic mb-4 leading-relaxed">
                &ldquo;Vraiment du bois sec ! J&apos;ai testé avec mon humidimètre à pointes : 16.5% au cœur d&apos;une bûche de chêne. La flambée est vive, la vitre reste parfaitement propre.&rdquo;
              </p>
              <div className="text-xs font-semibold text-stone-400">
                Jean-Marc B. — <span className="text-amber-400">77 Fontainebleau</span>
              </div>
            </div>

            <div className="bg-stone-900/80 border border-stone-800 p-6 rounded-2xl">
              <div className="flex text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-stone-300 italic mb-4 leading-relaxed">
                &ldquo;Le chauffeur a été formidable. Mon allée fait 40 mètres en graviers : avec son chariot motorisé, les 3 palettes ont été déposées au fond sous le carport sans aucun effort.&rdquo;
              </p>
              <div className="text-xs font-semibold text-stone-400">
                Corinne D. — <span className="text-amber-400">78 Rambouillet</span>
              </div>
            </div>

            <div className="bg-stone-900/80 border border-stone-800 p-6 rounded-2xl">
              <div className="flex text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-stone-300 italic mb-4 leading-relaxed">
                &ldquo;Granulés Din+ impeccables : zéro poussière au fond des sacs, granulométrie constante, mon poêle à granulés n&apos;a pas fait un seul bourrage en 4 mois d&apos;utilisation.&rdquo;
              </p>
              <div className="text-xs font-semibold text-stone-400">
                Philippe M. — <span className="text-amber-400">91 Évry</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION FOIRE AUX QUESTIONS (FAQ) */}
        <section className="bg-stone-900/40 border-t border-stone-800 py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-black text-stone-100">
                Questions Fréquentes
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mt-2">
                Tout ce que vous devez savoir avant de valider votre commande de bois
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-stone-950 border border-stone-800 rounded-2xl p-5">
                <h3 className="font-bold text-stone-100 text-sm sm:text-base mb-2">
                  Pourquoi 1 stère en 33 cm n&apos;occupe-t-il pas 1 m³ une fois rangé ?
                </h3>
                <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                  Le stère est historiquement défini comme 1 m³ de bûches coupées en 1 mètre. Lorsque ces bûches sont recoupées en 33 cm ou 25 cm, les morceaux s&apos;imbriquent plus étroitement et le vide entre les bûches diminue. Un stère de 33 cm occupe environ 0.7 m³, mais la quantité réelle de fibre de bois et l&apos;énergie calorifique fournie sont exactement les mêmes.
                </p>
              </div>

              <div className="bg-stone-950 border border-stone-800 rounded-2xl p-5">
                <h3 className="font-bold text-stone-100 text-sm sm:text-base mb-2">
                  Comment garantissez-vous un taux d&apos;humidité inférieur à 20% ?
                </h3>
                <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                  Tout notre bois de chauffage est fendu dès l&apos;abattage puis stocké sur palettes aérées sous hangars ouverts ventilés pendant au moins 18 mois. Un contrôle hygrométrique au cœur de plusieurs bûches témoins est systématiquement effectué avant le chargement.
                </p>
              </div>

              <div className="bg-stone-950 border border-stone-800 rounded-2xl p-5">
                <h3 className="font-bold text-stone-100 text-sm sm:text-base mb-2">
                  Quelles sont les dimensions requises pour le passage du chariot ?
                </h3>
                <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                  Notre chariot tout-terrain nécessite une largeur de passage minimale de <strong>2,20 mètres</strong> et une hauteur libre de <strong>2,50 mètres</strong>. Il franchit facilement les bordures jusqu&apos;à 15 cm, les gravillons et les sols en terre battue ou pelouse ferme.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* BARRE FIXE COLLANTE MOBILE SOUS LE POUCE (STICKY ACTION BAR) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 sm:hidden bg-stone-950/95 backdrop-blur-md border-t border-stone-800 p-3 flex items-center justify-between gap-3 shadow-2xl">
        <a
          href="tel:0189000000"
          className="flex-1 min-h-[46px] bg-stone-900 border border-stone-700 text-stone-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95"
        >
          <PhoneCall className="w-4 h-4 text-amber-500" />
          <span>Appeler conseil</span>
        </a>

        <a
          href="#catalogue"
          className="flex-[1.5] min-h-[46px] bg-amber-500 text-stone-950 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95"
        >
          <Flame className="w-4 h-4 fill-stone-950" />
          <span>Voir les bois &amp; tarifs</span>
        </a>
      </div>
    </div>
  )
}
