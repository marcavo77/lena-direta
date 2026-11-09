import Link from "next/link"
import {
  Truck,
  ShieldCheck,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Maximize2,
  ArrowRight,
  HelpCircle,
  Warehouse,
} from "lucide-react"

export const metadata = {
  title: "Livraison de Bois de Chauffage & Conditions d'Accès | LeñaDirecta",
  description:
    "Découvrez le protocole complet de livraison LeñaDirecta par camion porteur 19 tonnes avec chariot embarqué tout-terrain. Dimensions, exigences de voie et dépose au garage.",
}

export default function DeliveryAndAccessPage() {
  return (
    <div className="bg-[#121110] min-h-screen text-stone-100 py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Fil d'Ariane */}
        <nav className="flex items-center gap-2 text-xs text-stone-400 mb-6 font-medium">
          <Link href="/" className="hover:text-amber-400 transition-colors">
            Accueil
          </Link>
          <span>/</span>
          <span className="text-stone-200">Livraison &amp; Conditions d'accès</span>
        </nav>

        {/* Hero Section Solide & Artisanal */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <Truck className="w-4 h-4" />
            <span>Logistique Spécialisée Scierie</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-100 tracking-tight">
            Livraison &amp; Protocole d'Accessibilité
          </h1>
          <p className="text-sm sm:text-base text-stone-300 mt-3 max-w-3xl leading-relaxed">
            La livraison de bois fendu ou de granulés en palette (jusqu'à 1,2 tonne par palette) requiert un matériel adapté. Chez LeñaDirecta, nous assurons une logistique transparente avec prise de rendez-vous téléphonique et chariot tout-terrain pour déposer vos palettes exactement là où vous en avez besoin.
          </p>
        </div>

        {/* 1. Le Camion Porteur 19 Tonnes */}
        <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-6 sm:p-8 mb-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-800">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-100">
                1. Gabarit de notre véhicule de livraison standard
              </h2>
              <p className="text-xs text-stone-400">
                Camion porteur lourd 19 Tonnes (PTAC) avec hayon élévateur
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800 space-y-1">
              <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Longueur</div>
              <div className="text-2xl font-black text-amber-400">10,00 m</div>
              <p className="text-xs text-stone-400">Nécessite une voie dégagée pour manœuvrer</p>
            </div>

            <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800 space-y-1">
              <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Largeur</div>
              <div className="text-2xl font-black text-amber-400">2,50 m</div>
              <p className="text-xs text-stone-400">Prévoir au moins 3,00 m avec les rétroviseurs</p>
            </div>

            <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800 space-y-1">
              <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Hauteur libre</div>
              <div className="text-2xl font-black text-amber-400">3,80 m</div>
              <p className="text-xs text-stone-400">Attention aux branches basses et câbles PTT</p>
            </div>

            <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800 space-y-1">
              <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Poids en charge</div>
              <div className="text-2xl font-black text-amber-400">19 000 kg</div>
              <p className="text-xs text-stone-400">Interdit sur les ponts fragiles ou chemins privés creux</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-stone-300 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-400">Voie sans issue ou impasse : </span>
              Si votre logement se situe dans une impasse ne permettant pas au camion de faire demi-tour, le chauffeur ne pourra pas s'engager en marche arrière sur une distance supérieure à 50 mètres pour des raisons évidentes de sécurité. Pensez à le préciser dans votre commande.
            </div>
          </div>
        </div>

        {/* 2. L'Engin de Déchargement : Chariot Embarqué Tout-Terrain */}
        <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-6 sm:p-8 mb-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-stone-950 flex items-center justify-center font-black">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-100">
                2. Chariot tout-terrain embarqué (Moffett / Manitou)
              </h2>
              <p className="text-xs text-stone-400">
                L'atout LeñaDirecta : dépose directe dans votre cour, devant le garage ou l'abri de jardin
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-stone-300">
            <div className="space-y-3">
              <h3 className="font-bold text-stone-100 text-sm">
                Pourquoi le chariot tout-terrain change tout ?
              </h3>
              <p className="leading-relaxed text-stone-400">
                La majorité des transporteurs classiques disposent seulement d'un transpalette manuel à petites roulettes dures. Ce matériel se bloque au moindre caillou, ne roule pas sur le gravier et ne peut pas monter de trottoir.
              </p>
              <p className="leading-relaxed text-stone-400">
                Chez LeñaDirecta, nos camions sont équipés d'un chariot élévateur tout-terrain suspendu à l'arrière du camion. Grâce à ses roues larges tout-terrain motrices, il franchit les graviers, l'herbe tassée et les pentes modérées pour déposer la palette au plus près de votre stockage.
              </p>
            </div>

            <div className="space-y-3 bg-stone-900/60 p-5 rounded-xl border border-stone-800">
              <h4 className="font-bold text-stone-200 text-xs uppercase tracking-wider">
                Exigences pour le passage du chariot tout-terrain :
              </h4>
              <ul className="space-y-2 text-stone-400 text-xs">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Largeur de portail minimale : <strong>2,30 m</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Hauteur sous porche minimale : <strong>2,50 m</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Sol porteur (béton, enrobé, gravier compacté)</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Terrain détrempé ou pelouse grasse : dépose en limite de propriété pour préserver votre terrain</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. Déroulement Chronologique d'une Livraison */}
        <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-6 sm:p-8 mb-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-800">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-100">
                3. Les 4 étapes de votre livraison LeñaDirecta
              </h2>
              <p className="text-xs text-stone-400">
                De la préparation sous hangar jusqu'à la signature du bordereau
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-5 rounded-xl bg-stone-900/70 border border-stone-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 font-black flex items-center justify-center text-sm">
                1
              </div>
              <h3 className="font-bold text-stone-100 text-sm">Validation &amp; Attribution</h3>
              <p className="text-stone-400 text-[11px] leading-relaxed">
                Votre commande est contrôlée et attribuée à notre scierie. Les palettes sont cerclées et étiquetées avec votre référence.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-stone-900/70 border border-stone-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 font-black flex items-center justify-center text-sm">
                2
              </div>
              <h3 className="font-bold text-stone-100 text-sm">Appel de Prise de RDV</h3>
              <p className="text-stone-400 text-[11px] leading-relaxed">
                Sous 24 à 48h ouvrées, notre transporteur régional vous contacte par téléphone pour fixer le jour de passage et la demi-journée.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-stone-900/70 border border-stone-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 font-black flex items-center justify-center text-sm">
                3
              </div>
              <h3 className="font-bold text-stone-100 text-sm">Avis de Passage (SMS)</h3>
              <p className="text-stone-400 text-[11px] leading-relaxed">
                Le jour convenu, le chauffeur vous envoie un SMS environ 1 heure avant son arrivée pour confirmer sa progression.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-stone-900/70 border border-stone-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 font-black flex items-center justify-center text-sm">
                4
              </div>
              <h3 className="font-bold text-stone-100 text-sm">Dépose &amp; Contrôle</h3>
              <p className="text-stone-400 text-[11px] leading-relaxed">
                Déchargement soigné au chariot élévateur. Vous inspectez l'état des palettes et signez le bon de livraison numérique.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Foire Aux Questions Spéciale Logistique */}
        <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-6 sm:p-8 mb-8 space-y-6">
          <h2 className="text-xl font-bold text-stone-100 flex items-center gap-2 pb-4 border-b border-stone-800">
            <HelpCircle className="w-5 h-5 text-amber-500" />
            <span>Questions fréquentes sur la livraison</span>
          </h2>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 space-y-1.5">
              <h3 className="font-bold text-stone-200 text-sm">
                Le chauffeur peut-il ranger les bûches dans mon abri ou mon garage ?
              </h3>
              <p className="text-stone-400 leading-relaxed">
                Non. Le chauffeur dépose la palette complète au sol à l'endroit accessible par son chariot élévateur. Le dépilage manuel des bûches reste à la charge du client.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 space-y-1.5">
              <h3 className="font-bold text-stone-200 text-sm">
                Que se passe-t-il si je suis dans l'impossibilité d'être présent ?
              </h3>
              <p className="text-stone-400 leading-relaxed">
                La présence d'un adulte est fortement recommandée. Si vous ne pouvez pas être là, vous pouvez donner procuration à un voisin ou nous transmettre une décharge écrite autorisant la dépose sur votre allée dégagée.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 space-y-1.5">
              <h3 className="font-bold text-stone-200 text-sm">
                Quelle est la politique en cas de pluie le jour de livraison ?
              </h3>
              <p className="text-stone-400 leading-relaxed">
                Nos palettes sont filmées sous plastique protecteur sur le dessus. Une averse passagère ne compromet pas le taux d'humidité interne du bois dur H1. Si des intempéries exceptionnelles surviennent (neige abondante, verglas), la tournée est reportée sans frais pour préserver la sécurité.
              </p>
            </div>
          </div>
        </div>

        {/* Bannière Finale vers le Catalogue */}
        <div className="bg-stone-900 border border-amber-500/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-stone-100">
              Prêt à commander votre bois de chauffage séché sous abri ?
            </h2>
            <p className="text-xs text-stone-400 mt-1 max-w-xl">
              Choisissez votre essence (chêne, charme, hêtre), votre longueur (33 ou 50 cm) ou vos granulés certifiés Din+.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              href="/catalogue"
              className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all min-h-[44px]"
            >
              <span>Voir le catalogue de bois</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="tel:0189000000"
              className="inline-flex items-center justify-center gap-2 bg-stone-950 border border-stone-800 hover:border-amber-500 text-stone-200 font-bold px-5 py-3.5 rounded-xl text-xs transition-colors min-h-[44px]"
            >
              <Phone className="w-4 h-4 text-amber-500" />
              <span>01 89 00 00 00</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
