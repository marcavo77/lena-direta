import { getPublicSupabase } from "@/lib/supabase/public"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Footer } from "@/components/layout/Footer"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { LanguageSelector } from "@/components/layout/LanguageSelector"
import { ProductPurchaseBox } from "@/components/shop/ProductPurchaseBox"
import { StickyProductBar } from "@/components/mobile/StickyProductBar"
import { DeliveryChecker } from "@/components/shop/DeliveryChecker"
import { ProductCard } from "@/components/shop/ProductCard"
import { formatPrice } from "@/lib/utils"
import {
  ChevronRight,
  ShieldCheck,
  Truck,
  Droplet,
  Trees,
  Award,
  Flame,
  CheckCircle2,
  Info,
  Ruler,
  HelpCircle,
} from "lucide-react"

// Cache CDN Vercel instantané & régénération en arrière-plan
export const revalidate = 60

export async function generateStaticParams() {
  try {
    const supabase = getPublicSupabase()
    const { data: products } = await supabase.from("products").select("slug")
    if (products && products.length > 0) {
      return products.map((p) => ({ slug: p.slug }))
    }
  } catch (error) {
    console.warn("Could not fetch slugs from Supabase during build:", error)
  }

  return [
    { slug: "chene-charme-33cm-palette-3-steres" },
    { slug: "chene-hetre-50cm-palette-4-steres" },
    { slug: "bois-de-chauffage-25cm-palette-2-steres" },
    { slug: "buches-compressees-jour-palette-96-packs" },
    { slug: "buches-compressees-nuit-pack-96-packs" },
    { slug: "paves-bois-compresse-100-chene-palette" },
    { slug: "pellets-granules-din-plus-palette-66-sacs" },
    { slug: "granules-vrac-camion-souffleur-tonne" },
    { slug: "allume-feu-naturel-laine-bois-carton-300" },
    { slug: "filets-buchettes-allumage-ecologique-10-filets" },
  ]
}

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params
  const supabase = getPublicSupabase()

  const { data: product } = await supabase
    .from("products")
    .select("name, short_description")
    .eq("slug", slug)
    .single()

  if (!product) {
    return { title: "Produit non trouvé | LeñaDirecta" }
  }

  return {
    title: `${product.name} | LeñaDirecta`,
    description: product.short_description || "Bois de chauffage et granulés premium livrés à domicile.",
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params
  const supabase = getPublicSupabase()

  // 1. Fetch produit principal
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!product) {
    notFound()
  }

  // 2. Fetch produits recommandés / complémentaires
  const { data: relatedProducts } = await supabase
    .from("products")
    .select("*")
    .neq("slug", slug)
    .limit(3)

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      <main className="flex-1 pb-20 sm:pb-12">
        {/* Fil d'Ariane & Bascule Thème (Sans Header pour focus achat direct) */}
        <div className="bg-stone-900 border-b border-stone-800 py-3 sm:py-3.5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
            <nav className="flex items-center gap-2 text-xs text-stone-400 font-medium overflow-hidden">
              <Link href="/" className="hover:text-amber-400 transition-colors shrink-0">
                Accueil
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-stone-600 shrink-0" />
              <Link href="/catalogue" className="hover:text-amber-400 transition-colors shrink-0">
                Catalogue
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-stone-600 shrink-0" />
              <span className="text-stone-200 truncate">{product.name}</span>
            </nav>
            <div className="shrink-0 flex items-center gap-2">
              <ThemeToggle />
              <LanguageSelector />
            </div>
          </div>
        </div>

        {/* Section Principale Fiche Produit (2 colonnes) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Colonne Gauche : Photos & Badges de Qualité (7 colonnes) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-stone-900 border border-stone-800">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />

                {product.badge && (
                  <div className="absolute top-4 left-4 bg-stone-950/90 border border-stone-700 text-stone-100 text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wider backdrop-blur-sm shadow-md">
                    {product.badge}
                  </div>
                )}

                {product.humidity_rate && (
                  <div className="absolute bottom-4 left-4 bg-stone-950/90 border border-stone-700 text-stone-100 text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-2 shadow-lg backdrop-blur-sm">
                    <Droplet className="w-4 h-4 text-sky-400 fill-sky-400 shrink-0" />
                    <span className="text-stone-100 font-bold">
                      Taux d&apos;humidité contrôlé : &lt; {product.humidity_rate}% H1
                    </span>
                  </div>
                )}
              </div>

              {/* 3 Garanties Sous la Photo */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-3.5 text-center">
                  <Award className="w-5 h-5 text-amber-500 mx-auto mb-1.5" />
                  <div className="text-xs font-bold text-stone-200">Norme NF H1</div>
                  <div className="text-[11px] text-stone-400 mt-0.5">Prêt à brûler direct</div>
                </div>

                <div className="bg-stone-900 border border-stone-800 rounded-xl p-3.5 text-center">
                  <Trees className="w-5 h-5 text-emerald-500 mx-auto mb-1.5" />
                  <div className="text-xs font-bold text-stone-200">PEFC 100%</div>
                  <div className="text-[11px] text-stone-400 mt-0.5">Forêts durables</div>
                </div>

                <div className="bg-stone-900 border border-stone-800 rounded-xl p-3.5 text-center">
                  <Truck className="w-5 h-5 text-amber-500 mx-auto mb-1.5" />
                  <div className="text-xs font-bold text-stone-200">Chariot Tout-Terrain</div>
                  <div className="text-[11px] text-stone-400 mt-0.5">Dépose au garage</div>
                </div>
              </div>
            </div>

            {/* Colonne Droite : Achat, Prix & Options (5 colonnes) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500 mb-2">
                  <Flame className="w-4 h-4 fill-amber-600 text-amber-600 dark:fill-amber-500 dark:text-amber-500 shrink-0" />
                  <span>Combustible Garanti Sans Fumé &amp; Écologique</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-stone-100 leading-snug">
                  {product.name}
                </h1>
                <p className="text-xs sm:text-sm text-stone-400 mt-3 leading-relaxed">
                  {product.description || product.short_description}
                </p>
              </div>

              {/* Module d'achat interactif avec calcul de remise */}
              <ProductPurchaseBox product={product} />

              {/* Vérification de code postal rapide intégrée */}
              <DeliveryChecker compact />
            </div>
          </div>
        </section>

        {/* SECTION FICHE TECHNIQUE COMPLÈTE & NORMES */}
        <section className="bg-stone-900 border-y border-stone-800 py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mb-8">
              <h2 className="text-2xl sm:text-3xl font-black text-stone-100">
                Fiche Technique &amp; Caractéristiques
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mt-1">
                Toutes les données certifiées du produit issues de notre cahier des charges forestier
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tableau technique */}
              <div className="bg-stone-950 border border-stone-800 rounded-xl overflow-hidden">
                <div className="px-5 py-3.5 bg-stone-900 border-b border-stone-800 font-bold text-xs uppercase tracking-wider text-amber-500">
                  Caractéristiques Physiques
                </div>
                <div className="divide-y divide-stone-800 text-xs">
                  <div className="px-5 py-3 flex justify-between">
                    <span className="text-stone-400">Conditionnement</span>
                    <span className="font-semibold text-stone-200 capitalize">{product.packaging}</span>
                  </div>
                  {product.wood_length_cm && (
                    <div className="px-5 py-3 flex justify-between">
                      <span className="text-stone-400">Longueur des bûches</span>
                      <span className="font-bold text-amber-400">{product.wood_length_cm} cm (± 2 cm)</span>
                    </div>
                  )}
                  {product.volume_stere && (
                    <div className="px-5 py-3 flex justify-between">
                      <span className="text-stone-400">Volume apparent en stères</span>
                      <span className="font-bold text-stone-100">{product.volume_stere} Stères</span>
                    </div>
                  )}
                  {product.weight_kg && (
                    <div className="px-5 py-3 flex justify-between">
                      <span className="text-stone-400">Poids indicatif</span>
                      <span className="font-semibold text-stone-200">≈ {product.weight_kg} kg</span>
                    </div>
                  )}
                  {product.species && product.species.length > 0 && (
                    <div className="px-5 py-3 flex justify-between">
                      <span className="text-stone-400">Essences de bois</span>
                      <span className="font-semibold text-stone-200">{product.species.join(", ")}</span>
                    </div>
                  )}
                  {product.humidity_rate && (
                    <div className="px-5 py-3 flex justify-between">
                      <span className="text-stone-400">Classe d&apos;humidité</span>
                      <span className="font-bold text-emerald-400">H1 (&lt; {product.humidity_rate}%) Séché</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Performances & Conseils d'utilisation */}
              <div className="bg-stone-950 border border-stone-800 rounded-xl overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="px-5 py-3.5 bg-stone-900 border-b border-stone-800 font-bold text-xs uppercase tracking-wider text-amber-500">
                    Performances Énergétiques &amp; Rendement
                  </div>
                  <div className="p-5 space-y-4 text-xs text-stone-300 leading-relaxed">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong>Pouvoir Calorifique Inférieur (PCI) :</strong> Fournit environ <strong>2 000 kWh</strong> par stère de bois dur fendu sec, soit un rendement énergétique supérieur de 30% par rapport à un bois mi-sec à 30% d&apos;humidité.
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong>Protection du Foyer &amp; Vitre Propre :</strong> Grâce au faible taux d&apos;humidité, la combustion est complète et ne dépose presque aucune suie ni goudron dans les tuyaux de fumisterie.
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong>Méthode d&apos;Allumage Recommandée :</strong> Utilisez la méthode d&apos;allumage par le haut (Top-Down) : placez les grosses bûches en bas et le petit bois d&apos;allumage avec l&apos;allume-feu sur le dessus pour diviser les fumées par 4.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 border-t border-stone-800 bg-stone-900/50 text-xs text-stone-400 flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Stockage conseillé : sous abri ventilé ou garage, surélevé du sol par des tasseaux.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION PRODUITS COMPLÉMENTAIRES */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
            <div className="mb-8">
              <h3 className="text-xl sm:text-2xl font-black text-stone-100">
                Produits Complémentaires Indispensables
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Complétez votre commande pour rentabiliser la livraison et réussir vos flambées
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}

        {/* Barre d'action collante mobile sous le pouce */}
        <StickyProductBar product={product} />
      </main>

      <Footer />
    </div>
  )
}
