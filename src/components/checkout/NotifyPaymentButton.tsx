"use client"

import { useState } from "react"
import { CheckCircle2, Loader2, Send } from "lucide-react"
import { notifyTransferSent } from "@/app/actions/order"

interface NotifyPaymentButtonProps {
  orderId: string
  orderNumber: string
  paymentStatus?: string | null
  compact?: boolean
}

export function NotifyPaymentButton({
  orderId,
  orderNumber,
  paymentStatus: initialStatus,
  compact = false,
}: NotifyPaymentButtonProps) {
  const [status, setStatus] = useState<string | null>(initialStatus || "pending")
  const [loading, setLoading] = useState(false)
  const [reference, setReference] = useState("")
  const [showInput, setShowInput] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isNotified = status === "transfer_notified"
  const isPaid = status === "paid"

  if (isPaid) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        <span>Paiement validé par la scierie</span>
      </span>
    )
  }

  if (isNotified) {
    return (
      <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3.5 py-2 rounded-lg">
        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
        <span>Virement signalé • En attente de validation par la scierie</span>
      </div>
    )
  }

  const handleNotify = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await notifyTransferSent(orderId, reference)
      if (res.success) {
        setStatus("transfer_notified")
      } else {
        setError(res.error || "Une erreur est survenue")
      }
    } catch {
      setError("Erreur de connexion au serveur")
    } finally {
      setLoading(false)
    }
  }

  if (compact) {
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <button
          type="button"
          onClick={handleNotify}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-950 bg-amber-500 hover:bg-amber-400 px-3.5 py-1.5 rounded-lg transition-all shadow-sm active:scale-95 disabled:opacity-50 min-h-[36px]"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5" />
          )}
          <span>Signaler mon virement fait</span>
        </button>
        {error && <span className="text-[11px] text-rose-400">{error}</span>}
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-stone-900 border-2 border-amber-500/40 space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
          <Send className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-bold text-stone-100 text-sm">
            Vous avez effectué votre virement bancaire ?
          </h4>
          <p className="text-xs text-stone-400 leading-relaxed mt-0.5">
            Signalez-le en un clic à notre administration pour que nous constations votre virement et passions vos palettes en préparation prioritaire.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
        <input
          type="text"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder={`Réf. ou nom émetteur (ex: ${orderNumber})`}
          className="bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-lg px-3 py-2 text-xs text-stone-200 placeholder:text-stone-600 outline-none flex-1 min-h-[42px]"
        />
        <button
          type="button"
          onClick={handleNotify}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs px-5 py-2.5 rounded-lg transition-all min-h-[42px] uppercase tracking-wider shrink-0 active:scale-95 disabled:opacity-50 shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Transmission...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span>J'ai effectué mon virement bancaire</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/30 p-2.5 rounded-lg">
          {error}
        </div>
      )}
    </div>
  )
}
