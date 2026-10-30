"use client"

import { useState } from "react"
import { MapPin, Truck, CheckCircle2, AlertCircle, Loader2, Navigation, Check } from "lucide-react"
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
        message: "Veuillez saisir un code postal français valide (5 chiffres).",
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
    <div className="bg-stone-900/95 border-2 border-amber-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-bold text-stone-100">
              Vérifiez la livraison à votre adresse
            </h4>
            <p className="text-xs sm:text-sm text-stone-400">
              Livraison par camion 19T avec chariot élévateur tout-terrain embarqué
            </p>
          </div>
        </div>

        <form onSubmit={handleCheck} className="flex items-center gap-2.5 w-full md:w-auto">
          <div className="relative flex-1 md:w-56">
            <MapPin className="w-4 h-4 text-amber-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={5}
              placeholder="Code postal (ex: 77100)"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className="w-full bg-stone-950 border border-stone-700/80 rounded-xl pl-10 pr-3.5 py-3 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all min-h-[48px]"
            />
          </div>
          <button
            type="submit"
            disabled={loading || code.length < 2}
            className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold px-5 py-3 rounded-xl text-sm transition-all min-h-[48px] flex items-center justify-center gap-1.5 shrink-0 shadow-lg shadow-amber-500/20 active:scale-95"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Navigation className="w-4 h-4" />
                <span>Tester</span>
              </>
            )}
          </button>
        </form>
      </div>

      {status && (
        <div
          className={`mt-5 pt-4 border-t text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all ${
            status.eligible
              ? "border-emerald-800/40 text-emerald-400"
              : "border-rose-900/40 text-rose-400"
          }`}
        >
          <div className="flex items-center gap-2.5 font-medium">
            {status.eligible ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span>{status.message}</span>
          </div>

          {status.eligible && status.feeCents !== undefined && (
            <div className="text-xs sm:text-sm font-bold text-stone-200 bg-stone-950 px-3 py-1.5 rounded-lg border border-stone-800 self-start sm:self-auto">
              Frais de port : {formatPrice(status.feeCents)}
              {status.threshold ? (
                <span className="text-amber-400 font-semibold ml-1.5">
                  (Franco dès {formatPrice(status.threshold)})
                </span>
              ) : (
                ""
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
