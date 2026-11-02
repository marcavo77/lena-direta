"use client"

import { useState } from "react"
import {
  Truck,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  Maximize2,
  Trees,
  Compass,
} from "lucide-react"
import type { AccessDiagnosticData } from "@/lib/store/cart"

interface AccessDiagnosticProps {
  value: AccessDiagnosticData | null
  onChange: (data: AccessDiagnosticData) => void
}

export function AccessDiagnostic({ value, onChange }: AccessDiagnosticProps) {
  const [data, setData] = useState<AccessDiagnosticData>(
    value || {
      truckAccess: "ok",
      groundType: "asphalt",
      heightClearance: "ok",
      turnaroundArea: "yes",
      slope: "flat",
      deliveryEngin: "standard_19t",
      confirmed: false,
    }
  )

  const update = (patch: Partial<AccessDiagnosticData>) => {
    const updated = { ...data, ...patch }
    // Auto-calcul de l'engin requis
    if (updated.groundType === "gravel" || updated.groundType === "lawn") {
      updated.deliveryEngin = "all_terrain_forklift"
    } else if (updated.truckAccess === "narrow" || updated.truckAccess === "tight") {
      updated.deliveryEngin = "tailgate_truck"
    } else {
      updated.deliveryEngin = "standard_19t"
    }

    setData(updated)
    onChange(updated)
  }

  // Diagnostic automatique
  const isOptimal =
    data.truckAccess === "ok" &&
    data.heightClearance === "ok" &&
    data.turnaroundArea === "yes" &&
    (data.groundType === "asphalt" || data.groundType === "concrete") &&
    data.slope === "flat"

  const needsAllTerrain =
    data.groundType === "gravel" || data.groundType === "lawn" || data.slope === "moderate"

  const isNarrowStreet = data.truckAccess === "narrow" || data.truckAccess === "tight"

  return (
    <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-5 sm:p-7 space-y-6">
      {/* En-tête avec explication de l'engin */}
      <div>
        <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider mb-1">
          <Truck className="w-4 h-4" />
          <span>Diagnostic d'Accessibilité Logistique</span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-stone-100">
          Vérification de l'accès pour camion porteur 19 Tonnes
        </h3>
        <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
          Nos palettes de bois et granulés pèsent jusqu'à 1 200 kg. La livraison s'effectue par camion porteur 19 tonnes (dimensions : 10m de long, 2,50m de large, 3,80m de haut). Répondez à ces 5 points pour garantir une dépose sans encombre.
        </p>
      </div>

      {/* Questionnaire en 5 points */}
      <div className="space-y-5">
        {/* Q1: Largeur de voie */}
        <div>
          <label className="block text-xs font-bold text-stone-200 mb-2">
            1. Largeur de la rue ou de l'allée d'accès
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => update({ truckAccess: "ok" })}
              className={`p-3 rounded-xl border text-left text-xs transition-all ${
                data.truckAccess === "ok"
                  ? "border-amber-500 bg-amber-500/10 text-stone-100 font-bold"
                  : "border-stone-800 bg-stone-900/60 text-stone-300 hover:border-stone-700"
              }`}
            >
              <div className="font-bold text-stone-100">Plus de 3,00 m</div>
              <div className="text-[11px] text-stone-400 mt-0.5">Accès camion 19T fluide</div>
            </button>

            <button
              type="button"
              onClick={() => update({ truckAccess: "narrow" })}
              className={`p-3 rounded-xl border text-left text-xs transition-all ${
                data.truckAccess === "narrow"
                  ? "border-amber-500 bg-amber-500/10 text-stone-100 font-bold"
                  : "border-stone-800 bg-stone-900/60 text-stone-300 hover:border-stone-700"
              }`}
            >
              <div className="font-bold text-stone-100">Entre 2,50 m et 3,00 m</div>
              <div className="text-[11px] text-stone-400 mt-0.5">Passage étroit mais praticable</div>
            </button>

            <button
              type="button"
              onClick={() => update({ truckAccess: "tight" })}
              className={`p-3 rounded-xl border text-left text-xs transition-all ${
                data.truckAccess === "tight"
                  ? "border-amber-500 bg-amber-500/10 text-stone-100 font-bold"
                  : "border-stone-800 bg-stone-900/60 text-stone-300 hover:border-stone-700"
              }`}
            >
              <div className="font-bold text-stone-100">Moins de 2,50 m</div>
              <div className="text-[11px] text-stone-400 mt-0.5">Camionnette porteur requis</div>
            </button>
          </div>
        </div>

        {/* Q2: Hauteur libre */}
        <div>
          <label className="block text-xs font-bold text-stone-200 mb-2">
            2. Hauteur libre sous câbles, porches et branchages
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => update({ heightClearance: "ok" })}
              className={`p-3 rounded-xl border text-left text-xs transition-all ${
                data.heightClearance === "ok"
                  ? "border-amber-500 bg-amber-500/10 text-stone-100 font-bold"
                  : "border-stone-800 bg-stone-900/60 text-stone-300 hover:border-stone-700"
              }`}
            >
              <div className="font-bold text-stone-100">Dégagée (&gt; 3,80 m)</div>
              <div className="text-[11px] text-stone-400 mt-0.5">Aucun fil ou branche basse</div>
            </button>

            <button
              type="button"
              onClick={() => update({ heightClearance: "low" })}
              className={`p-3 rounded-xl border text-left text-xs transition-all ${
                data.heightClearance === "low"
                  ? "border-amber-500 bg-amber-500/10 text-stone-100 font-bold"
                  : "border-stone-800 bg-stone-900/60 text-stone-300 hover:border-stone-700"
              }`}
            >
              <div className="font-bold text-stone-100">Obstacle bas (&lt; 3,80 m)</div>
              <div className="text-[11px] text-stone-400 mt-0.5">Porche, câbles téléphoniques ou arbres</div>
            </button>
          </div>
        </div>

        {/* Q3: Aire de retournement */}
        <div>
          <label className="block text-xs font-bold text-stone-200 mb-2">
            3. Possibilité de demi-tour ou voie traversante
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => update({ turnaroundArea: "yes" })}
              className={`p-3 rounded-xl border text-left text-xs transition-all ${
                data.turnaroundArea === "yes"
                  ? "border-amber-500 bg-amber-500/10 text-stone-100 font-bold"
                  : "border-stone-800 bg-stone-900/60 text-stone-300 hover:border-stone-700"
              }`}
            >
              <div className="font-bold text-stone-100">Voie traversante ou rond-point</div>
              <div className="text-[11px] text-stone-400 mt-0.5">Le camion peut repartir en marche avant</div>
            </button>

            <button
              type="button"
              onClick={() => update({ turnaroundArea: "no" })}
              className={`p-3 rounded-xl border text-left text-xs transition-all ${
                data.turnaroundArea === "no"
                  ? "border-amber-500 bg-amber-500/10 text-stone-100 font-bold"
                  : "border-stone-800 bg-stone-900/60 text-stone-300 hover:border-stone-700"
              }`}
            >
              <div className="font-bold text-stone-100">Impasse sans demi-tour</div>
              <div className="text-[11px] text-stone-400 mt-0.5">Marche arrière sur plus de 50 mètres</div>
            </button>
          </div>
        </div>

        {/* Q4: Type de sol au point de dépose */}
        <div>
          <label className="block text-xs font-bold text-stone-200 mb-2">
            4. Type de sol au point de dépose de la palette
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            <button
              type="button"
              onClick={() => update({ groundType: "asphalt" })}
              className={`p-3 rounded-xl border text-left text-xs transition-all ${
                data.groundType === "asphalt"
                  ? "border-amber-500 bg-amber-500/10 text-stone-100 font-bold"
                  : "border-stone-800 bg-stone-900/60 text-stone-300 hover:border-stone-700"
              }`}
            >
              <div className="font-bold text-stone-100">Goudron / Enrobé</div>
              <div className="text-[11px] text-stone-400 mt-0.5">Surface lisse et dure</div>
            </button>

            <button
              type="button"
              onClick={() => update({ groundType: "concrete" })}
              className={`p-3 rounded-xl border text-left text-xs transition-all ${
                data.groundType === "concrete"
                  ? "border-amber-500 bg-amber-500/10 text-stone-100 font-bold"
                  : "border-stone-800 bg-stone-900/60 text-stone-300 hover:border-stone-700"
              }`}
            >
              <div className="font-bold text-stone-100">Béton / Pavés</div>
              <div className="text-[11px] text-stone-400 mt-0.5">Sol rigide adapté</div>
            </button>

            <button
              type="button"
              onClick={() => update({ groundType: "gravel" })}
              className={`p-3 rounded-xl border text-left text-xs transition-all ${
                data.groundType === "gravel"
                  ? "border-amber-500 bg-amber-500/10 text-stone-100 font-bold"
                  : "border-stone-800 bg-stone-900/60 text-stone-300 hover:border-stone-700"
              }`}
            >
              <div className="font-bold text-stone-100">Gravier compacté</div>
              <div className="text-[11px] text-stone-400 mt-0.5">Chariot tout-terrain requis</div>
            </button>

            <button
              type="button"
              onClick={() => update({ groundType: "lawn" })}
              className={`p-3 rounded-xl border text-left text-xs transition-all ${
                data.groundType === "lawn"
                  ? "border-amber-500 bg-amber-500/10 text-stone-100 font-bold"
                  : "border-stone-800 bg-stone-900/60 text-stone-300 hover:border-stone-700"
              }`}
            >
              <div className="font-bold text-stone-100">Pelouse / Terre</div>
              <div className="text-[11px] text-stone-400 mt-0.5">Transpalette standard exclu</div>
            </button>
          </div>
        </div>

        {/* Q5: Pente du terrain */}
        <div>
          <label className="block text-xs font-bold text-stone-200 mb-2">
            5. Pente du terrain d'accès et du lieu de dépose
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => update({ slope: "flat" })}
              className={`p-3 rounded-xl border text-left text-xs transition-all ${
                data.slope === "flat"
                  ? "border-amber-500 bg-amber-500/10 text-stone-100 font-bold"
                  : "border-stone-800 bg-stone-900/60 text-stone-300 hover:border-stone-700"
              }`}
            >
              <div className="font-bold text-stone-100">Plat (&lt; 5%)</div>
              <div className="text-[11px] text-stone-400 mt-0.5">Condition idéale</div>
            </button>

            <button
              type="button"
              onClick={() => update({ slope: "moderate" })}
              className={`p-3 rounded-xl border text-left text-xs transition-all ${
                data.slope === "moderate"
                  ? "border-amber-500 bg-amber-500/10 text-stone-100 font-bold"
                  : "border-stone-800 bg-stone-900/60 text-stone-300 hover:border-stone-700"
              }`}
            >
              <div className="font-bold text-stone-100">Pente modérée (5 à 12%)</div>
              <div className="text-[11px] text-stone-400 mt-0.5">Freinage renforcé requis</div>
            </button>

            <button
              type="button"
              onClick={() => update({ slope: "steep" })}
              className={`p-3 rounded-xl border text-left text-xs transition-all ${
                data.slope === "steep"
                  ? "border-amber-500 bg-amber-500/10 text-stone-100 font-bold"
                  : "border-stone-800 bg-stone-900/60 text-stone-300 hover:border-stone-700"
              }`}
            >
              <div className="font-bold text-stone-100">Forte pente (&gt; 12%)</div>
              <div className="text-[11px] text-stone-400 mt-0.5">Dépose en bas de pente</div>
            </button>
          </div>
        </div>
      </div>

      {/* Résultat du Diagnostic Automatique */}
      <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/80 space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-stone-400">
          Résultat de l'analyse logistique
        </div>

        {isOptimal ? (
          <div className="flex items-start gap-2.5 text-xs text-stone-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-400">Accès Optimal Validé : </span>
              Votre adresse est parfaitement accessible pour notre camion porteur 19 tonnes avec hayon. Dépose rapide et sans contrainte sur votre allée ou devant votre garage.
            </div>
          </div>
        ) : needsAllTerrain ? (
          <div className="flex items-start gap-2.5 text-xs text-stone-200">
            <Truck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-400">Chariot Tout-Terrain Affecté : </span>
              En raison de la nature de votre sol (gravier/pelouse) ou de la pente, nous affectons un camion équipé d'un chariot élévateur tout-terrain à roues motrices (type Manitou/Moffett) pour rouler sans vous enliser.
            </div>
          </div>
        ) : isNarrowStreet ? (
          <div className="flex items-start gap-2.5 text-xs text-stone-200">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-400">Rue étroite signalée : </span>
              La mention sera transmise au chauffeur-livreur. Si nécessaire, un véhicule porteur court (12T) sera programmé lors de la prise de rendez-vous.
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2.5 text-xs text-stone-200">
            <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-400">Accès particulier : </span>
              Le chauffeur vous appellera 24h avant pour affiner le protocole de dépose selon les contraintes signalées.
            </div>
          </div>
        )}
      </div>

      {/* Engagement du Client (Case à cocher obligatoire) */}
      <div className="pt-2">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={data.confirmed}
            onChange={(e) => update({ confirmed: e.target.checked })}
            className="w-5 h-5 mt-0.5 rounded bg-stone-900 border-stone-700 text-amber-500 focus:ring-amber-500 shrink-0 cursor-pointer"
          />
          <span className="text-xs text-stone-300 leading-relaxed group-hover:text-stone-100 transition-colors">
            Je certifie sur l'honneur l'exactitude de ces informations d'accessibilité. J'ai vérifié que le camion de 19 tonnes peut accéder sans danger jusqu'à l'adresse indiquée.
          </span>
        </label>
      </div>
    </div>
  )
}
