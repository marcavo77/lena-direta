import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const viewport: Viewport = {
  themeColor: "#0c0a09",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: "LenaDireta | Bois de Chauffage Sec & Granulés Premium Livrés Directement",
  description:
    "Achetez votre bois de chauffage dur (Chêne, Charme, Hêtre) séché sous abri (< 20% humidité) et granulés Din+. Livraison camion avec chariot embarqué tout-terrain à votre domicile.",
  keywords: [
    "bois de chauffage",
    "stère de bois",
    "granulés de bois",
    "pellets Din+",
    "chêne charme sec",
    "livraison bois de chauffage",
    "bois fendu 33 cm",
    "bois fendu 50 cm",
  ],
  authors: [{ name: "LenaDireta" }],
  openGraph: {
    title: "LenaDireta | Bois de Chauffage Sec & Granulés Premium",
    description:
      "Vente en ligne et livraison de bois de chauffage dur et pellets certifiés haute performance.",
    url: "https://lena-direta.com",
    siteName: "LenaDireta",
    locale: "fr_FR",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-stone-950 text-stone-100">{children}</body>
    </html>
  )
}
