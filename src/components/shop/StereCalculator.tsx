"use client"

import { useState } from "react"
import { Calculator, Flame, Info, Check } from "lucide-react"
import { stereToM3 } from "@/lib/utils"

export function StereCalculator() {
  const [surface, setSurface] = useState<number>(100)
  const [usage, setUsage] = useState<"principal" | "appoint">("principal")
  const [insulation, setInsulation] = useState<"bonne" | "moyenne" | "faible">("moyenne")
  const [cutLength, setCutLength] = useState<number>(33)

  // Calcul d'estimation en stères
  const baseRatio = usage === "principal" ? 0.08 : 0.035
  const coefInsulation = insulation === "bonne" ? 0.75 : insulation === "moyenne" ? 1.0 : 1.45
  const estimatedSteres = Math.max(2, Math.round(surface * baseRatio * coefInsulation))
  const equivalentM3 = stereToM3(estimatedSteres, cutLength)

  return (
    <div className="bg-amber-950/20 border border-amber-900/30 rounded-2xl p-5 sm:p-7 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-stone-100">Simulateur de Besoins & Volume</h3>
          <p className="text-xs sm:text-sm text-stone-400">Estimez votre consommation annuelle et cubage réel</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
        {/* Surface */}
        <div>
          <label className="text-xs font-medium text-stone-300 block mb-2">
            Surface à chauffer : <span className="text-amber-400 font-bold">{surface} m²</span>
          </label>
          <input
            type="range"
            min="30"
            max="300"
            step="10"
            value={surface}
            onChange={(e) => setSurface(Number(e.target.value))}
            className="w-full accent-amber-500 h-2 bg-stone-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-stone-500 mt-1">
            <span>30 m²</span>
            <span>150 m²</span>
            <span>300 m²</span>
          </div>
        </div>

        {/* Type d'usage */}
        <div>
          <label className="text-xs font-medium text-stone-300 block mb-2">Mode de chauffage</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setUsage("principal")}
              className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all text-center min-h-[44px] ${
                usage === "principal"
                  ? "bg-amber-500 text-stone-950 border-amber-400 font-semibold shadow-md"
                  : "bg-stone-900/60 text-stone-300 border-stone-800 hover:border-stone-700"
              }`}
            >
              Principal
            </button>
            <button
              type="button"
              onClick={() => setUsage("appoint")}
              className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all text-center min-h-[44px] ${
                usage === "appoint"
                  ? "bg-amber-500 text-stone-950 border-amber-400 font-semibold shadow-md"
                  : "bg-stone-900/60 text-stone-300 border-stone-800 hover:border-stone-700"
              }`}
            >
              Appoint / Plaisir
            </button>
          </div>
        </div>

        {/* Isolation */}
        <div>
          <label className="text-xs font-medium text-stone-300 block mb-2">Qualité d&apos;isolation</label>
          <div className="grid grid-cols-3 gap-2">
            {(["bonne", "moyenne", "faible"] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setInsulation(lvl)}
                className={`py-2 px-2 text-xs rounded-xl border capitalize min-h-[44px] transition-all ${
                  insulation === lvl
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/50 font-medium"
                    : "bg-stone-900/60 text-stone-400 border-stone-800 hover:border-stone-700"
                }`}
              >
                {lvl === "bonne" ? "Récente" : lvl === "moyenne" ? "Standard" : "Ancienne"}
              </button>
            ))}
          </div>
        </div>

        {/* Longueur de coupe */}
        <div>
          <label className="text-xs font-medium text-stone-300 block mb-2">Coupe des bûches souhaitée</label>
          <div className="grid grid-cols-3 gap-2">
            {[25, 33, 50].map((len) => (
              <button
                key={len}
                type="button"
                onClick={() => setCutLength(len)}
                className={`py-2 px-2 text-xs rounded-xl border min-h-[44px] transition-all ${
                  cutLength === len
                    ? "bg-amber-500 text-stone-950 border-amber-400 font-bold shadow-md"
                    : "bg-stone-900/60 text-stone-300 border-stone-800 hover:border-stone-700"
                }`}
              >
                {len} cm
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Résultat calculé */}
      <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-950 font-bold text-xl shadow-lg">
            <Flame className="w-6 h-6 text-stone-950 fill-stone-950" />
          </div>
          <div>
            <div className="text-xs text-stone-400">Estimation conseillée :</div>
            <div className="text-xl sm:text-2xl font-black text-amber-400">
              {estimatedSteres} Stères{" "}
              <span className="text-xs sm:text-sm font-normal text-stone-400">
                (soit ≈ {equivalentM3} m³ rangé)
              </span>
            </div>
          </div>
        </div>

        <div className="text-xs text-stone-400 flex items-start sm:items-center gap-1.5 max-w-xs">
          <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
          <span>
            En {cutLength} cm, les bûches s&apos;empilent plus serrées qu&apos;en 1 m d&apos;où un volume apparent de {equivalentM3} m³.
          </span>
        </div>
      </div>
    </div>
  )
}
