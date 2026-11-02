import { createClient } from "@/lib/supabase/server"
import { CatalogBrowser } from "@/components/shop/CatalogBrowser"
import { DeliveryChecker } from "@/components/shop/DeliveryChecker"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Trees, ShieldCheck, Truck, ChevronRight } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Catalogue Combustibles Bois & Granulés | LenaDireta",
  description:
    "Découvrez notre catalogue complet de bois de chauffage sec (<20% H1) en 25cm, 33cm, 50cm, granulés de bois Din+ et bûches compressées. Tarifs directs producteur avec livraison chariot tout-terrain.",
}

export default async function CataloguePage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("unit_price_cents", { ascending: false })

  const productList = products || []

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1">
        {/* En-tête du catalogue & Fil d'Ariane */}
        <section className="bg-stone-900 border-b border-stone-800 py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-stone-400 mb-4 font-medium">
              <Link href="/" className="hover:text-amber-400">
                Accueil
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
              <span className="text-stone-200">Catalogue Combustibles</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-amber-500 font-extrabold mb-2">
                  <Trees className="w-4 h-4" />
                  <span>Exploitation &amp; Séchage Naturel</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-100 tracking-tight">
                  Catalogue Bois &amp; Granulés
                </h1>
                <p className="text-xs sm:text-sm text-stone-400 mt-2 max-w-xl leading-relaxed">
                  Bûches de chêne et charme fendu séché sous abri (&lt; 20% humidité garanti), granulés 100% résineux Din+ et bûches densifiées. Palettes filmées livrées avec chariot élévateur tout-terrain.
                </p>
              </div>

              {/* Rassurance rapide */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs text-stone-300 bg-stone-950 border border-stone-800 p-3.5 rounded-xl">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Norme NF Bois H1</span>
                </div>
                <span className="hidden sm:inline text-stone-700">•</span>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Dépose au garage / abri</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Corps du Catalogue avec Filtres Interactifs */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <CatalogBrowser initialProducts={productList} />
        </section>

        {/* Section Éligibilité de livraison en bas de page */}
        <section className="bg-stone-900 border-t border-stone-800 py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <DeliveryChecker />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
