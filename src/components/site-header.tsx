import Link from "next/link"

import { BrandMark } from "@/components/brand-mark"
import { ThemeToggle } from "@/components/theme-toggle"

const navLink = "link-underline py-2.5 text-[13px]"

export function SiteHeader({ detail = false }: { detail?: boolean }) {
  return (
    <header className="relative z-20 grid min-h-[88px] grid-cols-[1fr_auto_1fr] items-center border-b border-border bg-background/92 px-gutter backdrop-blur-[14px] max-tab:grid-cols-[1fr_auto_auto] max-phone:min-h-[72px]">
      <BrandMark className="border-foreground" />
      <nav
        aria-label="Main navigation"
        className="flex items-center gap-[34px] max-tab:justify-self-end max-tab:gap-6 max-phone:gap-[18px]"
      >
        {detail ? (
          <Link className={navLink} href="/">
            Back to work
          </Link>
        ) : (
          <>
            <a className={navLink} href="#work" data-active>
              Work
            </a>
            <a className={navLink} href="#about">
              About
            </a>
          </>
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
