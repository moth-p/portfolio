import type { Metadata } from "next"
import { Instrument_Serif } from "next/font/google"
import localFont from "next/font/local"
import type { ReactNode } from "react"

import { ThemeProvider } from "@/components/theme-provider"

import "animate.css"
import "./globals.css"

// Clash Display from Fontshare (fontshare.com/fonts/clash-display)
const clashDisplay = localFont({
  src: [
    { path: "./fonts/ClashDisplay-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ClashDisplay-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/ClashDisplay-Semibold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-clash-display",
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
})

export const metadata: Metadata = {
  title: {
    default: "Avery Vale",
    template: "%s — Avery Vale",
  },
  description:
    "Showcases a frontend developer’s skills and projects with a polished portfolio, featuring right-to-left project browsing and detailed case studies.",
  robots: { index: false, follow: false },
  icons: { icon: "/favicon.png" },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${clashDisplay.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider attribute="data-theme" storageKey="portfolio-theme" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
