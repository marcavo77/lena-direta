import Link from "next/link"
import { notFound } from "next/navigation"
import {
  CheckCircle2,
  Package,
  Truck,
  Phone,
  Calendar,
  MapPin,
  Clock,
  Printer,
  ArrowRight,
  ShieldCheck,
  Building2,
  FileText,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/utils"
import { RibPaymentCard } from "@/components/checkout/RibPaymentCard"

interface ConfirmationPageProps {
  params: Promise<{ orderId: string }>
}

export default async function OrderConfirmationPage({ params }: ConfirmationPageProps) {
  const { orderId } = await params
  const supabase = await createClient()

  // Appel de la fonction Postgres RPC sécurisée
  const { data: orderList, error } = await supabase.rpc("get_order_by_id", {
    p_order_id: orderId,
  })

  if (error || !orderList || orderList.length === 0) {
    notFound()
  }

  const order = orderList[0]
  const shipping = order.shipping_address as {
    street?: string
    postal_code?: string
    city?: string
    delivery_notes?: string
    fulfillment_method?: string
    payment_method?: string
    preferred_week?: string
    preferred_time_slot?: string
  }

  const items = (order.items as Array<{
    name: string
    quantity: number
    unit_price_cents: number
    total_cents: number
    wood_species?: string
    log_length_cm?: number
    packaging?: string
  }>) || []

  return (
    <div className="bg-[#121110] min-h-screen text-stone-100 py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* En-tête de Succès */}
        <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-6 sm:p-10 text-center mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Commande Enregistrée avec Succès
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-100 mt-1">
            Merci pour votre commande, {order.customer_name} !
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-2 max-w-xl mx-auto leading-relaxed">
            Un email de confirmation récapitulatif a été envoyé à{" "}
            <span className="text-stone-200 font-semibold">{order.customer_email}</span>. Vos palettes sont en cours d'attribution à l'exploitation.
          </p>

          <div className="mt-6 inline-flex items-center gap-3 bg-stone-900 border border-stone-800 px-5 py-2.5 rounded-xl text-xs sm:text-sm">
            <span className="text-stone-400">Référence de Commande :</span>
            <span className="font-mono font-black text-amber-400 text-sm sm:text-base">
              {order.order_number}
            </span>
          </div>
        </div>

        {/* Coordonnées Bancaires (RIB) & Instructions de Virement */}
        <div className="mb-8">
          <RibPaymentCard
            orderNumber={order.order_number}
            totalFormatted={formatPrice(order.total_cents)}
            depositFormatted={formatPrice(Math.round(order.total_cents * 0.3))}
            paymentMethod={shipping.payment_method || "transfer"}
            customerPhone={order.customer_phone}
          />
        </div>

        {/* Protocole des Prochaines Étapes Logistiques (Inspiré de Brazeco & Simplyfeu) */}
        <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-6 sm:p-8 mb-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-800">
            <h2 className="text-base sm:text-lg font-bold text-stone-100 flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-500" />
              <span>Prochaines étapes de votre livraison</span>
            </h2>
            <span className="text-xs text-amber-400 font-semibold">Suivi d'exploitation</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800/80 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-stone-950 font-black flex items-center justify-center text-xs">
                1
              </div>
              <div className="font-bold text-stone-200">Mise en préparation</div>
              <p className="text-stone-400 text-[11px] leading-relaxed">
                Vos palettes de bois sont conditionnées sous hangar ventilé à la scierie.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800/80 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-stone-950 font-black flex items-center justify-center text-xs">
                2
              </div>
              <div className="font-bold text-stone-200">Contrôle Humidité</div>
              <p className="text-stone-400 text-[11px] leading-relaxed">
                Mesure à l'humidimètre à pointes avant chargement (&lt; 20% garanti).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800/80 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-stone-950 font-black flex items-center justify-center text-xs">
                3
              </div>
              <div className="font-bold text-stone-200">Prise de RDV par Téléphone</div>
              <p className="text-stone-400 text-[11px] leading-relaxed">
                Le transporteur vous appelle au <span className="text-stone-200">{order.customer_phone}</span> pour convenir de la demi-journée.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800/80 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-stone-950 font-black flex items-center justify-center text-xs">
                4
              </div>
              <div className="font-bold text-stone-200">Dépose Sécurisée</div>
              <p className="text-stone-400 text-[11px] leading-relaxed">
                Camion porteur 19T avec hayon et chariot tout-terrain jusqu'à votre garage.
              </p>
            </div>
          </div>
        </div>

        {/* Détails de la Commande & Récapitulatif Articles */}
        <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-6 mb-8">
          <h2 className="text-base sm:text-lg font-bold text-stone-100 flex items-center gap-2 pb-4 border-b border-stone-800">
            <Package className="w-5 h-5 text-amber-500" />
            <span>Articles commandés</span>
          </h2>

          <div className="divide-y divide-stone-800">
            {items.map((it, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between text-xs sm:text-sm">
                <div>
                  <div className="font-bold text-stone-200">{it.name}</div>
                  <div className="text-stone-400 text-xs mt-0.5">
                    Quantité : {it.quantity} {it.packaging ? `• ${it.packaging}` : ""}
                  </div>
                </div>
                <div className="font-bold text-amber-400 text-sm sm:text-base">
                  {formatPrice(it.total_cents)}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-stone-800 space-y-2 text-xs">
            <div className="flex justify-between text-stone-400">
              <span>Sous-total articles</span>
              <span className="text-stone-200 font-semibold">{formatPrice(order.subtotal_cents)}</span>
            </div>
            <div className="flex justify-between text-stone-400">
              <span>Frais de livraison</span>
              <span className="text-stone-200 font-semibold">
                {order.delivery_fee_cents > 0 ? formatPrice(order.delivery_fee_cents) : "Offerts / Inclus"}
              </span>
            </div>
            <div className="flex justify-between text-base sm:text-lg font-black text-stone-100 pt-3 border-t border-stone-800">
              <span>Total Réglé (TTC)</span>
              <span className="text-amber-400">{formatPrice(order.total_cents)}</span>
            </div>
          </div>
        </div>

        {/* Coordonnées & Lieu de Dépose */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-xs">
          <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-5 space-y-2">
            <div className="font-bold text-stone-200 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>Adresse de dépose</span>
            </div>
            <p className="text-stone-300">
              {shipping.street}
              <br />
              {shipping.postal_code} {shipping.city}
            </p>
            {shipping.delivery_notes && (
              <div className="pt-2 text-[11px] text-stone-400 border-t border-stone-800">
                <span className="font-bold text-stone-300">Notes d'accès : </span>
                {shipping.delivery_notes}
              </div>
            )}
          </div>

          <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-5 space-y-2">
            <div className="font-bold text-stone-200 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-500" />
              <span>Modalités convenues</span>
            </div>
            <p className="text-stone-300">
              Période : {shipping.preferred_week || "Semaine prochaine"}
              <br />
              Créneau :{" "}
              {shipping.preferred_time_slot === "morning"
                ? "Matin (8h - 13h)"
                : shipping.preferred_time_slot === "afternoon"
                ? "Après-midi (13h - 18h)"
                : "Journée entière"}
            </p>
            <div className="pt-2 text-[11px] text-stone-400 border-t border-stone-800">
              Paiement : {shipping.payment_method === "deposit" ? "Acompte 30% + Solde à livraison" : "Carte Bancaire sécurisée"}
            </div>
          </div>
        </div>

        {/* Actions & Assistance */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-800">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all min-h-[44px]"
          >
            <span>Retour à l'accueil LeñaDirecta</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="tel:0189000000"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-900 border border-stone-800 hover:border-amber-500 text-stone-200 font-bold px-5 py-3.5 rounded-xl text-xs transition-colors min-h-[44px]"
          >
            <Phone className="w-4 h-4 text-amber-500" />
            <span>Service Client : 01 89 00 00 00</span>
          </a>
        </div>
      </div>
    </div>
  )
}
