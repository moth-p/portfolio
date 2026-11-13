import Link from "next/link"

import { ThemeToggle } from "@/components/theme-toggle"

const navLink = "link-underline py-2.5 text-[13px]"

const navItems = [
  { id: "home", label: "Home", href: "/" },
  { id: "works", label: "Works", href: "/works" },
] as const

export function SiteHeader({
  detail = false,
  active,
}: {
  detail?: boolean
  // The nav item for the current page, kept underlined.
  active?: (typeof navItems)[number]["id"]
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-30 grid h-header grid-cols-[1fr_auto_1fr] items-center border-b border-border bg-background/92 px-gutter backdrop-blur-[14px] max-tab:grid-cols-[1fr_auto]">
      {/* Empty first column keeps the nav centred on desktop */}
      <span aria-hidden="true" className="max-tab:hidden" />
      <nav
        aria-label="Main navigation"
        className="flex items-center gap-[34px] max-tab:justify-self-start max-tab:gap-6 max-phone:gap-[18px]"
      >
        {detail ? (
          <Link className={navLink} href="/">
            Back to work
          </Link>
        ) : (
          navItems.map((item) => (
            <Link key={item.id} className={navLink} href={item.href} data-active={item.id === active || undefined}>
              {item.label}
            </Link>
          ))
        )}
      </nav>
      <div className="flex items-center gap-[22px] justify-self-end max-tab:ml-5 max-phone:ml-3">
        <a
          className="flex items-center gap-[9px] justify-self-end text-xs max-tab:hidden"
          href="mailto:hello@averyvale.design"
        >
          <span className="size-2 rounded-full bg-highlight shadow-[0_0_0_4px_color-mix(in_srgb,var(--highlight)_35%,transparent)]" />
          Available for work
        </a>
        <ThemeToggle />
      </div>
    </header>
  )
}
