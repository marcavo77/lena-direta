"use client"

import { useState } from "react"
import { MapPin, Truck, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { checkPostalCodeEligibility } from "@/app/actions/delivery"
import { useCartStore } from "@/lib/store/cart"
import { formatPrice } from "@/lib/utils"

export function DeliveryChecker() {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{
    eligible: boolean
    message: string
    feeCents?: number
    threshold?: number | null
  } | null>(null)

  const setDeliveryInfo = useCartStore((s) => s.setDeliveryInfo)

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^\d{5}$/.test(code.trim())) {
      setStatus({
        eligible: false,
        message: "Veuillez saisir un code postal valide à 5 chiffres.",
      })
      return
    }

    setLoading(true)
    try {
      const res = await checkPostalCodeEligibility(code)
      setStatus({
        eligible: res.eligible,
        message: res.message,
        feeCents: res.baseFeeCents,
        threshold: res.freeShippingThresholdCents,
      })
      if (res.eligible && res.department) {
        setDeliveryInfo({
          postalCode: code.trim(),
          feeCents: res.baseFeeCents,
          eligible: true,
          department: res.department,
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-stone-100">Testez votre éligibilité de livraison</h4>
            <p className="text-xs text-stone-400">Livraison camion avec chariot embarqué tout-terrain</p>
          </div>
        </div>

        <form onSubmit={handleCheck} className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-44">
            <MapPin className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={5}
              placeholder="Code postal (ex: 77100)"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors min-h-[44px]"
            />
          </div>
          <button
            type="submit"
            disabled={loading || code.length < 2}
            className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all min-h-[44px] flex items-center justify-center shrink-0 shadow-md active:scale-95"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Vérifier"}
          </button>
        </form>
      </div>

      {status && (
        <div
          className={`mt-4 pt-3 border-t text-xs flex items-center justify-between gap-2 transition-all ${
            status.eligible
              ? "border-emerald-900/40 text-emerald-400"
              : "border-red-900/40 text-rose-400"
          }`}
        >
          <div className="flex items-center gap-2">
            {status.eligible ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{status.message}</span>
          </div>

          {status.eligible && status.feeCents !== undefined && (
            <span className="font-semibold text-stone-200 shrink-0">
              Frais dès {formatPrice(status.feeCents)}
              {status.threshold ? ` (Gratuit dès ${formatPrice(status.threshold)})` : ""}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
