import type { Metadata } from "next"
import { Noto_Sans_TC } from "next/font/google"
import localFont from "next/font/local"
import type { ReactNode } from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

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

// Traditional Chinese, picked up by the font stack for characters Clash Display lacks. Google serves CJK fonts in
// unicode-range slices, so there is no subset to preload.
const notoSansTC = Noto_Sans_TC({
  weight: ["400", "500", "600"],
  variable: "--font-noto-tc",
  preload: false,
})

export const metadata: Metadata = {
  title: {
    default: "Polly Hsu",
    template: "%s — Polly Hsu",
  },
  description:
    "Showcases a frontend developer’s skills and projects with a polished portfolio, featuring right-to-left project browsing and detailed case studies.",
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={cn(clashDisplay.variable, notoSansTC.variable)}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider attribute="data-theme" storageKey="portfolio-theme" defaultTheme="light" forcedTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
