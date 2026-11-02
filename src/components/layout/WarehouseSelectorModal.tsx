"use client"

import { useState } from "react"
import { Warehouse, MapPin, Check, X, Truck, Clock, ArrowRight } from "lucide-react"
import { useCartStore } from "@/lib/store/cart"

export interface WarehouseOption {
  id: string
  name: string
  address: string
  hours: string
  distanceInfo: string
  isCentral?: boolean
}

export const WAREHOUSES: WarehouseOption[] = [
  {
    id: "nangis-77",
    name: "Dépôt Central & Exploitation Nangis (77)",
    address: "Route Départementale 140, 77370 Nangis",
    hours: "Lun - Sam : 08h00 - 18h00",
    distanceInfo: "Stock direct scierie (Palettes & Granulés)",
    isCentral: true,
  },
  {
    id: "melun-77",
    name: "Dépôt Relais Melun Sud (77)",
    address: "Zone Industrielle de Vaux-le-Pénil, 77000 Melun",
    hours: "Lun - Ven : 08h30 - 17h30",
    distanceInfo: "Accès remorque et camionnette",
  },
  {
    id: "meaux-77",
    name: "Dépôt Relais Meaux Nord (77)",
    address: "Avenue des Sablons Bouillants, 77100 Meaux",
    hours: "Lun - Ven : 08h30 - 17h30",
    distanceInfo: "Chargement au transpalette",
  },
  {
    id: "evry-91",
    name: "Dépôt Relais Évry / Corbeil (91)",
    address: "Avenue des Roissy-Hauts, 91100 Corbeil-Essonnes",
    hours: "Lun - Ven : 08h00 - 17h00",
    distanceInfo: "Proche Francilienne (N104)",
  },
]

interface WarehouseSelectorModalProps {
  isOpen: boolean
  onClose: () => void
}

export function WarehouseSelectorModal({ isOpen, onClose }: WarehouseSelectorModalProps) {
  const { fulfillmentMethod, setFulfillmentMethod } = useCartStore()
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>("nangis-77")

  if (!isOpen) return null

  const handleSelect = (wId: string) => {
    setSelectedWarehouseId(wId)
    setFulfillmentMethod("drive")
    onClose()
  }

  const handleSwitchToDelivery = () => {
    setFulfillmentMethod("delivery")
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1c1917] border border-stone-800 rounded-2xl max-w-lg w-full p-6 text-stone-100 shadow-2xl relative space-y-5">
        {/* En-tête */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center">
              <Warehouse className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-100">
                Choisir mon entrepôt de retrait (Drive)
              </h3>
              <p className="text-xs text-stone-400">
                Économisez 40 € par palette en venant charger directement
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Liste des dépôts */}
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {WAREHOUSES.map((w) => {
            const isSelected = selectedWarehouseId === w.id && fulfillmentMethod === "drive"
            return (
              <button
                key={w.id}
                type="button"
                onClick={() => handleSelect(w.id)}
                className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-start justify-between gap-3 ${
                  isSelected
                    ? "border-amber-500 bg-amber-500/10 text-stone-100 font-bold"
                    : "border-stone-800 bg-stone-900/60 text-stone-300 hover:border-stone-700 hover:bg-stone-900"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-100">{w.name}</span>
                    {w.isCentral && (
                      <span className="text-[10px] uppercase font-black bg-amber-500 text-stone-950 px-1.5 py-0.2 rounded">
                        Central
                      </span>
                    )}
                  </div>
                  <div className="text-stone-400 flex items-center gap-1.5 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                    <span>{w.address}</span>
                  </div>
                  <div className="text-stone-400 flex items-center gap-1.5 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                    <span>{w.hours}</span>
                  </div>
                </div>

                {isSelected ? (
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 mt-1">
                    <Check className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="text-stone-500 hover:text-stone-300 text-xs shrink-0 mt-1">
                    Choisir
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Option Alternative : Livraison à domicile */}
        <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
          <span className="text-stone-400">Vous préférez être livré chez vous ?</span>
          <button
            type="button"
            onClick={handleSwitchToDelivery}
            className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition-colors"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Passer en livraison camion</span>
          </button>
        </div>
      </div>
    </div>
  )
}
