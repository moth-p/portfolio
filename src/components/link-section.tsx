import Link from "next/link"

import { FadeInUp } from "@/components/fade-in-up"
import { ArrowIcon } from "@/components/icons"
import { cn } from "@/lib/utils"

const links = [
  { label: "More Works", href: "/works" },
]

// The last panel of the hero stage, shown the moment the work flow leaves (see Hero). `play` runs the
// entrance; the panel itself handles leaving.
export function LinkSection({ play }: { play: boolean }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-gutter text-center">
      <FadeInUp as="p" play={play} className="max-w-[16em] text-[clamp(38px,5vw,74px)] leading-[1.08] tracking-[-0.045em] max-phone:text-[clamp(28px,8.5vw,38px)]">
        Good design should feel{" "}
        <em className="rounded-full bg-highlight px-[0.3em] py-[0.02em] font-serif font-normal text-ink italic">obvious</em> in hindsight. I
        bring strategy and interaction together to get there.
      </FadeInUp>
      <div
        className={cn(
          "mt-20 flex flex-wrap justify-center gap-3 max-tab:mt-14",
          play ? "animate__animated animate__fadeInUp [animation-delay:500ms]" : "opacity-0",
        )}
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-[15px] rounded-full border border-foreground py-3.5 pr-4 pl-5 text-[13px] transition-colors duration-[250ms] hover:bg-foreground hover:text-background dark:hover:bg-highlight dark:hover:text-ink"
          >
            {link.label} <ArrowIcon className="w-4" />
          </Link>
        ))}
      </div>
    </div>
  )
}
