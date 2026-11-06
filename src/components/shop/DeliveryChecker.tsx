"use client"

import { useState } from "react"
import { MapPin, Truck, CheckCircle2, AlertCircle, Loader2, Navigation } from "lucide-react"
import { checkPostalCodeEligibility } from "@/app/actions/delivery"
import { useCartStore } from "@/lib/store/cart"
import { formatPrice } from "@/lib/utils"

interface DeliveryCheckerProps {
  compact?: boolean
  className?: string
}

export function DeliveryChecker({ compact = false, className = "" }: DeliveryCheckerProps) {
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

  if (compact) {
    return (
      <div className={`bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow-sm ${className}`}>
        <div className="flex items-center gap-3 mb-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-stone-100">
              Tester votre code postal
            </h4>
            <p className="text-[11px] text-stone-400 leading-tight mt-0.5">
              Livraison camion 19T &amp; chariot tout-terrain
            </p>
          </div>
        </div>

        <form onSubmit={handleCheck} className="flex items-center gap-2 w-full">
          <div className="relative flex-1 min-w-0">
            <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={5}
              placeholder="Code postal (ex: 77100)"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors min-h-[44px]"
            />
          </div>
          <button
            type="submit"
            disabled={loading || code.length < 2}
            className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors min-h-[44px] flex items-center justify-center gap-1.5 shrink-0 active:scale-95"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Navigation className="w-3.5 h-3.5" />
                <span>Vérifier</span>
              </>
            )}
          </button>
        </form>

        {status && (
          <div
            className={`mt-3.5 pt-3 border-t text-xs flex flex-col gap-2 transition-all ${
              status.eligible
                ? "border-emerald-800/40 text-emerald-400"
                : "border-rose-900/40 text-rose-400"
            }`}
          >
            <div className="flex items-start gap-2 font-medium">
              {status.eligible ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <span>{status.message}</span>
            </div>

            {status.eligible && status.feeCents !== undefined && (
              <div className="text-xs font-bold text-stone-200 bg-stone-950 px-3 py-1.5 rounded-lg border border-stone-800 self-start">
                Frais de port : {formatPrice(status.feeCents)}
                {status.threshold ? (
                  <span className="text-amber-400 font-semibold ml-1.5">
                    (Gratuit dès {formatPrice(status.threshold)})
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

  return (
    <div className={`bg-stone-900 border border-stone-800 rounded-2xl p-5 sm:p-7 shadow-sm ${className}`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 rounded-lg bg-stone-950 border border-stone-800 text-amber-500 flex items-center justify-center shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <h4 className="text-base sm:text-lg font-bold text-stone-100">
              Vérifiez la livraison à votre domicile
            </h4>
            <p className="text-xs sm:text-sm text-stone-400">
              Livraison par camion 19T avec chariot tout-terrain pour accès difficile
            </p>
          </div>
        </div>

        <form onSubmit={handleCheck} className="flex items-center gap-2.5 w-full lg:w-auto shrink-0">
          <div className="relative flex-1 lg:w-56 min-w-0">
            <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={5}
              placeholder="Code postal (ex: 77100)"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-10 pr-3.5 py-3 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors min-h-[48px]"
            />
          </div>
          <button
            type="submit"
            disabled={loading || code.length < 2}
            className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold px-5 py-3 rounded-lg text-sm transition-colors min-h-[48px] flex items-center justify-center gap-1.5 shrink-0 active:scale-95"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Navigation className="w-4 h-4" />
                <span>Vérifier</span>
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
            <div className="text-xs sm:text-sm font-bold text-stone-200 bg-stone-950 px-3 py-1.5 rounded border border-stone-800 self-start sm:self-auto">
              Frais de port : {formatPrice(status.feeCents)}
              {status.threshold ? (
                <span className="text-amber-400 font-semibold ml-1.5">
                  (Gratuit dès {formatPrice(status.threshold)})
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
