"use client"

import { useState } from "react"
import { Building2, Copy, Check, Printer, ShieldCheck, AlertCircle } from "lucide-react"

interface RibPaymentCardProps {
  orderNumber: string
  totalFormatted: string
  depositFormatted?: string
  paymentMethod?: string
  customerPhone: string
}

export function RibPaymentCard({
  orderNumber,
  totalFormatted,
  depositFormatted,
  paymentMethod = "transfer",
  customerPhone,
}: RibPaymentCardProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const iban = "FR76 1027 8000 0000 1234 5678 901"
  const bic = "AGRIFRPP"
  const titulaire = "LEÑADIRECTA SAS"
  const banque = "Crédit Agricole d'Île-de-France"

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldName)
    setTimeout(() => setCopiedField(null), 2500)
  }

  const isDeposit = paymentMethod === "deposit"
  const amountToTransfer = isDeposit && depositFormatted ? depositFormatted : totalFormatted

  return (
    <div className="bg-[#1c1917] border-2 border-amber-500/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
      {/* Bandeau d'en-tête du RIB */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-500">
              Coordonnées Bancaires Officielles • Scierie
            </span>
            <h3 className="text-lg sm:text-xl font-black text-stone-100">
              {isDeposit ? "Acompte 30% par Virement Bancaire" : "Règlement par Virement Bancaire (RIB)"}
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-300 hover:text-amber-400 bg-stone-900 border border-stone-800 hover:border-amber-500/40 px-3.5 py-2 rounded-xl transition-all self-start sm:self-auto min-h-[40px]"
        >
          <Printer className="w-4 h-4 text-amber-500" />
          <span>Imprimer le RIB</span>
        </button>
      </div>

      {/* Montant & Motif Obligatoire */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Montant exact */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
            {isDeposit ? "Montant de l'acompte à virer" : "Montant total à virer"}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
            {amountToTransfer}
          </div>
          {isDeposit && (
            <span className="text-[11px] text-stone-500 mt-0.5 block">
              Le solde de {totalFormatted} sera réglé lors de la dépose
            </span>
          )}
        </div>

        {/* Référence OBLIGATOIRE du virement */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-400">
                Motif du virement (Indispensable)
              </span>
              {copiedField === "reference" && (
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Copié !
                </span>
              )}
            </div>
            <div className="font-mono text-xl sm:text-2xl font-black text-stone-100 mt-1">
              {orderNumber}
            </div>
            <span className="text-[11px] text-stone-400 mt-0.5 block">
              À reporter impérativement dans le libellé de votre virement
            </span>
          </div>

          <button
            type="button"
            onClick={() => copyToClipboard(orderNumber, "reference")}
            className="mt-3 inline-flex items-center justify-center gap-2 bg-stone-900 border border-amber-500/40 hover:bg-amber-500 hover:text-stone-950 text-amber-400 font-bold text-xs py-2 px-3 rounded-lg transition-colors min-h-[38px]"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copier le numéro de commande</span>
          </button>
        </div>
      </div>

      {/* Détails Bancaires avec Boutons Copier */}
      <div className="space-y-3 bg-stone-950/70 border border-stone-800 rounded-xl p-5 text-xs">
        {/* IBAN */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-800/80">
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-500 block">IBAN (France)</span>
            <span className="font-mono text-sm sm:text-base font-black text-amber-400 tracking-wider">
              {iban}
            </span>
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard(iban.replace(/\s+/g, ""), "iban")}
            className="inline-flex items-center gap-1.5 self-start sm:self-auto bg-stone-900 border border-stone-800 hover:border-amber-500/50 text-stone-200 hover:text-amber-400 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors min-h-[36px]"
          >
            {copiedField === "iban" ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">IBAN Copié !</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-400" />
                <span>Copier l'IBAN</span>
              </>
            )}
          </button>
        </div>

        {/* BIC & Titulaire & Banque */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* BIC */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-500 block">BIC / SWIFT</span>
              <span className="font-mono text-xs sm:text-sm font-bold text-stone-200">{bic}</span>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(bic, "bic")}
              className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold text-stone-400 hover:text-amber-400"
            >
              <Copy className="w-3 h-3" />
              <span>{copiedField === "bic" ? "Copié !" : "Copier le BIC"}</span>
            </button>
          </div>

          {/* Titulaire */}
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-500 block">Bénéficiaire</span>
            <span className="text-xs sm:text-sm font-bold text-stone-200">{titulaire}</span>
            <span className="text-[11px] text-stone-400 block mt-0.5">Exploitation Forestière &amp; Scierie</span>
          </div>

          {/* Domiciliation */}
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-500 block">Établissement</span>
            <span className="text-xs sm:text-sm font-bold text-stone-200">{banque}</span>
            <span className="text-[11px] text-stone-400 block mt-0.5">Agence Entreprises Nangis (77)</span>
          </div>
        </div>
      </div>

      {/* Garantie d'Expédition après Virement */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-stone-300 space-y-1.5">
        <div className="font-bold text-amber-400 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          <span>Procédure de déblocage des palettes :</span>
        </div>
        <p className="text-[11px] text-stone-400 leading-relaxed">
          1. Effectuez votre virement depuis l'application de votre banque en indiquant la référence{" "}
          <strong className="text-stone-200 font-mono">{orderNumber}</strong>.
          <br />
          2. Dès constatation du virement par notre comptabilité (généralement 24h ou instantané selon les banques), vos palettes sont marquées « Prêtes au départ » sous hangar.
          <br />
          3. Notre transporteur vous appelle au <strong className="text-stone-200">{customerPhone}</strong> pour valider le créneau de dépose à votre domicile.
        </p>
      </div>
    </div>
  )
}
