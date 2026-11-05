"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { FadeInUp } from "@/components/fade-in-up"
import { ArrowIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Workflow } from "@/components/workflow"
import { workflowSteps } from "@/data/workflow"
import { cn } from "@/lib/utils"

// Scroll distances in viewport heights: the hero holds for INTRO, then the work flow stays pinned for HOLD.
const INTRO = 0.5
const HOLD = 1
// The hero hands over to the work flow once this much has been scrolled…
const SWITCH_AT = 0.12
// …and the work flow leaves (fading out upwards) once this much has been scrolled.
const LEAVE_AT = INTRO + HOLD * 0.7

type Phase = "hero" | "flow" | "after"

export function Hero() {
  const [phase, setPhase] = useState<Phase>("hero")
  // Which phase the work flow was entered from, to pick its entrance animation.
  const [enteredFrom, setEnteredFrom] = useState<Phase>("hero")
  const [hasLeft, setHasLeft] = useState(false)
  // Bumped each time the work flow appears from the hero so its entrance animation replays.
  const [playKey, setPlayKey] = useState(0)
  const currentPhase = useRef<Phase>("hero")

  const sync = useCallback(() => {
    // The hero opens the page, so the page scroll is how far into the track we are.
    const scrolled = window.scrollY / window.innerHeight
    const next: Phase = scrolled > LEAVE_AT ? "after" : scrolled > SWITCH_AT ? "flow" : "hero"
    const previous = currentPhase.current
    if (next === previous) return
    currentPhase.current = next
    setPhase(next)
    if (next !== "hero") setHasLeft(true)
    if (next === "flow") {
      setEnteredFrom(previous)
      if (previous === "hero") setPlayKey((key) => key + 1)
    }
  }, [])

  const showFlow = phase !== "hero"

  useEffect(() => {
    // Pick up a restored scroll position (e.g. after a reload mid-page).
    const frame = requestAnimationFrame(sync)
    window.addEventListener("scroll", sync, { passive: true })
    window.addEventListener("resize", sync)
    return () => {
      window.removeEventListener("scroll", sync)
      window.removeEventListener("resize", sync)
      cancelAnimationFrame(frame)
    }
  }, [sync])

  return (
    <div
      className="relative border-b border-border"
      style={{ height: `calc(100svh + ${(INTRO + HOLD) * 100}svh)` }}
    >
      <div className="grid-lines sticky top-0 h-svh overflow-hidden">
        <section
          aria-labelledby="hero-title"
          inert={showFlow}
          className={cn(
            "absolute inset-x-0 top-0 grid h-[calc(100svh-88px)] overflow-hidden grid-cols-12 px-gutter max-phone:h-[calc(100svh-72px)]",
            showFlow ? "animate__animated animate__fadeOutUp" : hasLeft && "animate__animated animate__fadeInDown",
          )}
        >
          <div className="col-span-12 flex justify-between pt-[clamp(38px,7vh,72px)] text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
            <span>Independent designer</span>
            <span className="max-tab:hidden">Based in Amsterdam</span>
          </div>
          <FadeInUp
            as="h1"
            id="hero-title"
            className="z-[2] col-span-10 mt-[clamp(52px,8vh,100px)] mb-11 max-w-[900px] self-center text-[clamp(58px,8.1vw,124px)] leading-[0.89] font-medium  max-tab:col-span-12 max-tab:mt-[70px] max-tab:self-start max-phone:text-[clamp(48px,15.5vw,70px)]"
          >
            Shape ideas into digital
            experiences.
          </FadeInUp>
          <div className="z-[2] col-span-6 flex items-end justify-between self-end pb-12 max-tab:col-span-11 max-phone:col-span-12 max-phone:gap-[25px]">
            <p className="max-w-[390px] text-[clamp(16px,1.4vw,20px)] leading-normal text-muted-foreground">
              Brand and product designer partnering with thoughtful people to make useful, lasting things.
            </p>
            <Button
              asChild
              variant="outline"
              size="icon"
              className="size-14 flex-none rotate-90 rounded-full border-border bg-background shadow-none duration-[220ms] hover:scale-106 hover:bg-foreground hover:text-background dark:border-border dark:bg-background dark:hover:bg-foreground"
            >
              <a href="#work" aria-label="See selected work">
                <ArrowIcon />
              </a>
            </Button>
          </div>
          <div
            aria-hidden="true"
            className="absolute right-[clamp(18px,5vw,90px)] -bottom-20 aspect-square w-[clamp(230px,28vw,420px)] rounded-full border border-border max-tab:-right-[110px] max-tab:-bottom-10"
          >
            <div className="absolute top-1/2 -left-[12%] h-px w-[124%] -rotate-[35deg] bg-border" />
            <div className="absolute top-[16%] right-[11%] size-6 rounded-full bg-highlight" />
            <span className="absolute top-[30%] left-1/4 -rotate-[35deg] text-[9px] tracking-[0.14em] text-muted-foreground">
              FORM / FUNCTION / FEELING
            </span>
          </div>
        </section>

        <section
          aria-labelledby="workflow-title"
          inert={phase !== "flow"}
          className={cn(
            "absolute inset-0",
            phase === "hero" && (hasLeft ? "animate__animated animate__fadeOutDown" : "opacity-0"),
            // Entering from the hero, the panel's parts run their own staged fade-ins (see Workflow).
            phase === "flow" && enteredFrom === "after" && "animate__animated animate__fadeInDown",
            phase === "after" && "animate__animated animate__fadeOutUp",
          )}
        >
          {/* Remounting on each appearance replays the entrance sequence */}
          <Workflow key={playKey} steps={workflowSteps} />
        </section>
      </div>
    </div>
  )
}
