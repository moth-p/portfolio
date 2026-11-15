import { HomeLink } from "@/components/home-link"
import { PixelText } from "@/components/pixel-icons"

export function SiteFooter() {
  return (
    <footer className="bg-footer text-footer-foreground">
      <div className="flex items-center justify-between gap-x-6 px-gutter py-7">
        <HomeLink aria-label="Polly Hsu, home">
          <PixelText value="Polly Hsu" className="h-[18px]" />
        </HomeLink>
        <span className="text-[11px] text-muted-foreground">© 2026</span>
      </div>
    </footer>
  )
}
