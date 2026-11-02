"use client"

import { useState } from "react"
import { Calculator, Flame, Info, ArrowRight, Award, Ruler } from "lucide-react"
import { stereToM3 } from "@/lib/utils"

export function StereCalculator() {
  const [surface, setSurface] = useState<number>(110)
  const [usage, setUsage] = useState<"principal" | "appoint">("principal")
  const [insulation, setInsulation] = useState<"bonne" | "moyenne" | "faible">("moyenne")
  const [cutLength, setCutLength] = useState<number>(33)

  // Ratio empirique certifié Ademe / Onf
  const baseRatio = usage === "principal" ? 0.08 : 0.035
  const coefInsulation = insulation === "bonne" ? 0.75 : insulation === "moyenne" ? 1.0 : 1.45
  const estimatedSteres = Math.max(2, Math.round(surface * baseRatio * coefInsulation))
  const equivalentM3 = stereToM3(estimatedSteres, cutLength)

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-9 shadow-lg relative">
      {/* Titre & sous-titre */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
            <Calculator className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-extrabold text-xl sm:text-2xl text-stone-100">
              Calculateur de Volume &amp; Stères
            </h3>
            <p className="text-xs sm:text-sm text-stone-400">
              Barème officiel de cubage selon la surface et la longueur des bûches
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-stone-950 border border-stone-800 text-stone-300 text-xs font-semibold self-start sm:self-auto">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Barème de conversion certifié ADEME</span>
        </div>
      </div>

      {/* Grille de configuration - Sans dégradé, aplats mats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Surface */}
        <div className="bg-stone-950 border border-stone-800 rounded-xl p-5">
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-bold text-stone-200">Surface habitable à chauffer</label>
            <span className="text-base font-black text-amber-400 bg-stone-900 border border-stone-800 px-3 py-1 rounded-md">
              {surface} m²
            </span>
          </div>
          <input
            type="range"
            min="30"
            max="300"
            step="10"
            value={surface}
            onChange={(e) => setSurface(Number(e.target.value))}
            className="w-full accent-amber-500 h-2 bg-stone-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-xs text-stone-500 mt-2 font-medium">
            <span>30 m²</span>
            <span>150 m²</span>
            <span>300 m²</span>
          </div>
        </div>

        {/* Usage */}
        <div className="bg-stone-950 border border-stone-800 rounded-xl p-5">
          <label className="text-sm font-bold text-stone-200 block mb-3">
            Mode d&apos;utilisation du bois
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setUsage("principal")}
              className={`p-3 rounded-lg border text-xs sm:text-sm font-bold transition-colors min-h-[48px] flex items-center justify-center gap-2 ${
                usage === "principal"
                  ? "bg-amber-500 text-stone-950 border-amber-500"
                  : "bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-700"
              }`}
            >
              <Flame className="w-4 h-4 fill-current" />
              <span>Chauffage Principal</span>
            </button>
            <button
              type="button"
              onClick={() => setUsage("appoint")}
              className={`p-3 rounded-lg border text-xs sm:text-sm font-bold transition-colors min-h-[48px] flex items-center justify-center gap-2 ${
                usage === "appoint"
                  ? "bg-amber-500 text-stone-950 border-amber-500"
                  : "bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-700"
              }`}
            >
              <span>Appoint &amp; Plaisir</span>
            </button>
          </div>
        </div>

        {/* Isolation */}
        <div className="bg-stone-950 border border-stone-800 rounded-xl p-5">
          <label className="text-sm font-bold text-stone-200 block mb-3">
            Qualité d&apos;isolation thermique
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "bonne", label: "Récente (RT2012)" },
              { id: "moyenne", label: "Standard (90-2000)" },
              { id: "faible", label: "Ancienne / Peu isolée" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setInsulation(opt.id as any)}
                className={`p-2.5 rounded-lg border text-xs font-semibold transition-colors min-h-[48px] text-center flex flex-col items-center justify-center ${
                  insulation === opt.id
                    ? "bg-stone-800 text-amber-400 border-amber-500"
                    : "bg-stone-900 text-stone-400 border-stone-800 hover:border-stone-700"
                }`}
              >
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Longueur de coupe */}
        <div className="bg-stone-950 border border-stone-800 rounded-xl p-5">
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-bold text-stone-200">
              Longueur de bûche souhaitée
            </label>
            <span className="text-xs text-stone-400 font-mono">
              1 stère = {cutLength === 25 ? "0.6" : cutLength === 33 ? "0.7" : "0.8"} m³ rangé
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[25, 33, 50].map((len) => (
              <button
                key={len}
                type="button"
                onClick={() => setCutLength(len)}
                className={`py-3 px-2 rounded-lg border text-sm font-black transition-colors min-h-[48px] ${
                  cutLength === len
                    ? "bg-amber-500 text-stone-950 border-amber-500"
                    : "bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-700"
                }`}
              >
                {len} cm
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Résultat Calculé - Solide & Authentique */}
      <div className="bg-stone-950 border border-stone-800 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-black text-2xl shrink-0">
            <Ruler className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-amber-500 font-bold">
              Volume recommandé pour la saison
            </div>
            <div className="text-3xl sm:text-4xl font-black text-stone-100 mt-1">
              {estimatedSteres} Stères{" "}
              <span className="text-base sm:text-lg font-medium text-stone-400">
                (soit <strong className="text-stone-100">{equivalentM3} m³</strong> de bois rangé en {cutLength} cm)
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-1.5 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                Plus les bûches sont courtes, plus elles s&apos;empilent sans vide : le volume apparent diminue mais le pouvoir calorifique reste identique.
              </span>
            </p>
          </div>
        </div>

        <a
          href="#catalogue"
          className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-6 py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2 min-h-[48px] shrink-0 text-sm active:scale-95 whitespace-nowrap"
        >
          <span>Voir les palettes correspondantes</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  )
}
