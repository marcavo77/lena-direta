import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import NextTopLoader from "nextjs-toploader"
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
  title: "LeñaDirecta | Bois de Chauffage Sec & Granulés Premium Livrés Directement",
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
  authors: [{ name: "LeñaDirecta" }],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "LeñaDirecta | Bois de Chauffage Sec & Granulés Premium",
    description:
      "Vente en ligne et livraison de bois de chauffage dur et pellets certifiés haute performance.",
    url: "https://lena-direta.com",
    siteName: "LeñaDirecta",
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
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.add('light');document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark');document.documentElement.classList.remove('light')}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-stone-950 text-stone-100 transition-colors duration-150">
        <NextTopLoader
          color="#f59e0b"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #f59e0b,0 0 5px #f59e0b"
        />
        {children}
      </body>
    </html>
  )
}
