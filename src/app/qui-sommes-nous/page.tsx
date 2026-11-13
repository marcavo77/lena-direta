import Link from "next/link"
import {
  Trees,
  Award,
  ShieldCheck,
  Flame,
  Truck,
  HeartHandshake,
  ArrowRight,
  Phone,
  CheckCircle2,
  Warehouse,
} from "lucide-react"

export const metadata = {
  title: "Qui Sommes-Nous ? Exploitation Forestière Artisanale | LeñaDirecta",
  description:
    "Découvrez l'histoire de LeñaDirecta : exploitant forestier et scierie engagée pour une filière bois 100% française, durable et certifiée PEFC.",
}

export default function AboutPage() {
  return (
    <div className="bg-[#121110] min-h-screen text-stone-100 py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Fil d'Ariane */}
        <nav className="flex items-center gap-2 text-xs text-stone-400 mb-6 font-medium">
          <Link href="/" className="hover:text-amber-400 transition-colors">
            Accueil
          </Link>
          <span>/</span>
          <span className="text-stone-200">Qui sommes-nous</span>
        </nav>

        {/* Hero Section Artisanal */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <Trees className="w-4 h-4" />
            <span>Exploitation Forestière &amp; Négoce de Bois Noble</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-100 tracking-tight">
            L'Excellence du Bois de Chauffage Français
          </h1>
          <p className="text-sm sm:text-base text-stone-300 mt-4 leading-relaxed max-w-3xl">
            Chez LeñaDirecta, nous ne sommes pas un simple intermédiaire du web : nous sommes des passionnés de la filière sylvicole française. Depuis notre exploitation centrale en Île-de-France et nos scieries partenaires de Bourgogne, nous sélectionnons les plus nobles feuillus durs pour offrir une chaleur authentique, performante et sans fumée.
          </p>
        </div>

        {/* 3 Valeurs Fondatrices */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black">
              <Award className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-stone-100">100% Forêts Françaises (PEFC)</h2>
            <p className="text-xs text-stone-400 leading-relaxed">
              Tout notre bois provient exclusivement de forêts régionales éco-gérées sous certification PEFC et FSC. Chaque arbre récolté s'inscrit dans un plan d'éclaircie sylvicole favorisant le renouvellement de la canopée.
            </p>
          </div>

          <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-stone-950 flex items-center justify-center font-black">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-stone-100">Séchage Sous Hangar Ventilé</h2>
            <p className="text-xs text-stone-400 leading-relaxed">
              Le séchage est notre obsession. Nos billots sont fendus puis stockés pendant 18 à 24 mois sous de vastes hangars aérés, protégés des intempéries pour garantir un taux d'humidité résiduelle strictement inférieur à 20% (Qualité H1).
            </p>
          </div>

          <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black">
              <Truck className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-stone-100">Logistique Maîtrisée Directe</h2>
            <p className="text-xs text-stone-400 leading-relaxed">
              Pas de mauvaise surprise à la livraison : camions 19 tonnes avec chariots tout-terrain tout équipés, prise de rendez-vous téléphonique sous 24-48h, et dépose sur palette filmée au plus près de votre garage.
            </p>
          </div>
        </div>

        {/* L'Engagement Zéro Déchet de Scierie */}
        <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-6 sm:p-8 mb-12 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-800">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/30">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-100">
                Notre charte de valorisation intégrale du bois
              </h2>
              <p className="text-xs text-stone-400">
                L'économie circulaire appliquée à la sylviculture moderne
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-stone-300">
            <div className="space-y-3 leading-relaxed">
              <p>
                Dans notre processus de transformation, absolument <strong>aucun morceau d'arbre n'est gaspillé</strong> :
              </p>
              <ul className="space-y-2 text-stone-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Le tronc noble :</strong> fendu en bûches régulières de 25 cm, 33 cm ou 50 cm pour le bois de chauffage haute performance.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>La sciure et copeaux :</strong> dépoussiérés et comprimés sous haute pression mécanique pour produire nos pellets Din+ et bûches calorifiques de nuit sans colle ni liant.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>L'écorce naturelle :</strong> séchée pour le paillage horticole et le compost sylvicole.</span>
                </li>
              </ul>
            </div>

            <div className="bg-stone-900/70 p-5 rounded-xl border border-stone-800 space-y-3">
              <h3 className="font-bold text-stone-100 text-sm">
                Des chiffres qui parlent :
              </h3>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-stone-950/60 rounded-lg border border-stone-800">
                  <div className="text-xl font-black text-amber-400">&lt; 18%</div>
                  <div className="text-[10px] text-stone-400 uppercase font-bold mt-1">Humidité moyenne</div>
                </div>
                <div className="p-3 bg-stone-950/60 rounded-lg border border-stone-800">
                  <div className="text-xl font-black text-amber-400">100%</div>
                  <div className="text-[10px] text-stone-400 uppercase font-bold mt-1">Forêts françaises</div>
                </div>
                <div className="p-3 bg-stone-950/60 rounded-lg border border-stone-800">
                  <div className="text-xl font-black text-amber-400">4,2 kWh/kg</div>
                  <div className="text-[10px] text-stone-400 uppercase font-bold mt-1">Pouvoir calorifique</div>
                </div>
                <div className="p-3 bg-stone-950/60 rounded-lg border border-stone-800">
                  <div className="text-xl font-black text-amber-400">0%</div>
                  <div className="text-[10px] text-stone-400 uppercase font-bold mt-1">Additifs chimiques</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coordonnées & Visite du Dépôt */}
        <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-6 sm:p-8 mb-12 space-y-4">
          <h2 className="text-lg font-bold text-stone-100 flex items-center gap-2">
            <Warehouse className="w-5 h-5 text-amber-500" />
            <span>Notre Dépôt Central &amp; Exploitation</span>
          </h2>
          <div className="text-xs text-stone-300 space-y-2">
            <p>
              <strong>LeñaDirecta Exploitation &amp; Dépôt Central</strong>
              <br />
              Carretera de Vilanova a l&apos;Arboç, Km. 2, 08800 Vilanova i la Geltrú, Barcelone (Espagne).
            </p>
            <p className="text-stone-400">
              Accueil et retrait Drive palettes : du lundi au vendredi de 8h00 à 18h00, et le samedi matin de 8h30 à 12h30.
            </p>
          </div>
        </div>

        {/* CTA Vers Catalogue */}
        <div className="text-center">
          <Link
            href="/catalogue"
            className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-8 py-4 rounded-xl text-sm transition-all"
          >
            <span>Découvrir nos stères de bois et granulés</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
