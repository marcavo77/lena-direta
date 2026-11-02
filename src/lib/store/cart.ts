import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product } from "@/lib/supabase/database.types"

export interface CartItem {
  product: Product
  quantity: number
}

export interface AccessDiagnosticData {
  truckAccess: "ok" | "narrow" | "tight"
  groundType: "asphalt" | "concrete" | "gravel" | "lawn"
  heightClearance: "ok" | "low"
  turnaroundArea: "yes" | "no"
  slope: "flat" | "moderate" | "steep"
  deliveryEngin: "standard_19t" | "all_terrain_forklift" | "tailgate_truck"
  confirmed: boolean
}

export type FulfillmentMethod = "delivery" | "drive"

interface CartStore {
  items: CartItem[]
  postalCode: string | null
  deliveryFeeCents: number
  isDeliveryEligible: boolean | null
  departmentName: string | null
  fulfillmentMethod: FulfillmentMethod
  promoCode: string | null
  promoDiscountCents: number
  accessDiagnostic: AccessDiagnosticData | null

  // Actions
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  setFulfillmentMethod: (method: FulfillmentMethod) => void
  setPromoCode: (code: string | null, discountCents?: number) => boolean
  setAccessDiagnostic: (diagnostic: AccessDiagnosticData) => void
  setDeliveryInfo: (info: {
    postalCode: string
    feeCents: number
    eligible: boolean
    department: string
  }) => void

  // Computed totals
  getItemCount: () => number
  getSubtotalCents: () => number
  getVolumeDiscountCents: () => number
  getDriveDiscountCents: () => number
  getEffectiveDeliveryFeeCents: () => number
  getTotalCents: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      postalCode: null,
      deliveryFeeCents: 0,
      isDeliveryEligible: null,
      departmentName: null,
      fulfillmentMethod: "delivery",
      promoCode: null,
      promoDiscountCents: 0,
      accessDiagnostic: null,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((item) => item.product.id === product.id)
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            }
          }
          return { items: [...state.items, { product, quantity }] }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }))
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }))
      },

      clearCart: () => {
        set({
          items: [],
          deliveryFeeCents: 0,
          isDeliveryEligible: null,
          promoCode: null,
          promoDiscountCents: 0,
          accessDiagnostic: null,
        })
      },

      setFulfillmentMethod: (method) => {
        set({ fulfillmentMethod: method })
      },

      setPromoCode: (code, discountCents = 1500) => {
        if (!code) {
          set({ promoCode: null, promoDiscountCents: 0 })
          return true
        }
        const clean = code.trim().toUpperCase()
        if (clean === "LENA15" || clean === "BIENVENUE" || clean === "HIVER2026") {
          set({ promoCode: clean, promoDiscountCents: discountCents })
          return true
        }
        return false
      },

      setAccessDiagnostic: (diagnostic) => {
        set({ accessDiagnostic: diagnostic })
      },

      setDeliveryInfo: ({ postalCode, feeCents, eligible, department }) => {
        set({
          postalCode,
          deliveryFeeCents: feeCents,
          isDeliveryEligible: eligible,
          departmentName: department,
        })
      },

      getItemCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0)
      },

      getSubtotalCents: () => {
        return get().items.reduce(
          (acc, item) => acc + item.product.unit_price_cents * item.quantity,
          0
        )
      },

      getVolumeDiscountCents: () => {
        const totalUnits = get().getItemCount()
        if (totalUnits >= 3) return 6000 // -60 € pour 3 palettes ou plus
        if (totalUnits >= 2) return 2500 // -25 € pour 2 palettes
        return 0
      },

      getDriveDiscountCents: () => {
        if (get().fulfillmentMethod !== "drive") return 0
        const totalUnits = get().getItemCount()
        return totalUnits * 4000 // -40 € par palette en retrait dépôt
      },

      getEffectiveDeliveryFeeCents: () => {
        if (get().fulfillmentMethod === "drive") return 0
        return get().deliveryFeeCents
      },

      getTotalCents: () => {
        const subtotal = get().getSubtotalCents()
        const volumeDiscount = get().getVolumeDiscountCents()
        const driveDiscount = get().getDriveDiscountCents()
        const promoDiscount = get().promoDiscountCents
        const deliveryFee = get().getEffectiveDeliveryFeeCents()

        const net = subtotal - volumeDiscount - driveDiscount - promoDiscount + deliveryFee
        return Math.max(0, net)
      },
    }),
    {
      name: "lenadireta-cart-storage",
    }
  )
)
