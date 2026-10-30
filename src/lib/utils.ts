import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(cents / 100)
}

/**
 * Calculateur de conversion bois de chauffage
 * 1 stère en 1m = 1 m³ apparent
 * En 50cm : coefficient 0.8 => 1 stère = 0.8 m³
 * En 33cm : coefficient 0.7 => 1 stère = 0.7 m³
 * En 25cm : coefficient 0.6 => 1 stère = 0.6 m³
 */
export function stereToM3(stere: number, lengthCm: number): number {
  const coefficients: Record<number, number> = {
    100: 1.0,
    50: 0.8,
    33: 0.7,
    25: 0.6,
  }
  const coef = coefficients[lengthCm] ?? 0.7
  return Number((stere * coef).toFixed(2))
}
