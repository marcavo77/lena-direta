"use client"

import { useState } from "react"
import { Drawer } from "vaul"
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, ShieldCheck } from "lucide-react"
import { useCartStore } from "@/lib/store/cart"
import { formatPrice } from "@/lib/utils"
import Image from "next/image"

export function CartDrawer() {
  const [open, setOpen] = useState(false)
  const {
    items,
    removeItem,
    updateQuantity,
    getItemCount,
    getSubtotalCents,
    getTotalCents,
    deliveryFeeCents,
    departmentName,
  } = useCartStore()

  const count = getItemCount()
  const subtotal = getSubtotalCents()
  const total = getTotalCents()

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      {/* Bouton Panier Flottant / Déclencheur Mobile & Desktop */}
      <Drawer.Trigger asChild>
        <button
          type="button"
          aria-label="Voir mon panier"
          className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-amber-500 text-stone-950 font-bold shadow-lg hover:bg-amber-400 active:scale-95 transition-all"
        >
          <ShoppingBag className="w-5 h-5" />
          {count > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-stone-950 text-amber-400 text-xs font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-amber-500 shadow">
              {count}
            </span>
          )}
        </button>
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm z-50 transition-opacity" />
        <Drawer.Content className="bg-stone-900 border-t sm:border-l border-stone-800 flex flex-col rounded-t-[28px] sm:rounded-t-none sm:rounded-l-[28px] fixed bottom-0 right-0 max-h-[92vh] sm:max-h-full sm:h-full w-full sm:max-w-md z-50 focus:outline-none text-stone-100">
          {/* Poignée de drag mobile */}
          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-stone-700 my-3 sm:hidden" />

          {/* En-tête */}
          <div className="px-5 py-4 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-500" />
              <h2 className="font-bold text-lg">Votre Panier ({count})</h2>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-9 h-9 rounded-lg bg-stone-800 flex items-center justify-center text-stone-400 hover:text-stone-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Liste des articles */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-stone-800/60 flex items-center justify-center mx-auto mb-4 text-stone-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-stone-300">Votre panier est vide</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                  Découvrez nos stères de chêne séché et nos granulés de bois certifiés Din+.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-stone-950/60 border border-stone-800/80 rounded-2xl p-3.5 flex gap-3.5 items-center"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-stone-900">
                    <Image
                      src={item.product.image_url}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-xs sm:text-sm text-stone-200 truncate">
                      {item.product.name}
                    </h4>
                    <div className="text-amber-400 font-bold text-sm mt-1">
                      {formatPrice(item.product.unit_price_cents * item.quantity)}
                    </div>

                    {/* Contrôle de quantité tactile >= 44px friendly */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-stone-700 rounded-lg bg-stone-900">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-stone-300 hover:text-white"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center text-xs font-semibold text-stone-100">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-stone-300 hover:text-white"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id)}
                        className="text-stone-500 hover:text-rose-400 p-1.5 transition-colors ml-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pied de page & validation */}
          {items.length > 0 && (
            <div className="p-5 border-t border-stone-800 bg-stone-950/90 space-y-3">
              <div className="space-y-1.5 text-xs text-stone-400">
                <div className="flex justify-between">
                  <span>Sous-total articles</span>
                  <span className="font-medium text-stone-200">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>
                    Livraison {departmentName ? `(${departmentName})` : "estimée"}
                  </span>
                  <span className="font-medium text-stone-200">
                    {deliveryFeeCents > 0 ? formatPrice(deliveryFeeCents) : "Calculée à l'étape suivante"}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-stone-100 pt-2 border-t border-stone-800">
                  <span>Total TTC</span>
                  <span className="text-amber-400">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Bouton de commande Sticky Thumb */}
              <button
                type="button"
                onClick={() => alert("Tunnel de commande : configuration Stripe & livraison")}
                className="w-full bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all min-h-[48px] shadow-lg shadow-amber-500/10 text-base"
              >
                <span>Passer la commande</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Paiement sécurisé Stripe &amp; Bois certifié &lt; 20% humidité</span>
              </div>
            </div>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
