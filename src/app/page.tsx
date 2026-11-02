import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/shop/ProductCard"
import { StereCalculator } from "@/components/shop/StereCalculator"
import { DeliveryChecker } from "@/components/shop/DeliveryChecker"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import Image from "next/image"
import Link from "next/link"
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
  Warehouse,
  ArrowRight,
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
        {/* ================= HERO SECTION INSPIRÉE DE BRAZECO (Captures 1 & 3) ================= */}
        <section className="pt-4 pb-12 sm:pt-6 sm:pb-16 bg-[#121110] border-b border-stone-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
            {/* 1. Grande Bannière Producteur Français (Téléchargée par l'utilisateur) */}
            <div className="relative w-full rounded-2xl overflow-hidden border border-stone-800 bg-[#c2410c] shadow-xl">
              <div className="relative h-44 sm:h-64 md:h-72 lg:h-80 w-full">
                <Image
                  src="/images/hero-banner.jpeg"
                  alt="Producteur et distributeur français de bûches compressées, bois de chauffage et granulés"
                  fill
                  priority
                  className="object-cover object-center"
                />
              </div>
            </div>

            {/* 2. Titre d'accroche Spécialiste */}
            <div className="text-center max-w-3xl mx-auto pt-2">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-stone-100 tracking-tight">
                LenaDireta, spécialiste du bois de chauffage
              </h1>
              <p className="mt-2.5 text-xs sm:text-base text-stone-400 font-medium">
                Nos combustibles 100% naturels pour une énergie renouvelable, un haut pouvoir calorifique et un séchage certifié.
              </p>
            </div>

            {/* 3. Les 4 Cartes Catégories Clés (Inspirées des captures 1 & 3) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
              {/* Carte 1 : Bois compressé */}
              <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-3.5 sm:p-5 flex flex-col items-center justify-between hover:border-amber-500/50 transition-all group">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-stone-900 border border-stone-800 mb-3 sm:mb-4">
                  <Image
                    src="/images/products/buches-compressees.jpg"
                    alt="Bois compressé"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-stone-950/80 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase px-2 py-0.5 rounded">
                    100% Chêne
                  </div>
                </div>
                <Link
                  href="/catalogue"
                  className="w-full text-center bg-[#ea580c] hover:bg-[#c2410c] active:scale-95 text-white font-bold py-2.5 sm:py-3 px-3 rounded-full text-xs sm:text-sm tracking-wide transition-colors shadow-sm min-h-[44px] flex items-center justify-center"
                >
                  Bois compressé
                </Link>
              </div>

              {/* Carte 2 : Bois de chauffage */}
              <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-3.5 sm:p-5 flex flex-col items-center justify-between hover:border-amber-500/50 transition-all group">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-stone-900 border border-stone-800 mb-3 sm:mb-4">
                  <Image
                    src="/images/products/chene-charme-33cm.jpg"
                    alt="Bois de chauffage"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-stone-950/80 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase px-2 py-0.5 rounded">
                    &lt; 20% H1
                  </div>
                </div>
                <Link
                  href="/catalogue"
                  className="w-full text-center bg-[#ea580c] hover:bg-[#c2410c] active:scale-95 text-white font-bold py-2.5 sm:py-3 px-3 rounded-full text-xs sm:text-sm tracking-wide transition-colors shadow-sm min-h-[44px] flex items-center justify-center"
                >
                  Bois de chauffage
                </Link>
              </div>

              {/* Carte 3 : Granulés de bois */}
              <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-3.5 sm:p-5 flex flex-col items-center justify-between hover:border-amber-500/50 transition-all group">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-stone-900 border border-stone-800 mb-3 sm:mb-4">
                  <Image
                    src="/images/products/pellets-din-plus.jpg"
                    alt="Granulés de bois"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-stone-950/80 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase px-2 py-0.5 rounded">
                    Din+ / EnPlus
                  </div>
                </div>
                <Link
                  href="/catalogue"
                  className="w-full text-center bg-[#ea580c] hover:bg-[#c2410c] active:scale-95 text-white font-bold py-2.5 sm:py-3 px-3 rounded-full text-xs sm:text-sm tracking-wide transition-colors shadow-sm min-h-[44px] flex items-center justify-center"
                >
                  Granulés de bois
                </Link>
              </div>

              {/* Carte 4 : Livraison Tout-Terrain & Dépôts */}
              <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-3.5 sm:p-5 flex flex-col items-center justify-between hover:border-amber-500/50 transition-all group">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-stone-900 border border-stone-800 mb-3 sm:mb-4">
                  <Image
                    src="/images/livraison-camion.jpg"
                    alt="Livraison tout-terrain camion 19T"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-stone-950/80 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase px-2 py-0.5 rounded">
                    Camion 19T + Chariot
                  </div>
                </div>
                <Link
                  href="/livraison-et-acces"
                  className="w-full text-center bg-[#ea580c] hover:bg-[#c2410c] active:scale-95 text-white font-bold py-2.5 sm:py-3 px-3 rounded-full text-xs sm:text-sm tracking-wide transition-colors shadow-sm min-h-[44px] flex items-center justify-center"
                >
                  Livraison &amp; Dépôts
                </Link>
              </div>
            </div>

            {/* 4. Vérificateur d'éligibilité et de frais de livraison par code postal */}
            <div id="livraison" className="pt-4 max-w-3xl mx-auto">
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
                  <p className="text-xs text-stone-400 mt-0.5">Prise de RDV téléphonique préalable</p>
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

        {/* SECTION CATALOGUE PRINCIPAL */}
        <section id="catalogue" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-wider mb-2">
                <Flame className="w-4 h-4 fill-amber-500" />
                <span>Sélection d&apos;Exploitant</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-100">
                Nos Combustibles Premium
              </h2>
              <p className="text-stone-400 text-xs sm:text-sm mt-1 max-w-xl">
                Conditionnés sur palettes stables ou en filets aérés pour préserver une combustion sans fumée et un rendement calorifique maximal.
              </p>
            </div>

            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-wider"
            >
              <span>Voir tout le catalogue</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {productList.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* SECTION CALCULATEUR DE STÈRES */}
        <section id="simulateur" className="py-16 bg-[#171514] border-t border-b border-stone-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-amber-500 font-bold text-xs uppercase tracking-wider">
                Outil d&apos;Estimation Scierie
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-100 mt-1">
                Calculateur de Besoins en Stères
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mt-2">
                Ajustez votre surface et vos habitudes pour connaître le cubage exact nécessaire pour passer l&apos;hiver en toute sérénité.
              </p>
            </div>

            <StereCalculator />
          </div>
        </section>

        {/* SECTION LIVRAISON PROTOCOLE CAMION 19T */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-6 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-amber-500 font-bold text-xs uppercase tracking-wider">
                  Logistique Maîtrisée
                </span>
                <h3 className="text-xl sm:text-3xl font-bold text-stone-100 mt-1">
                  Protocole de Livraison &amp; Chariot Tout-Terrain
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 mt-3 leading-relaxed">
                  Contrairement aux transporteurs classiques qui abandonnent les palettes de 1 200 kg sur le trottoir, nos camions porteurs 19T sont munis d&apos;un chariot élévateur tout-terrain capable de rouler sur gravier et gazon sec pour déposer votre commande directement devant votre garage ou sous votre abri de jardin.
                </p>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-stone-200">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>Largeur d&apos;accès requise : au moins 2,80 m</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-stone-200">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>Pente maximale carrossable : jusqu&apos;à 12%</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-stone-200">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>Prise de rendez-vous téléphonique sous 24h à 48h</span>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    href="/livraison-et-acces"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300"
                  >
                    <span>Consulter le guide complet d'accessibilité</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="relative aspect-video rounded-xl overflow-hidden border border-stone-800 bg-stone-900">
                <Image
                  src="/images/livraison-camion.jpg"
                  alt="Chariot élévateur tout-terrain transportant une palette de bois au garage"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION AVIS CLIENTS VÉRIFIÉS */}
        <section className="py-16 bg-[#141312] border-t border-b border-stone-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-amber-500 font-bold text-xs uppercase tracking-wider">
                Retours d&apos;Expérience
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-100 mt-1">
                Ils se chauffent avec LenaDireta
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mt-1">
                Avis 100% authentiques recueillis après déchargement et contrôle humidimètre.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-stone-900 border border-stone-800 p-6 rounded-xl">
                <div className="flex text-amber-500 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-stone-300 leading-relaxed italic">
                  &ldquo;Chêne bien fendu et réellement sec. Testé avec mon propre humidimètre à la livraison : 16% d&apos;humidité au cœur ! Le chauffeur a rentré les deux palettes sous mon auvent grâce à son chariot tout-terrain. Parfait.&rdquo;
                </p>
                <div className="mt-4 pt-3 border-t border-stone-800 flex justify-between items-center text-[11px]">
                  <span className="font-bold text-stone-200">Gérard L. (77 - Seine-et-Marne)</span>
                  <span className="text-stone-400">Commande 3 stères 33cm</span>
                </div>
              </div>

              <div className="bg-stone-900 border border-stone-800 p-6 rounded-xl">
                <div className="flex text-amber-500 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-stone-300 leading-relaxed italic">
                  &ldquo;Pellets Din+ de très grande qualité. Très peu de poussière au fond des sacs et quasiment pas de mâchefer dans le creuset de mon poêle. Livraison à l&apos;heure avec prise de rendez-vous téléphonique la veille.&rdquo;
                </p>
                <div className="mt-4 pt-3 border-t border-stone-800 flex justify-between items-center text-[11px]">
                  <span className="font-bold text-stone-200">Claire M. (91 - Essonne)</span>
                  <span className="text-stone-400">Palette 66 sacs Pellets</span>
                </div>
              </div>

              <div className="bg-stone-900 border border-stone-800 p-6 rounded-xl">
                <div className="flex text-amber-500 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-stone-300 leading-relaxed italic">
                  &ldquo;Le simulateur de stères m&apos;a recommandé 6 stères pour notre maison en pierre de 140 m². Après un hiver rigoureux, le calcul était pile exact. Nous recommandons les yeux fermés.&rdquo;
                </p>
                <div className="mt-4 pt-3 border-t border-stone-800 flex justify-between items-center text-[11px]">
                  <span className="font-bold text-stone-200">Marc &amp; Sophie D. (78 - Yvelines)</span>
                  <span className="text-stone-400">Feuillus durs 50cm</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION FAQ MÉTIER */}
        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-amber-500 font-bold text-xs uppercase tracking-wider">
              Questions Fréquentes
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-100 mt-1">
              Tout savoir avant de commander
            </h2>
          </div>

          <div className="space-y-4">
            <details className="group bg-stone-900 border border-stone-800 rounded-xl p-5 text-xs sm:text-sm cursor-pointer [&_summary::-webkit-details-marker]:hidden">
              <summary className="font-bold text-stone-100 flex justify-between items-center list-none">
                <span>Comment mesurer le taux d&apos;humidité du bois ?</span>
                <span className="text-amber-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-stone-400 mt-3 text-xs leading-relaxed">
                Le contrôle s&apos;effectue en fendant une bûche en deux et en appliquant les deux pointes d&apos;un humidimètre numérique calibré au centre de la fente fraîche. Un bois H1 prêt à l&apos;emploi doit afficher moins de 20%. Tous nos lots sont contrôlés avant chargement.
              </p>
            </details>

            <details className="group bg-stone-900 border border-stone-800 rounded-xl p-5 text-xs sm:text-sm cursor-pointer [&_summary::-webkit-details-marker]:hidden">
              <summary className="font-bold text-stone-100 flex justify-between items-center list-none">
                <span>Que signifie la conversion stère vers m³ ?</span>
                <span className="text-amber-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-stone-400 mt-3 text-xs leading-relaxed">
                Un stère équivaut à 1 m³ de bûches coupées en 1 mètre. Lorsque les bûches sont recoupées en 33 cm, les vides entre les morceaux diminuent et le volume rangé apparent passe à environ 0,7 m³. La masse de bois et le pouvoir calorifique restent identiques.
              </p>
            </details>

            <details className="group bg-stone-900 border border-stone-800 rounded-xl p-5 text-xs sm:text-sm cursor-pointer [&_summary::-webkit-details-marker]:hidden">
              <summary className="font-bold text-stone-100 flex justify-between items-center list-none">
                <span>Puis-je choisir le jour de ma livraison ?</span>
                <span className="text-amber-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-stone-400 mt-3 text-xs leading-relaxed">
                Oui. Lors du passage de votre commande ou lors du contact téléphonique du transporteur sous 24-48h, vous convenez d&apos;une date de livraison et d&apos;une demi-journée selon vos disponibilités.
              </p>
            </details>
          </div>
        </section>
      </main>

      <Footer />

      {/* BARRE D'ACTION COLLANTE SUR MOBILE (STICKY BOTTOM BAR MOBILE-FIRST) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-950/95 border-t border-stone-800 p-3 flex items-center justify-between gap-3 shadow-2xl backdrop-blur-sm">
        <div>
          <span className="block text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
            Bois de chauffe H1
          </span>
          <span className="text-sm font-bold text-amber-500">
            Dès 399 € / palette
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="tel:0189000000"
            className="w-11 h-11 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-amber-500 shrink-0"
            aria-label="Appeler le service client"
          >
            <PhoneCall className="w-4 h-4" />
          </a>

          <Link
            href="/catalogue"
            className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2.5 rounded-lg text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors min-h-[44px]"
          >
            <span>Commander</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
