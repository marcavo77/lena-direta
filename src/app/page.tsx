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
  Award,
  ChevronRight,
  Ruler,
  Trees,
} from "lucide-react"

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
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-amber-500 selection:text-stone-950 font-sans">
      <Header />

      <main className="flex-1">
        {/* HERO SECTION ARTISANALE & SOLIDE (ZÉRO DÉGRADÉ) */}
        <section className="relative pt-12 pb-18 sm:pt-20 sm:pb-24 border-b border-stone-800 bg-stone-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              {/* Badge supérieur d'exploitant forestier */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-stone-900 border border-stone-800 text-stone-300 text-xs font-bold mb-6">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Négociant en Combustibles Bois • Humidité &lt; 20% H1 Contrôlée</span>
              </div>

              {/* Titre percutant en typographie solide */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] text-stone-100">
                Le Bois de Chauffage &amp; Granulés d&apos;Excellence,{" "}
                <span className="text-amber-500">
                  Déposés sous votre Abri.
                </span>
              </h1>

              {/* Sous-titre authentique */}
              <p className="mt-5 text-sm sm:text-lg text-stone-300 leading-relaxed max-w-2xl mx-auto">
                Chêne, charme et hêtre fendus et séchés sous abri ventilé pendant 2 ans. Livraison propre par camion avec <strong>chariot élévateur tout-terrain</strong> pour une dépose directe devant votre garage ou sous abri.
              </p>

              {/* Preuve sociale sobre et claire */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-stone-400">
                <div className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 px-3 py-1.5 rounded-md">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="font-bold text-stone-200">4.9 / 5</span>
                  <span>(2 840 avis clients vérifiés)</span>
                </div>

                <div className="flex items-center gap-1.5 text-stone-300 bg-stone-900 border border-stone-800 px-3 py-1.5 rounded-md">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Zéro palette abandonnée sur la rue</span>
                </div>
              </div>

              {/* Boutons d'action principaux solides */}
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5">
                <a
                  href="#catalogue"
                  className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-black px-7 py-4 rounded-lg transition-colors flex items-center justify-center gap-2.5 min-h-[50px] text-base active:scale-95 shadow-sm"
                >
                  <Flame className="w-5 h-5 fill-stone-950" />
                  <span>Commander mes stères de bois</span>
                </a>

                <a
                  href="#simulateur"
                  className="bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 font-bold px-7 py-4 rounded-lg transition-colors flex items-center justify-center gap-2 min-h-[50px] text-base"
                >
                  <span>Estimer ma consommation</span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </a>
              </div>
            </div>

            {/* VÉRIFICATEUR DE LIVRAISON SANS DÉGRADÉ */}
            <div id="livraison" className="mt-14 max-w-3xl mx-auto">
              <DeliveryChecker />
            </div>
          </div>
        </section>

        {/* SECTION LES 4 ENGAGEMENTS D'EXCELLENCE */}
        <section className="py-12 bg-stone-900 border-b border-stone-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-stone-950 border border-stone-800 p-5 rounded-xl flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-stone-900 border border-stone-800 text-amber-500 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-100 text-xs sm:text-sm">Humidité &lt; 20% H1</h4>
                  <p className="text-xs text-stone-400 mt-0.5">Séchage naturel sous abri 18-24 mois</p>
                </div>
              </div>

              <div className="bg-stone-950 border border-stone-800 p-5 rounded-xl flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-stone-900 border border-stone-800 text-amber-500 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-100 text-xs sm:text-sm">Chariot Tout-Terrain</h4>
                  <p className="text-xs text-stone-400 mt-0.5">Roule sur gravier, pelouse et allées</p>
                </div>
              </div>

              <div className="bg-stone-950 border border-stone-800 p-5 rounded-xl flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-stone-900 border border-stone-800 text-amber-500 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-100 text-xs sm:text-sm">Créneau Confirmé</h4>
                  <p className="text-xs text-stone-400 mt-0.5">Appel du chauffeur 30 min avant</p>
                </div>
              </div>

              <div className="bg-stone-950 border border-stone-800 p-5 rounded-xl flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-stone-900 border border-stone-800 text-amber-500 flex items-center justify-center shrink-0">
                  <Ruler className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-100 text-xs sm:text-sm">Cubage Contrôlé</h4>
                  <p className="text-xs text-stone-400 mt-0.5">Mesure certifiée selon la norme NF</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION CATALOGUE PRODUITS */}
        <section id="catalogue" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-amber-500 font-bold mb-2">
                <Trees className="w-4 h-4 text-amber-500" />
                <span>Tarifs Direct Exploitation Forestière</span>
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-stone-100 tracking-tight">
                Nos Combustibles en Stock
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 max-w-md">
              Palettes stables filmées et prêtes à empiler. Prix TTC livré avec manutention par chariot tout-terrain incluse.
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

        {/* SECTION LOGISTIQUE & DÉROULEMENT DE LIVRAISON SANS DÉGRADÉ */}
        <section className="bg-stone-900 py-16 sm:py-24 border-y border-stone-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <div className="text-xs uppercase tracking-widest text-amber-500 font-bold mb-2">
                Logistique Directe
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-stone-100">
                Comment se déroule votre livraison ?
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mt-2">
                Une dépose soignée et personnalisée là où vous stockez votre bois, pas sur la voie publique.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-stone-950 border border-stone-800 rounded-xl p-6">
                <div className="text-amber-500 font-black text-3xl mb-3">01</div>
                <h3 className="font-bold text-stone-100 text-lg mb-2">Prise de Rendez-Vous Précis</h3>
                <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                  Notre équipe logistique vous appelle pour convenir d&apos;une demi-journée exacte selon vos disponibilités.
                </p>
              </div>

              <div className="bg-stone-950 border border-stone-800 rounded-xl p-6">
                <div className="text-amber-500 font-black text-3xl mb-3">02</div>
                <h3 className="font-bold text-stone-100 text-lg mb-2">Chariot Tout-Terrain Embarqué</h3>
                <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                  Le camion porteur reste stationné dans la rue. Le livreur utilise son chariot motorisé pour franchir le portail, les gravillons ou la cour.
                </p>
              </div>

              <div className="bg-stone-950 border border-stone-800 rounded-xl p-6">
                <div className="text-amber-500 font-black text-3xl mb-3">03</div>
                <h3 className="font-bold text-stone-100 text-lg mb-2">Dépose au Pied de votre Abri</h3>
                <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                  La palette est déposée propre et intacte devant votre abri à bois ou dans votre garage. Zéro manutention pénible pour vous.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION AVIS CLIENTS VÉRIFIÉS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-stone-100">
              Retours d&apos;expérience de nos clients
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-2">
              Avis authentiques recueillis après livraison et contrôle hygrométrique à domicile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-stone-900 border border-stone-800 p-6 rounded-xl">
              <div className="flex text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-stone-300 italic mb-4 leading-relaxed">
                &ldquo;Vraiment du bois sec ! J&apos;ai testé avec mon humidimètre : 16.5% au cœur d&apos;une bûche de chêne. La flambée est vive, la vitre reste parfaitement propre.&rdquo;
              </p>
              <div className="text-xs font-bold text-stone-400">
                Jean-Marc B. — <span className="text-amber-500">77 Fontainebleau</span>
              </div>
            </div>

            <div className="bg-stone-900 border border-stone-800 p-6 rounded-xl">
              <div className="flex text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-stone-300 italic mb-4 leading-relaxed">
                &ldquo;Le chauffeur a été très pro. Mon allée fait 40 mètres en graviers : avec son chariot motorisé, les 3 palettes ont été déposées au fond sous le carport sans effort.&rdquo;
              </p>
              <div className="text-xs font-bold text-stone-400">
                Corinne D. — <span className="text-amber-500">78 Rambouillet</span>
              </div>
            </div>

            <div className="bg-stone-900 border border-stone-800 p-6 rounded-xl">
              <div className="flex text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-stone-300 italic mb-4 leading-relaxed">
                &ldquo;Granulés Din+ impeccables : zéro poussière au fond des sacs, combustion très propre, mon poêle n&apos;a pas fait un seul bourrage en 4 mois d&apos;utilisation.&rdquo;
              </p>
              <div className="text-xs font-bold text-stone-400">
                Philippe M. — <span className="text-amber-500">91 Évry</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION FOIRE AUX QUESTIONS (FAQ) */}
        <section className="bg-stone-900 border-t border-stone-800 py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-black text-stone-100">
                Questions Fréquentes
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mt-2">
                Tout ce que vous devez savoir avant de valider votre commande
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-stone-950 border border-stone-800 rounded-xl p-5">
                <h3 className="font-bold text-stone-100 text-sm sm:text-base mb-2">
                  Pourquoi 1 stère en 33 cm n&apos;occupe-t-il pas 1 m³ une fois rangé ?
                </h3>
                <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                  Le stère est historiquement défini comme 1 m³ de bûches coupées en 1 mètre. Lorsque ces bûches sont recoupées en 33 cm ou 25 cm, les morceaux s&apos;imbriquent plus étroitement et le vide entre les bûches diminue. Un stère de 33 cm occupe environ 0.7 m³, mais la quantité réelle de fibre de bois et l&apos;énergie calorifique fournie sont exactement les mêmes.
                </p>
              </div>

              <div className="bg-stone-950 border border-stone-800 rounded-xl p-5">
                <h3 className="font-bold text-stone-100 text-sm sm:text-base mb-2">
                  Comment garantissez-vous un taux d&apos;humidité inférieur à 20% ?
                </h3>
                <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                  Tout notre bois de chauffage est fendu dès l&apos;abattage puis stocké sur palettes aérées sous hangars ouverts ventilés pendant au moins 18 mois. Un contrôle hygrométrique au cœur de plusieurs bûches témoins est systématiquement effectué avant le chargement.
                </p>
              </div>

              <div className="bg-stone-950 border border-stone-800 rounded-xl p-5">
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

      {/* BARRE FIXE COLLANTE MOBILE SOUS LE POUCE (SOLIDE, SANS DÉGRADÉ) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 sm:hidden bg-stone-950 border-t border-stone-800 p-3 flex items-center justify-between gap-3 shadow-xl">
        <a
          href="tel:0189000000"
          className="flex-1 min-h-[46px] bg-stone-900 border border-stone-800 text-stone-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95"
        >
          <PhoneCall className="w-4 h-4 text-amber-500" />
          <span>Conseil direct</span>
        </a>

        <a
          href="#catalogue"
          className="flex-[1.5] min-h-[46px] bg-amber-500 text-stone-950 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 active:scale-95"
        >
          <Flame className="w-4 h-4 fill-stone-950" />
          <span>Voir le bois &amp; tarifs</span>
        </a>
      </div>
    </div>
  )
}
