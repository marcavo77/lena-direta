"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, FileText, Package, Truck } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { getMyOrdersLiveAction } from "@/app/actions/order"
import { formatPrice } from "@/lib/utils"
import { NotifyPaymentButton } from "@/components/checkout/NotifyPaymentButton"
import type { Order } from "@/lib/supabase/database.types"

interface ClientOrdersRealtimeProps {
  initialOrders: Order[]
  userId: string
  userEmail: string
}

function getOrderStatusInfo(ord: Order) {
  if (ord.status === "cancelled") {
    return {
      label: "Annulée",
      badgeClass: "bg-rose-500/10 border-rose-500/30 text-rose-400",
    }
  }
  if (ord.status === "delivered") {
    return {
      label: "Livrée à domicile",
      badgeClass: "bg-emerald-600/20 border-emerald-500/40 text-emerald-300",
    }
  }
  if (ord.status === "out_for_delivery") {
    return {
      label: "En cours de livraison",
      badgeClass: "bg-purple-500/10 border-purple-500/30 text-purple-300",
    }
  }
  if (ord.status === "preparing") {
    return {
      label: "En préparation hangar",
      badgeClass: "bg-sky-500/10 border-sky-500/30 text-sky-300",
    }
  }
  if (ord.status === "paid" || ord.payment_status === "paid") {
    return {
      label: "Paiement Validé • En Préparation",
      badgeClass: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    }
  }
  if (ord.status === "payment_notified" || ord.payment_status === "transfer_notified") {
    return {
      label: "Virement signalé • Vérification scierie",
      badgeClass: "bg-amber-500/20 border-amber-500/40 text-amber-300",
    }
  }
  return {
    label: "En attente de virement",
    badgeClass: "bg-stone-800 border-stone-700 text-stone-300",
  }
}

export function ClientOrdersRealtime({
  initialOrders,
  userId,
  userEmail,
}: ClientOrdersRealtimeProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)

  useEffect(() => {
    setOrders(initialOrders)
  }, [initialOrders])

  useEffect(() => {
    const supabase = createClient()

    const matchesClient = (row: Partial<Order> | null | undefined) => {
      if (!row) return false
      return (
        row.user_id === userId ||
        (row.customer_email && row.customer_email.toLowerCase() === userEmail.toLowerCase())
      )
    }

    const channel = supabase
      .channel(`client-orders-${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newOrd = payload.new as Order
            if (matchesClient(newOrd)) {
              setOrders((prev) =>
                prev.some((o) => o.id === newOrd.id) ? prev : [newOrd, ...prev]
              )
            }
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new as Order
            if (matchesClient(updated)) {
              setOrders((prev) => {
                const exists = prev.some((o) => o.id === updated.id)
                if (!exists) return [updated, ...prev]
                return prev.map((o) => (o.id === updated.id ? updated : o))
              })
            }
          } else if (payload.eventType === "DELETE") {
            const deletedId = (payload.old as Partial<Order>)?.id
            if (deletedId) {
              setOrders((prev) => prev.filter((o) => o.id !== deletedId))
            }
          }
        }
      )
      .subscribe()

    // Synchronisation de secours au retour sur l'onglet ou toutes les 20s
    const syncOrders = async () => {
      if (document.visibilityState !== "visible") return
      const fresh = await getMyOrdersLiveAction()
      if (fresh) {
        setOrders(fresh)
      }
    }

    const interval = setInterval(syncOrders, 20000)
    document.addEventListener("visibilitychange", syncOrders)

    return () => {
      clearInterval(interval)
      document.removeEventListener("visibilitychange", syncOrders)
      supabase.removeChannel(channel)
    }
  }, [userId, userEmail])

  return (
    <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-6 sm:p-7 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-stone-800">
        <div className="flex items-center gap-2.5">
          <Package className="w-5 h-5 text-amber-500" />
          <h2 className="font-bold text-base text-stone-100">
            Mes Commandes &amp; Livraisons ({orders.length})
          </h2>
          <span
            className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full"
            title="Les statuts se mettent à jour automatiquement en direct"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>En direct</span>
          </span>
        </div>
        <Link
          href="/catalogue"
          className="text-xs text-amber-400 hover:text-amber-300 font-bold"
        >
          Commander du bois
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-10 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center mx-auto text-stone-500">
            <Truck className="w-6 h-6" />
          </div>
          <div className="text-sm font-semibold text-stone-300">
            Vous n&apos;avez pas encore passé de commande
          </div>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Découvrez nos stères de chêne séché sous abri (&lt; 20% humidité) et nos granulés de bois Din+.
          </p>
          <div className="pt-2">
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs px-5 py-2.5 rounded-xl transition-all uppercase tracking-wider"
            >
              <span>Voir le catalogue de bois</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => {
            const ordItems = (ord.items as Array<{ name: string; quantity: number }>) || []
            const statusInfo = getOrderStatusInfo(ord)

            return (
              <div
                key={ord.id}
                className="p-4 sm:p-5 rounded-xl bg-stone-900/70 border border-stone-800 space-y-3 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-amber-400 text-sm">
                        {ord.order_number}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${statusInfo.badgeClass}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-400 mt-0.5 block">
                      Passée le {new Date(ord.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="font-black text-stone-100 text-base">
                      {formatPrice(ord.total_cents)}
                    </div>
                    <span className="text-[11px] text-stone-500">TTC (TVA 10%)</span>
                  </div>
                </div>

                {/* Articles de la commande */}
                <div className="pt-2 border-t border-stone-800/80 text-xs text-stone-300 space-y-1">
                  {ordItems.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-[11px]">
                      <span>{it.name}</span>
                      <span className="text-stone-400 font-semibold">Qté : {it.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Action : Signaler virement ou voir le reçu */}
                <div className="pt-3 border-t border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <NotifyPaymentButton
                    orderId={ord.id}
                    orderNumber={ord.order_number}
                    paymentStatus={ord.payment_status}
                    compact={true}
                    onNotified={() => {
                      setOrders((prev) =>
                        prev.map((item) =>
                          item.id === ord.id
                            ? {
                                ...item,
                                status: "payment_notified",
                                payment_status: "transfer_notified",
                              }
                            : item
                        )
                      )
                    }}
                  />

                  <Link
                    href={`/confirmation/${ord.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Voir le reçu &amp; instructions RIB</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
