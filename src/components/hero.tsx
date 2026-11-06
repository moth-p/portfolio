"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { FadeInUp } from "@/components/fade-in-up"
import { ArrowIcon } from "@/components/icons"
import { Projects, type ProjectsMotion } from "@/components/projects"
import { Button } from "@/components/ui/button"
import { Workflow } from "@/components/workflow"
import { projects } from "@/data/projects"
import { workflowSteps } from "@/data/workflow"
import { cn } from "@/lib/utils"

// Scroll distances in viewport heights. The hero hands over to the project list once SWITCH_AT has been scrolled…
const SWITCH_AT = 0.12
// …which unfolds one project per PROJECT_STEP…
const PROJECT_STEP = 0.5
const FLOW_AT = SWITCH_AT + projects.length * PROJECT_STEP
// …then the work flow stays pinned until it leaves (fading out upwards) at LEAVE_AT.
const LEAVE_AT = FLOW_AT + 1.08
const TRACK = LEAVE_AT + 0.3

const PHASES = ["hero", "projects", "flow", "after"] as const
type Phase = (typeof PHASES)[number]

type HeroMotion = "none" | "out-up" | "in-down"
type FlowMotion = "hidden" | "enter" | "in-down" | "out-up" | "out-down"

const panelClass: Record<HeroMotion | FlowMotion, string> = {
  none: "",
  hidden: "opacity-0",
  // Entering from above, the work flow's parts run their own staged fade-ins (see Workflow).
  enter: "",
  "in-down": "animate__animated animate__fadeInDown",
  "out-up": "animate__animated animate__fadeOutUp",
  "out-down": "animate__animated animate__fadeOutDown",
}

// Scroll position (in viewport heights) that opens a given project.
const projectScroll = (index: number) => SWITCH_AT + (index + 0.5) * PROJECT_STEP
// After entering the list from the hero, the scroll stays on the first project for at least
// LANDING_HOLD_MS, and longer while the swipe's wheel events keep coming (up to LANDING_HOLD_MAX_MS).
const LANDING_HOLD_MS = 1000
const LANDING_QUIET_MS = 200
const LANDING_HOLD_MAX_MS = 2500

export function Hero() {
  const [phase, setPhase] = useState<Phase>("hero")
  const [activeProject, setActiveProject] = useState(0)
  const [heroMotion, setHeroMotion] = useState<HeroMotion>("none")
  const [projectsMotion, setProjectsMotion] = useState<ProjectsMotion>("hidden")
  const [flowMotion, setFlowMotion] = useState<FlowMotion>("hidden")
  // Bumped each time a panel is entered from above so its entrance animation replays.
  const [projectsKey, setProjectsKey] = useState(0)
  const [flowKey, setFlowKey] = useState(0)
  const currentPhase = useRef<Phase>("hero")
  // Until this time the scroll is held on the first project (see LANDING_HOLD_MS).
  const holdUntil = useRef(0)
  const holdLimit = useRef(0)
  // False until the first sync, which only picks up a restored scroll position.
  const started = useRef(false)

  const sync = useCallback(() => {
    if (performance.now() < holdUntil.current) {
      window.scrollTo({ top: projectScroll(0) * window.innerHeight, behavior: "instant" })
      return
    }
    // The hero opens the page, so the page scroll is how far into the track we are.
    let scrolled = window.scrollY / window.innerHeight
    const next: Phase =
      scrolled > LEAVE_AT ? "after" : scrolled > FLOW_AT ? "flow" : scrolled > SWITCH_AT ? "projects" : "hero"
    // Scrolling down from the hero always lands on the first project and holds there while the
    // slides fade in, so a fast swipe can't carry past them.
    if (started.current && currentPhase.current === "hero" && next === "projects") {
      scrolled = projectScroll(0)
      window.scrollTo({ top: scrolled * window.innerHeight, behavior: "instant" })
      holdUntil.current = performance.now() + LANDING_HOLD_MS
      holdLimit.current = performance.now() + LANDING_HOLD_MAX_MS
    }
    started.current = true
    setActiveProject(Math.min(projects.length - 1, Math.max(0, Math.floor((scrolled - SWITCH_AT) / PROJECT_STEP))))

    const previous = currentPhase.current
    if (next === previous) return
    currentPhase.current = next
    setPhase(next)
    const forward = PHASES.indexOf(next) > PHASES.indexOf(previous)

    if (next === "hero") setHeroMotion("in-down")
    else if (previous === "hero") setHeroMotion("out-up")

    if (next === "projects") {
      setProjectsMotion(forward ? "in-up" : "in-down")
      if (forward) setProjectsKey((key) => key + 1)
    } else if (previous === "projects") {
      setProjectsMotion(forward ? "out-up" : "out-down")
    }

    if (next === "flow") {
      setFlowMotion(forward ? "enter" : "in-down")
      if (forward) setFlowKey((key) => key + 1)
    } else if (previous === "flow") {
      setFlowMotion(forward ? "out-up" : "out-down")
    }
  }, [])

  const selectProject = useCallback((index: number) => {
    window.scrollTo({ top: projectScroll(index) * window.innerHeight, behavior: "smooth" })
  }, [])

  useEffect(() => {
    // Pick up a restored scroll position (e.g. after a reload mid-page).
    const frame = requestAnimationFrame(sync)
    // Swallow wheel and touch scrolling (including trackpad momentum) while the first project is held.
    const hold = (event: Event) => {
      const now = performance.now()
      if (now >= holdUntil.current) return
      event.preventDefault()
      holdUntil.current = Math.min(holdLimit.current, Math.max(holdUntil.current, now + LANDING_QUIET_MS))
    }
    window.addEventListener("scroll", sync, { passive: true })
    window.addEventListener("resize", sync)
    window.addEventListener("wheel", hold, { passive: false })
    window.addEventListener("touchmove", hold, { passive: false })
    return () => {
      window.removeEventListener("scroll", sync)
      window.removeEventListener("resize", sync)
      window.removeEventListener("wheel", hold)
      window.removeEventListener("touchmove", hold)
      cancelAnimationFrame(frame)
    }
  }, [sync])

  return (
    <div
      className="relative border-b border-border"
      style={{ height: `calc(100svh + ${TRACK * 100}svh)` }}
    >
      {/* Anchor for "Work" links: lands on the first project */}
      <div id="work" aria-hidden="true" className="absolute inset-x-0" style={{ top: `${projectScroll(0) * 100}svh` }} />
      <div className="grid-lines sticky top-0 h-svh overflow-hidden">
        <section
          aria-labelledby="hero-title"
          inert={phase !== "hero"}
          className={cn(
            "absolute inset-x-0 top-0 grid h-[calc(100svh-88px)] overflow-hidden grid-cols-12 px-gutter max-phone:h-[calc(100svh-72px)]",
            panelClass[heroMotion],
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

        <section aria-labelledby="projects-title" inert={phase !== "projects"} className="absolute inset-0">
          {/* Remounting on each appearance from above replays the entrance sequence */}
          <Projects
            key={projectsKey}
            projects={projects}
            activeIndex={activeProject}
            motion={projectsMotion}
            onSelect={selectProject}
          />
        </section>

        <section
          aria-labelledby="workflow-title"
          inert={phase !== "flow"}
          className={cn("absolute inset-0", panelClass[flowMotion])}
        >
          <Workflow key={flowKey} steps={workflowSteps} />
        </section>
      </div>
    </div>
  )
}
