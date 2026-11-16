import Link from "next/link"

import { HomeLink } from "@/components/home-link"
import { PixelText } from "@/components/pixel-icons"
import { PetIcon } from "@/components/pixel-pet"

const navLink = "link-underline py-2.5 text-[13px]"

const navItems = [
  { id: "home", label: "Home", href: "/" },
  { id: "projects", label: "Projects", href: "/projects" },
] as const

export function SiteHeader({
  active,
}: {
  // The nav item for the current page, kept underlined.
  active?: (typeof navItems)[number]["id"]
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-30 grid h-header grid-cols-[1fr_auto_1fr] items-center border-b border-border bg-background/92 px-gutter backdrop-blur-[14px] max-tab:grid-cols-[auto_1fr_auto]">
      {/* The name's column mirrors the right one, keeping the nav centred on desktop */}
      <HomeLink aria-label="Polly Hsu, home" className="flex h-7 items-center gap-2.5 justify-self-start">
        <PetIcon />
        <PixelText value="Polly Hsu" className="h-[18px] max-phone:hidden" />
      </HomeLink>
      <nav
        aria-label="Main navigation"
        className="flex items-center gap-[34px] max-tab:ml-6 max-tab:justify-self-start max-tab:gap-6 max-phone:ml-4 max-phone:gap-[18px]"
      >
        {navItems.map((item) => (
          <Link key={item.id} className={navLink} href={item.href} data-active={item.id === active || undefined}>
            {item.label}
          </Link>
        ))}
      </nav>
      {/* Empty right column keeps the nav centred; the theme toggle is hidden while the site is light-only */}
      <div className="flex items-center gap-[22px] justify-self-end max-tab:ml-5 max-phone:ml-3" />
    </header>
  )
}
