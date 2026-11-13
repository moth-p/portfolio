import Link from "next/link"

import { FadeInUp } from "@/components/fade-in-up"
import { ArrowIcon } from "@/components/icons"
import { PixelWave } from "@/components/pixel-icons"
import { PET_HEIGHT, PET_WIDTH, PetSprite } from "@/components/pixel-pet"
import { cn } from "@/lib/utils"

const links = [
  { label: "More Projects", href: "/projects" },
]

// The last panel of the hero stage, shown the moment the work flow leaves (see Hero). `play` runs the
// entrance; the panel itself handles leaving. The hero's pet leaves with the work flow, so this screen has its own,
// slashing light waves at the button row on a loop (the swing, wave and hit share one cycle; see globals.css).
// Remounting with the panel restarts all three together, so they stay in step.
export function LinkSection({ play }: { play: boolean }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-gutter text-center">
      <FadeInUp as="p" play={play} className="max-w-[16em] text-[clamp(38px,5vw,74px)] leading-[1.08] tracking-[-0.045em] max-phone:text-[clamp(28px,8.5vw,38px)]">
        Good design should feel{" "}
        <em className="rounded-full bg-highlight px-[0.3em] py-[0.02em] text-[0.85em] font-normal text-ink">obvious</em> in hindsight. I
        bring strategy and interaction together to get there.
      </FadeInUp>
      <div
        className={cn(
          "mt-20 flex items-center justify-center max-tab:mt-14",
          play ? "animate__animated animate__fadeInUp [animation-delay:500ms]" : "opacity-0",
        )}
      >
        {/* Scaled from its full size by --pet-scale, standing a little low so the sword lines up with the button */}
        <div
          aria-hidden="true"
          style={{ width: `calc(${PET_WIDTH}px * var(--pet-scale))`, height: `calc(${PET_HEIGHT}px * var(--pet-scale))` }}
          className="relative flex-none translate-y-[10%] [--pet-scale:0.7] max-phone:[--pet-scale:0.5]"
        >
          <div className="absolute top-0 left-0 origin-top-left" style={{ scale: "var(--pet-scale)" }}>
            <PetSprite mood="awake" hopping={false} attacking />
          </div>
        </div>
        {/* The wave's track, from the sword to the button */}
        <div
          aria-hidden="true"
          className="relative h-10 w-[clamp(70px,10vw,150px)] flex-none [--wave-width:22px] max-phone:w-[44px] max-phone:[--wave-width:16px]"
        >
          <PixelWave className="absolute top-1/2 left-0 w-(--wave-width) animate-light-wave opacity-0 drop-shadow-[0_0_6px_var(--highlight)] motion-reduce:hidden" />
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex animate-wave-hit items-center gap-[15px] rounded-full border border-foreground py-3.5 pr-4 pl-5 text-[17px] font-semibold transition-colors duration-[250ms] hover:bg-highlight hover:text-ink motion-reduce:animate-none max-phone:py-3 max-phone:pr-3.5 max-phone:pl-4 max-phone:text-[15px]"
            >
              {link.label} <ArrowIcon className="w-4" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
