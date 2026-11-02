import Link from "next/link"
import {
  Flame,
  Scale,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Thermometer,
  Layers,
} from "lucide-react"

export const metadata = {
  title: "Guide Expert du Bois de Chauffage & Allumage Top-Down | LenaDireta",
  description:
    "Maîtrisez l'art du chauffage au bois : méthode d'allumage inversé Top-Down, table de conversion stère en m³, guide des essences et astuces pour reconnaître un bois sec.",
}

export default function WoodGuidePage() {
  return (
    <div className="bg-[#121110] min-h-screen text-stone-100 py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Fil d'Ariane */}
        <nav className="flex items-center gap-2 text-xs text-stone-400 mb-6 font-medium">
          <Link href="/" className="hover:text-amber-400 transition-colors">
            Accueil
          </Link>
          <span>/</span>
          <span className="text-stone-200">Guide du bois de chauffage</span>
        </nav>

        {/* Hero Section */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <BookOpen className="w-4 h-4" />
            <span>Conseils Pratiques de Scierie</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-100 tracking-tight">
            Le Guide Expert du Bois de Chauffage
          </h1>
          <p className="text-sm sm:text-base text-stone-300 mt-4 leading-relaxed max-w-3xl">
            Tirer le meilleur rendement de son poêle ou de son insert ne dépend pas seulement du bois : la méthode d'allumage, le taux d'humidité et la compréhension des stères sont capitaux. Retrouvez ici les conseils techniques de nos exploitants forestiers.
          </p>
        </div>

        {/* Chapitre 1 : Méthode Top-Down */}
        <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-6 sm:p-8 mb-10 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-800">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-100">
                1. La Méthode d'Allumage Inversé (Top-Down)
              </h2>
              <p className="text-xs text-stone-400">
                Moins de fumée, zéro encrassement du conduit et 20% d'économie de combustible
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-stone-300 leading-relaxed">
            <div className="space-y-3">
              <p>
                L'erreur la plus courante consiste à allumer son feu par le bas (papier journal sous de grosses bûches). Cette méthode étouffe la flamme, dégage d'épaisses fumées toxiques et produit du bistre qui goudronne votre conduit de cheminée.
              </p>
              <p>
                L'allumage <strong>inversé par le haut (Top-Down)</strong> fonctionne comme une bougie : le feu brûle progressivement du sommet vers la base. Les gaz de combustion libérés par les bûches inférieures traversent le lit de braises supérieures et sont immédiatement consumés.
              </p>
            </div>

            <div className="bg-stone-900/80 p-5 rounded-xl border border-stone-800 space-y-3">
              <h3 className="font-bold text-stone-100 text-xs uppercase tracking-wider text-amber-400">
                Comment monter un foyer Top-Down en 4 étapes :
              </h3>
              <ol className="space-y-2 text-stone-400 text-xs">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                  <span><strong>À la base :</strong> Disposez 2 grosses bûches fendues de chêne ou charme, espacées de 2 cm.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                  <span><strong>Étage intermédiaire :</strong> Placez 2 à 3 bûches plus fines en croix perpendiculaire.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                  <span><strong>Au sommet :</strong> Empilez du petit bois sec d'allumage (brindilles ou résineux).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center shrink-0 text-[11px]">4</span>
                  <span><strong>Mise à feu :</strong> Posez un allume-feu en laine de bois au sommet et allumez-le. Laissez l'arrivée d'air ouverte à 100%.</span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Chapitre 2 : Comprendre le Stère et le m³ */}
        <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-6 sm:p-8 mb-10 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-800">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-100">
                2. Pourquoi 1 Stère coupé en 33 cm n'occupe plus 1 m³ ?
              </h2>
              <p className="text-xs text-stone-400">
                Comprendre le coefficient d'empilement officiel de la norme NF Bois de Chauffage
              </p>
            </div>
          </div>

          <p className="text-xs text-stone-300 leading-relaxed">
            C'est la question numéro 1 posée par les nouveaux utilisateurs de bois : <em>« J'ai commandé 3 stères coupés en 33 cm, mais une fois rangés, ils n'occupent que 2,1 m³, s'est-on trompé ? »</em>
          </p>

          <p className="text-xs text-stone-400 leading-relaxed">
            La réponse est <strong>non, le compte est parfait</strong> ! Par définition historique, 1 stère correspond à un empilement de 1 m de côté composé de bûches longues de 1 mètre (soit 1 m³ avec de gros vides d'air entre les troncs).
            Lorsque ces mêmes bûches sont recoupées en 33 cm ou en 50 cm, les morceaux s'emboîtent plus serrés les uns dans les autres, comblant les espaces vides. La quantité de matière de bois reste strictement la même, mais le volume apparent diminue.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-stone-800 rounded-xl overflow-hidden">
              <thead className="bg-stone-900 text-stone-200 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3 border-b border-stone-800">Longueur de la bûche</th>
                  <th className="p-3 border-b border-stone-800">Coefficient NF</th>
                  <th className="p-3 border-b border-stone-800">Volume rangé équivalent (1 stère)</th>
                  <th className="p-3 border-b border-stone-800">Exemple pour 3 stères</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800 text-stone-300">
                <tr className="bg-stone-950/40">
                  <td className="p-3 font-semibold text-stone-100">Bûches de 100 cm</td>
                  <td className="p-3 font-mono">1,00</td>
                  <td className="p-3 font-bold text-amber-400">1,00 m³</td>
                  <td className="p-3">3,00 m³</td>
                </tr>
                <tr className="bg-stone-950/40">
                  <td className="p-3 font-semibold text-stone-100">Bûches de 50 cm</td>
                  <td className="p-3 font-mono">0,80</td>
                  <td className="p-3 font-bold text-amber-400">0,80 m³</td>
                  <td className="p-3">2,40 m³</td>
                </tr>
                <tr className="bg-stone-950/40">
                  <td className="p-3 font-semibold text-stone-100">Bûches de 33 cm</td>
                  <td className="p-3 font-mono">0,70</td>
                  <td className="p-3 font-bold text-amber-400">0,70 m³</td>
                  <td className="p-3 font-bold text-emerald-400">2,10 m³</td>
                </tr>
                <tr className="bg-stone-950/40">
                  <td className="p-3 font-semibold text-stone-100">Bûches de 25 cm</td>
                  <td className="p-3 font-mono">0,60</td>
                  <td className="p-3 font-bold text-amber-400">0,60 m³</td>
                  <td className="p-3">1,80 m³</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Chapitre 3 : Comment reconnaître un bois sec */}
        <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-6 sm:p-8 mb-10 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-800">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black">
              <Thermometer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-100">
                3. Les 3 tests pour vérifier qu'un bois est sec (&lt; 20% H1)
              </h2>
              <p className="text-xs text-stone-400">
                Ne brûlez jamais de bois vert : vous perdriez 50% de calories et détérioreriez votre appareil
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 space-y-2">
              <div className="font-bold text-amber-400 text-sm">Le Test Visuel</div>
              <p className="text-stone-400 leading-relaxed">
                Un bois sec présente des fentes d'éclatement radiales bien nettes sur les tranches coupées. L'écorce se détache facilement sous la pression des doigts.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 space-y-2">
              <div className="font-bold text-amber-400 text-sm">Le Test Acoustique</div>
              <p className="text-stone-400 leading-relaxed">
                Frappez deux bûches l'une contre l'autre. Si le son produit est sec et cristallin, le bois est prêt. Un son mat et sourd indique la présence d'eau interne.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 space-y-2">
              <div className="font-bold text-amber-400 text-sm">L'Humidimètre à Pointes</div>
              <p className="text-stone-400 leading-relaxed">
                C'est le test officiel. Fendez une bûche en deux et plantez les deux broches au cœur de la tranche fraîche. Le taux doit impérativement afficher moins de 20%.
              </p>
            </div>
          </div>
        </div>

        {/* Chapitre 4 : Guide des Essences Nobles */}
        <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-6 sm:p-8 mb-12 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-800">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-100">
                4. Guide comparatif des essences de feuillus durs
              </h2>
              <p className="text-xs text-stone-400">
                Chêne, Charme, Hêtre et Frêne : le quatuor royal des scieries françaises
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-300">
            <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-stone-100 text-sm">Le Chêne (Quercus)</h3>
                <span className="text-amber-400 font-bold text-[11px]">Braise Très Durable</span>
              </div>
              <p className="text-stone-400 leading-relaxed">
                Le roi des forêts. Bois très lourd, à combustion lente et régulière. Ses braises intenses maintiennent la chaleur pendant des heures. Parfait pour les inserts et les nuits d'hiver.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-stone-100 text-sm">Le Charme (Carpinus)</h3>
                <span className="text-amber-400 font-bold text-[11px]">Rendement Maximal</span>
              </div>
              <p className="text-stone-400 leading-relaxed">
                Le bois de chauffe au pouvoir calorifique le plus élevé de nos régions. Il donne une flamme vive, claire et très chaude, sans jamais projeter d'étincelles.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-stone-100 text-sm">Le Hêtre (Fagus)</h3>
                <span className="text-amber-400 font-bold text-[11px]">Flamme Chaude &amp; Régulière</span>
              </div>
              <p className="text-stone-400 leading-relaxed">
                S'allume facilement et brûle avec une magnifique flamme constante. Il dégage une odeur agréable très appréciée et produit peu de cendres résiduelles.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-stone-100 text-sm">Le Frêne (Fraxinus)</h3>
                <span className="text-amber-400 font-bold text-[11px]">Combustion Douce</span>
              </div>
              <p className="text-stone-400 leading-relaxed">
                Excellent bois fendu facile à manipuler, qui offre un démarrage rapide et un lit de braises dense sans encrasser les vitres de poêle.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Vers Catalogue */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 text-center space-y-4">
          <h2 className="text-xl font-bold text-stone-100">
            Besoin de commander votre bois sec prêt à l'emploi ?
          </h2>
          <p className="text-xs text-stone-400 max-w-lg mx-auto leading-relaxed">
            Toutes nos palettes de chêne, charme et hêtre sont garanties à moins de 20% d'humidité. Livraison avec chariot tout-terrain directement à votre domicile.
          </p>
          <div className="pt-2">
            <Link
              href="/catalogue"
              className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all min-h-[44px]"
            >
              <span>Accéder au catalogue de bois</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
