"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, Clock, Package, Truck, XCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { getOrderLiveStatusAction } from "@/app/actions/order"
import { RibPaymentCard } from "@/components/checkout/RibPaymentCard"

interface OrderConfirmationRealtimeProps {
  orderId: string
  orderNumber: string
  initialStatus: string
  initialPaymentStatus: string | null
  totalFormatted: string
  depositFormatted: string
  paymentMethod: string
  customerPhone: string
}

function getLiveStatusBanner(status: string, paymentStatus: string | null) {
  if (status === "cancelled") {
    return {
      icon: XCircle,
      title: "Commande Annulée",
      subtitle: "Cette commande a été annulée par l'administration.",
      boxClass: "bg-rose-500/10 border-rose-500/30 text-rose-300",
      badgeClass: "bg-rose-500/20 text-rose-300 border-rose-500/40",
      badge: "Annulée",
    }
  }
  if (status === "delivered") {
    return {
      icon: CheckCircle2,
      title: "Commande Livrée",
      subtitle: "Vos palettes ont été livrées à votre adresse.",
      boxClass: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
      badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      badge: "Livrée",
    }
  }
  if (status === "out_for_delivery") {
    return {
      icon: Truck,
      title: "En Cours de Livraison",
      subtitle: "Votre commande est en route vers votre domicile.",
      boxClass: "bg-purple-500/10 border-purple-500/30 text-purple-200",
      badgeClass: "bg-purple-500/20 text-purple-300 border-purple-500/40",
      badge: "En livraison",
    }
  }
  if (status === "preparing") {
    return {
      icon: Package,
      title: "En Préparation à la Scierie",
      subtitle: "Paiement validé. Vos palettes sont en cours de conditionnement sous hangar.",
      boxClass: "bg-sky-500/10 border-sky-500/30 text-sky-200",
      badgeClass: "bg-sky-500/20 text-sky-300 border-sky-500/40",
      badge: "En préparation",
    }
  }
  if (status === "paid" || paymentStatus === "paid") {
    return {
      icon: CheckCircle2,
      title: "Paiement Validé par la Scierie",
      subtitle: "Votre virement a bien été réceptionné et validé. Expédition en cours de planification.",
      boxClass: "bg-emerald-500/10 border-emerald-500/40 text-emerald-200",
      badgeClass: "bg-emerald-500 text-stone-950 border-emerald-400",
      badge: "Paiement Validé",
    }
  }
  if (status === "payment_notified" || paymentStatus === "transfer_notified") {
    return {
      icon: Clock,
      title: "Virement Signalé • Vérification en Cours",
      subtitle: "Notre administration a reçu votre signalement et vérifie la réception bancaire.",
      boxClass: "bg-amber-500/10 border-amber-500/40 text-amber-200",
      badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      badge: "Virement signalé",
    }
  }
  return {
    icon: Clock,
    title: "En Attente de Virement Bancaire",
    subtitle: "Effectuez le virement avec votre référence et signalez-le ci-dessous.",
    boxClass: "bg-stone-900 border-stone-800 text-stone-200",
    badgeClass: "bg-stone-800 text-stone-300 border-stone-700",
    badge: "En attente de paiement",
  }
}

export function OrderConfirmationRealtime({
  orderId,
  orderNumber,
  initialStatus,
  initialPaymentStatus,
  totalFormatted,
  depositFormatted,
  paymentMethod,
  customerPhone,
}: OrderConfirmationRealtimeProps) {
  const [status, setStatus] = useState(initialStatus)
  const [paymentStatus, setPaymentStatus] = useState<string | null>(initialPaymentStatus)

  useEffect(() => {
    setStatus(initialStatus)
    setPaymentStatus(initialPaymentStatus)
  }, [initialStatus, initialPaymentStatus])

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`order-confirmation-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          const updated = payload.new as { status?: string; payment_status?: string | null }
          if (updated?.status) setStatus(updated.status)
          if (updated?.payment_status !== undefined) setPaymentStatus(updated.payment_status)
        }
      )
      .subscribe()

    const pollStatus = async () => {
      if (document.visibilityState !== "visible") return
      const fresh = await getOrderLiveStatusAction(orderId)
      if (fresh) {
        setStatus(fresh.status)
        setPaymentStatus(fresh.payment_status)
      }
    }

    // Secours pour les commandes invitées (sans JWT auth) lorsque l'onglet est actif
    const interval = setInterval(pollStatus, 8000)
    document.addEventListener("visibilitychange", pollStatus)

    return () => {
      clearInterval(interval)
      document.removeEventListener("visibilitychange", pollStatus)
      supabase.removeChannel(channel)
    }
  }, [orderId])

  const banner = getLiveStatusBanner(status, paymentStatus)
  const BannerIcon = banner.icon

  return (
    <div className="space-y-6 mb-8">
      {/* Statut en Direct de la Commande */}
      <div className={`border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${banner.boxClass}`}>
        <div className="flex items-start gap-3">
          <BannerIcon className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-sm">{banner.title}</div>
            <div className="text-xs opacity-90 mt-0.5">{banner.subtitle}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <span className={`px-3 py-1 rounded-lg text-[11px] font-black uppercase border ${banner.badgeClass}`}>
            {banner.badge}
          </span>
        </div>
      </div>

      {/* Coordonnées Bancaires (RIB) & Bouton Signalement Virement */}
      <RibPaymentCard
        orderId={orderId}
        orderNumber={orderNumber}
        totalFormatted={totalFormatted}
        depositFormatted={depositFormatted}
        paymentMethod={paymentMethod}
        paymentStatus={paymentStatus}
        customerPhone={customerPhone}
      />
    </div>
  )
}
