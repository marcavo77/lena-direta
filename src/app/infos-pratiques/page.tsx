import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import Link from "next/link"
import {
  HelpCircle,
  Truck,
  Flame,
  Droplet,
  Trees,
  Warehouse,
  ChevronRight,
  ShieldCheck,
  Building2,
  Phone,
  Ruler,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react"

export const metadata = {
  title: "Infos Pratiques, Guides & FAQ Bois de Chauffage | LeñaDirecta",
  description:
    "Tous nos conseils pratiques : stockage du bois sec, allumage inversé Top-Down, accès camion 19T et modalités de paiement par virement bancaire.",
}

export default function InfosPratiquesPage() {
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
              <span className="text-stone-200">Infos Pratiques &amp; Guides</span>
            </nav>
          </div>
        </div>

        {/* Hero Section Infos Pratiques */}
        <section className="bg-[#181615] border-b border-stone-800 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span>Centre de Ressources &amp; Conseils d&apos;Atelier</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-stone-100 tracking-tight leading-tight">
                Infos Pratiques &amp; <span className="text-amber-500">Guides Métier</span>
              </h1>

              <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
                Tout ce qu&apos;il faut savoir pour bien choisir son combustible, préparer l&apos;accès de notre camion porteur 19T, stocker votre bois sans reprise d&apos;humidité et régler votre commande en toute sécurité.
              </p>
            </div>
          </div>
        </section>

        {/* 4 Accès Rapides vers les Guides */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/#simulateur"
              className="p-5 rounded-2xl bg-[#1c1917] border border-stone-800 hover:border-amber-500/40 transition-colors group space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center">
                <Ruler className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-100 group-hover:text-amber-400 transition-colors text-sm">
                Calculateur de Stères
              </h3>
              <p className="text-stone-400 text-xs leading-relaxed">
                Estimez le volume de bois nécessaire pour votre hiver selon votre surface et isolation.
              </p>
            </Link>

            <Link
              href="/livraison-et-acces"
              className="p-5 rounded-2xl bg-[#1c1917] border border-stone-800 hover:border-amber-500/40 transition-colors group space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-100 group-hover:text-amber-400 transition-colors text-sm">
                Livraison &amp; Accès Camion 19T
              </h3>
              <p className="text-stone-400 text-xs leading-relaxed">
                Gabarits de voirie, dépose au chariot tout-terrain et prise de rendez-vous téléphonique.
              </p>
            </Link>

            <Link
              href="/guide-du-bois"
              className="p-5 rounded-2xl bg-[#1c1917] border border-stone-800 hover:border-amber-500/40 transition-colors group space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-100 group-hover:text-amber-400 transition-colors text-sm">
                Allumage Top-Down &amp; Stockage
              </h3>
              <p className="text-stone-400 text-xs leading-relaxed">
                Méthode sans fumée pour préserver le tirage, garder la vitre propre et économiser 20% de bois.
              </p>
            </Link>

            <Link
              href="/nos-depots"
              className="p-5 rounded-2xl bg-[#1c1917] border border-stone-800 hover:border-amber-500/40 transition-colors group space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center">
                <Warehouse className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-100 group-hover:text-amber-400 transition-colors text-sm">
                Nos 4 Dépôts Drive
              </h3>
              <p className="text-stone-400 text-xs leading-relaxed">
                Venez retirer directement vos palettes avec votre remorque et économisez 40 € par palette.
              </p>
            </Link>
          </div>
        </section>

        {/* Section FAQ Métier Exhaustive */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
              Questions Fréquentes
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-100">
              Foire Aux Questions de nos Clients
            </h2>
            <p className="text-xs sm:text-sm text-stone-400">
              Retrouvez toutes les réponses aux questions logistiques, techniques et financières.
            </p>
          </div>

          <div className="space-y-4">
            {/* Q1 : Modalités de paiement */}
            <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-6 space-y-2">
              <h3 className="font-bold text-stone-100 text-base flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Comment régler ma commande de bois ou granulés ?</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Le moyen de règlement privilégié et le plus économique est le <strong>Virement Bancaire direct (RIB)</strong> vers notre compte d&apos;exploitation au Crédit Agricole d&apos;Île-de-France. Dès validation de votre panier, vous recevez les coordonnées complètes (IBAN, BIC) ainsi que votre référence unique de commande (<code className="text-amber-400 bg-stone-900 px-1 py-0.5 rounded font-mono">LD-2026-XXXX</code>) à reporter. Nous proposons également l&apos;option Acompte 30% par virement avec solde à la livraison, ainsi que le paiement sécurisé par Carte Bancaire.
              </p>
            </div>

            {/* Q2 : Date et RDV de livraison */}
            <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-6 space-y-2">
              <h3 className="font-bold text-stone-100 text-base flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Comment se déroule la prise de rendez-vous pour la livraison ?</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Dès que votre commande est validée et préparée sous hangar, notre transporteur prend contact avec vous par téléphone au moins 24 à 48 heures avant l&apos;expédition. Vous déterminez ensemble le jour exact ainsi que le créneau de demi-journée (Matin 8h-13h ou Après-midi 13h-18h). Le chauffeur vous contacte de nouveau 30 minutes avant son arrivée sur site.
              </p>
            </div>

            {/* Q3 : Humidité et séchage */}
            <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-6 space-y-2">
              <h3 className="font-bold text-stone-100 text-base flex items-center gap-2">
                <Droplet className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Comment s&apos;assurer que le bois est bien sec (&lt; 20% humidité) ?</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Notre bois est fendu dès l&apos;abattage et entreposé sous nos hangars de stockage ventilés pendant 18 à 24 mois. Avant chaque chargement de palette dans le camion, nos préparateurs effectuent un contrôle à cœur avec un humidimètre professionnel à pointes. Si une bûche dépasse 20% d&apos;humidité, le lot n&apos;est pas expédié.
              </p>
            </div>

            {/* Q4 : Chariot élévateur et passage délicat */}
            <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-6 space-y-2">
              <h3 className="font-bold text-stone-100 text-base flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Le chariot peut-il rouler sur une allée en gravier ou une pelouse ?</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Oui. Contrairement aux simples transpalettes manuels qui se bloquent immédiatement sur les cailloux, notre matériel est un chariot élévateur tout-terrain motorisé muni de pneus larges basse pression. Il traverse sans difficulté les allées en graviers compactés, les pavés et les terrains herbeux fermes pour déposer la palette au plus près de votre lieu de stockage.
              </p>
            </div>

            {/* Q5 : Consignes des palettes */}
            <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-6 space-y-2">
              <h3 className="font-bold text-stone-100 text-base flex items-center gap-2">
                <Warehouse className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Les palettes en bois sont-elles consignées ? Que dois-je en faire ?</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Les palettes en bois utilisées pour le transport de nos bûches et sacs de granulés sont des palettes perdues non consignées. Elles vous appartiennent. Vous pouvez les conserver pour isoler vos stères du sol humide, ou les débiter pour les utiliser comme bois d&apos;allumage (bois brut non traité). Lors d&apos;une livraison ultérieure, le chauffeur peut également les reprendre gratuitement sur simple demande.
              </p>
            </div>
          </div>
        </section>

        {/* Bannière de Contact */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider">
                <Phone className="w-4 h-4" />
                <span>Besoin d&apos;un conseil personnalisé ?</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-stone-100">
                Nos conseillers forestiers sont à votre écoute
              </h3>
              <p className="text-xs text-stone-400">
                Du lundi au samedi de 8h00 à 19h00 au 01 89 00 00 00 ou par formulaire en ligne.
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shrink-0 min-h-[44px]"
            >
              <span>Contacter la scierie</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
