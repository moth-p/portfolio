import { BrandMark } from "@/components/brand-mark"

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com" },
  { label: "Instagram", href: "https://www.instagram.com" },
  { label: "Behance", href: "https://www.behance.net" },
]

export function SiteFooter() {
  return (
    <footer className="bg-footer text-footer-foreground">
      <div className="grid grid-cols-12 items-center px-gutter py-7 max-phone:gap-y-7">
        <BrandMark className="col-span-2 border-footer-foreground" />
        <div className="col-start-5 col-end-9 flex justify-center gap-7 max-tab:col-start-4 max-tab:col-end-10 max-phone:col-start-4 max-phone:col-end-13 max-phone:justify-end max-phone:gap-[18px]">
          {socials.map((social) => (
            <a key={social.label} className="text-[11px]" href={social.href} target="_blank" rel="noreferrer">
              {social.label}
            </a>
          ))}
        </div>
        <span className="col-start-10 col-end-13 justify-self-end text-[11px] text-muted-foreground max-phone:col-span-12 max-phone:justify-self-start">
          © 2025 Avery Vale
        </span>
      </div>
    </footer>
  )
}
