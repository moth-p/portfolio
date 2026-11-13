import Link from "next/link"

import { PixelText } from "@/components/pixel-icons"

export function SiteFooter() {
  return (
    <footer className="bg-footer text-footer-foreground">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-6 px-gutter py-7">
        <Link href="/" aria-label="Polly Hsu, home" className="justify-self-start">
          <PixelText value="Polly Hsu" className="h-[18px]" />
        </Link>
        <a className="text-[11px]" href="https://github.com" target="_blank" rel="noreferrer">
          GitHub
        </a>
        <span className="justify-self-end text-[11px] text-muted-foreground">© 2026</span>
      </div>
    </footer>
  )
}
