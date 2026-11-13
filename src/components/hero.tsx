"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { FadeInUp } from "@/components/fade-in-up"
import { ArrowIcon } from "@/components/icons"
import { LinkSection } from "@/components/link-section"
import { PixelCursor, PixelRepeat } from "@/components/pixel-icons"
import { PET_HEIGHT, PET_WIDTH, PetSprite, PetStatus, usePetEnergy } from "@/components/pixel-pet"
import { Projects, type ProjectsMotion } from "@/components/projects"
import { SiteFooter } from "@/components/site-footer"
import { Slogan, type SloganMotion } from "@/components/slogan"
import { Button } from "@/components/ui/button"
import { Workflow } from "@/components/workflow"
import { featuredProjects as projects } from "@/data/projects"
import { workflowSteps } from "@/data/workflow"
import { offsetWithin } from "@/lib/layout"
import { cn } from "@/lib/utils"

// Scroll distances in viewport heights. The hero hands over to the project list once SWITCH_AT has been scrolled…
const SWITCH_AT = 0.12
// …which unfolds one project per PROJECT_STEP, then the slogan, whose cube solves itself in step with the scroll
// between SOLVE_LEAD after it appears and SOLVE_LEAD before it leaves…
const PROJECT_STEP = 0.5
const SLOGAN_AT = SWITCH_AT + projects.length * PROJECT_STEP
const SOLVE_LEAD = 0.2
const SLOGAN_STEP = 1.6
const FLOW_AT = SLOGAN_AT + SLOGAN_STEP
// …then the work flow, which reveals one step (and unfolds its brief) per FLOW_STEP, until LINKS_AT, where it fades
// out and the link section fades in right away with the footer at its bottom. The page ends on that screen,
// LINKS_STEP further down (the track needs to run past LINKS_AT, or the link section could never be reached).
const FLOW_STEP = 0.4
const LINKS_AT = FLOW_AT + workflowSteps.length * FLOW_STEP
const LINKS_STEP = 0.5
const TRACK = LINKS_AT + LINKS_STEP

const PHASES = ["hero", "projects", "slogan", "flow", "links"] as const
type Phase = (typeof PHASES)[number]

type HeroMotion = "none" | "out-up" | "in-down"
type FlowMotion = "hidden" | "enter" | "in-down" | "out-sides" | "out-down"
type LinksMotion = "hidden" | "in" | "out-down"

const panelClass: Record<HeroMotion | FlowMotion, string> = {
  none: "",
  hidden: "opacity-0",
  // Entering from above, the work flow's parts run their own staged fade-ins (see Workflow).
  enter: "",
  // Leaving for the link section, the work flow's halves part to the sides (see Workflow).
  "out-sides": "",
  "in-down": "animate__animated animate__fadeInDown",
  "out-up": "animate__animated animate__fadeOutUp",
  "out-down": "animate__animated animate__fadeOutDown",
}

const linksClass: Record<LinksMotion, string> = {
  hidden: "opacity-0",
  // The text and button run their own fade-ins (see LinkSection).
  in: "",
  "out-down": "animate__animated animate__fadeOutDown",
}

const clamp = (value: number, max: number) => Math.min(max, Math.max(0, value))

// Scroll position (in viewport heights) that opens a given project or work flow step.
const projectScroll = (index: number) => SWITCH_AT + (index + 0.5) * PROJECT_STEP
const flowScroll = (index: number) => FLOW_AT + (index + 0.5) * FLOW_STEP
// After entering the project list from the hero, or the work flow from the slogan, the scroll stays on the first
// project (or step) for at least LANDING_HOLD_MS while the panel fades in, and longer while the swipe's wheel events
// keep coming (up to LANDING_HOLD_MAX_MS).
const LANDING_HOLD_MS = 1000
const LANDING_QUIET_MS = 200
const LANDING_HOLD_MAX_MS = 2500
// Scrolling across the point where the cube starts solving, where it is solved, or where the work flow has shown
// all its steps (before it leaves for the link section), stops there for a moment (STOP_HOLD_MS, stretched while
// wheel events keep coming up to STOP_HOLD_MAX_MS), either way.
const STOPS = [SLOGAN_AT + SOLVE_LEAD, FLOW_AT - SOLVE_LEAD, flowScroll(workflowSteps.length - 1)]
const STOP_HOLD_MS = 350
const STOP_HOLD_MAX_MS = 800

// Entrance order: the title's lines fade in first, then the pixel icons and the pet together — all with fadeInUp.
const TITLE_MS = 1100
const PET_DELAY_MS = TITLE_MS

// The pet walks from its hero spot to the right of each section title, and in the slogan to its own spot beside
// the cube.
const PET_TITLE = {
  projects: "projects-pet-spot",
  slogan: "slogan-pet-spot",
  flow: "workflow-title",
  links: "workflow-title",
} as const
const SLOGAN_PET_SPOT = "slogan-pet-spot"
// Next to a title the pet stands on the baseline and is about as tall as the capitals.
const PET_TITLE_HEIGHT = 0.78
const PET_TITLE_GAP = 0.3
const PET_TITLE_DROP = 0.07

// Pixel icons floating around the title, positioned by their centres (the `translate` property leaves
// `transform` free for the float animation): a mouse pointer well above the first line, a little right of its
// middle, and a repeat sign further right and lower, beside the second line (on phone, where the title fills the
// width, it floats above the title instead).
const heroIcons = [
  {
    name: "cursor",
    Icon: PixelCursor,
    className: "top-[13%] left-[26%] w-[clamp(30px,3.2vw,51px)] max-tab:left-[60%]",
    style: undefined,
  },
  {
    name: "repeat",
    Icon: PixelRepeat,
    className: "top-[47%] left-[53%] w-[clamp(55px,6vw,95px)] max-tab:left-[78%] max-phone:top-[25%] max-phone:left-[82%]",
    style: { animationDelay: "-3s", animationDuration: "7s" },
  },
]

export function Hero() {
  const [phase, setPhase] = useState<Phase>("hero")
  // Scroll position through the project list, in projects: 0 has the first one open, 1.5 has the second one
  // halfway over the third, and so on.
  const [projectProgress, setProjectProgress] = useState(0)
  // How far the slogan's cube has solved itself, 0 to 1.
  const [solveProgress, setSolveProgress] = useState(0)
  // Scroll position through the work flow, in steps, like projectProgress.
  const [flowProgress, setFlowProgress] = useState(0)
  const [heroMotion, setHeroMotion] = useState<HeroMotion>("none")
  const [projectsMotion, setProjectsMotion] = useState<ProjectsMotion>("hidden")
  const [sloganMotion, setSloganMotion] = useState<SloganMotion>("hidden")
  const [flowMotion, setFlowMotion] = useState<FlowMotion>("hidden")
  const [linksMotion, setLinksMotion] = useState<LinksMotion>("hidden")
  // Bumped each time a panel is entered from above so its entrance animation (or the cube's solve) replays.
  const [projectsKey, setProjectsKey] = useState(0)
  const [flowKey, setFlowKey] = useState(0)
  const [linksKey, setLinksKey] = useState(0)
  const currentPhase = useRef<Phase>("hero")
  // Until this time the scroll is held at holdAt, the first project or step (see LANDING_HOLD_MS).
  const holdUntil = useRef(0)
  const holdLimit = useRef(0)
  const holdAt = useRef(0)
  // The scroll position at the last sync, to tell when a stop is crossed.
  const lastScrolled = useRef(0)
  // False until the first sync, which only picks up a restored scroll position.
  const started = useRef(false)
  const pet = usePetEnergy({ onHomePage: true })
  const stage = useRef<HTMLDivElement>(null)
  const petSpot = useRef<HTMLDivElement>(null)
  const petRef = useRef<HTMLDivElement>(null)
  const petAt = useRef<{ x: number; y: number } | null>(null)

  const sync = useCallback(() => {
    if (performance.now() < holdUntil.current) {
      window.scrollTo({ top: holdAt.current * window.innerHeight, behavior: "instant" })
      return
    }
    // The hero opens the page, so the page scroll is how far into the track we are.
    let scrolled = window.scrollY / window.innerHeight
    const hold = (at: number, ms: number, maxMs: number) => {
      scrolled = at
      holdAt.current = at
      window.scrollTo({ top: at * window.innerHeight, behavior: "instant" })
      holdUntil.current = performance.now() + ms
      holdLimit.current = performance.now() + maxMs
    }
    const last = lastScrolled.current
    // A long jump may cross both stops; it stops at the first one it reaches.
    const stop = STOPS.filter((at) => (last < at && scrolled >= at) || (last > at && scrolled <= at)).sort(
      (a, b) => Math.abs(a - last) - Math.abs(b - last),
    )[0]
    if (started.current && stop !== undefined) hold(stop, STOP_HOLD_MS, STOP_HOLD_MAX_MS)
    const next: Phase =
      scrolled > LINKS_AT
        ? "links"
        : scrolled > FLOW_AT
          ? "flow"
          : scrolled > SLOGAN_AT
            ? "slogan"
            : scrolled > SWITCH_AT
              ? "projects"
              : "hero"
    // Scrolling down from the hero always lands on the first project, and from the slogan on the first work flow
    // step, and holds there while the panel fades in, so a fast swipe can't carry past them.
    const landing =
      currentPhase.current === "hero" && next === "projects"
        ? projectScroll(0)
        : currentPhase.current === "slogan" && next === "flow"
          ? flowScroll(0)
          : null
    if (started.current && landing !== null) hold(landing, LANDING_HOLD_MS, LANDING_HOLD_MAX_MS)
    lastScrolled.current = scrolled
    started.current = true
    setProjectProgress(clamp((scrolled - projectScroll(0)) / PROJECT_STEP, projects.length - 1))
    setSolveProgress(clamp((scrolled - SLOGAN_AT - SOLVE_LEAD) / (SLOGAN_STEP - 2 * SOLVE_LEAD), 1))
    setFlowProgress(clamp((scrolled - flowScroll(0)) / FLOW_STEP, workflowSteps.length - 1))

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

    if (next === "slogan") {
      setSloganMotion(forward ? "in-up" : "in-down")
    } else if (previous === "slogan") {
      setSloganMotion(forward ? "out-up" : "out-down")
    }

    if (next === "flow") {
      setFlowMotion(forward ? "enter" : "in-down")
      if (forward) setFlowKey((key) => key + 1)
    } else if (previous === "flow") {
      setFlowMotion(forward ? "out-sides" : "out-down")
    }

    if (next === "links") {
      setLinksMotion("in")
      setLinksKey((key) => key + 1)
    } else if (previous === "links") {
      setLinksMotion("out-down")
    }
  }, [])

  const selectProject = useCallback((index: number) => {
    window.scrollTo({ top: projectScroll(index) * window.innerHeight, behavior: "smooth" })
  }, [])

  const selectFlowStep = useCallback((index: number) => {
    window.scrollTo({ top: flowScroll(index) * window.innerHeight, behavior: "smooth" })
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

  // Move the pet to the current phase's spot. The move itself is a CSS transition; while it runs the
  // pet walks, facing the way it goes.
  useEffect(() => {
    const element = petRef.current
    if (!element) return
    const place = (animate: boolean) => {
      const container = stage.current
      const target = phase === "hero" ? petSpot.current : document.getElementById(PET_TITLE[phase])
      if (!container || !target) return
      const { x: left, y: top } = offsetWithin(target, container)
      let x = left
      let y = top
      let scale = target.offsetWidth / PET_WIDTH
      if (phase !== "hero" && target.id !== SLOGAN_PET_SPOT) {
        const height = target.offsetHeight
        scale = (height * PET_TITLE_HEIGHT) / PET_HEIGHT
        x = left + target.offsetWidth + height * PET_TITLE_GAP
        y = top + height * (1 - PET_TITLE_DROP) - PET_HEIGHT * scale
      }
      move(x, y, scale, animate)
    }
    const move = (x: number, y: number, scale: number, animate: boolean) => {
      const from = petAt.current
      petAt.current = { x, y }
      const moving = animate && from !== null && Math.hypot(x - from.x, y - from.y) > 4
      element.style.transitionDuration = moving ? "" : "0ms"
      element.style.transform = `translate(${x}px, ${y}px) scale(${scale})`
      if (moving) {
        element.dataset.walking = ""
        element.dataset.facing = x < from.x ? "left" : "right"
      }
    }
    // Wait a frame so a freshly remounted panel has laid out its title.
    const frame = requestAnimationFrame(() => place(true))
    const onResize = () => place(false)
    const onArrive = (event: TransitionEvent) => {
      if (event.target !== element || event.propertyName !== "transform") return
      delete element.dataset.walking
      element.dataset.facing = "right"
    }
    window.addEventListener("resize", onResize)
    element.addEventListener("transitionend", onArrive)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", onResize)
      element.removeEventListener("transitionend", onArrive)
    }
  }, [phase, projectsKey, flowKey])

  return (
    <div
      className="relative"
      style={{ height: `calc(100svh + ${TRACK * 100}svh)` }}
    >
      {/* Anchor for "Work" links: lands on the first project */}
      <div id="work" aria-hidden="true" className="absolute inset-x-0" style={{ top: `${projectScroll(0) * 100}svh` }} />
      <div ref={stage} className="grid-lines sticky top-0 h-svh overflow-hidden">
        <section
          aria-labelledby="hero-title"
          inert={phase !== "hero"}
          className={cn(
            // Isolated with its own background so the title's difference blend has the same backdrop
            // while the panel fades in and out.
            "grid-lines absolute inset-x-0 top-header bottom-0 isolate grid overflow-hidden grid-cols-12 bg-background px-gutter transition-colors duration-[280ms]",
            panelClass[heroMotion],
          )}
        >
          <div className="col-span-12 flex justify-between pt-[clamp(38px,7vh,72px)] text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
            <span>Independent designer</span>
            <span className="max-tab:hidden">Based in Amsterdam</span>
          </div>
          {heroIcons.map(({ name, Icon, className, style }) => (
            // The outer box plays the entrance, the inner one floats, so the two animations don't clash.
            <div
              key={name}
              aria-hidden="true"
              style={{ animationDelay: `${TITLE_MS}ms` }}
              className={cn("animate__animated animate__fadeInUp absolute z-[1] -translate-1/2", className)}
            >
              <div style={style} className="animate-float motion-reduce:animate-none">
                <Icon />
              </div>
            </div>
          ))}
          {/* White text in difference mode reads as the inverse of whatever sits behind it: dark on the page, inverted over the icons.
              In dark mode it is plain light yellow instead. */}
          <FadeInUp
            as="h1"
            id="hero-title"
            className="z-[2] col-span-10 mt-[clamp(52px,8vh,100px)] mb-11 max-w-[900px] self-center text-[clamp(58px,8.1vw,124px)] leading-[0.89] font-medium text-white mix-blend-difference dark:text-highlight dark:mix-blend-normal max-tab:col-span-12 max-tab:mt-[70px] max-tab:self-start max-tab:text-[clamp(58px,10.5vw,84px)] max-phone:text-[clamp(40px,13vw,68px)]"
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
              className="size-14 flex-none rotate-90 rounded-full border-border bg-background shadow-none duration-[220ms] hover:scale-106 hover:bg-highlight hover:text-ink dark:border-border dark:bg-background dark:hover:bg-highlight"
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
          </div>
          {/* Sits centred in the visible part of the circle (100px = half its width; no translate, since the pet is
              placed from layout offsets); on tablet and phone it moves above the intro row.
              The pet itself is drawn outside the panel (see below) so it can walk on; this keeps its spot. */}
          <div
            style={{ animationDelay: `${PET_DELAY_MS}ms` }}
            className="animate__animated animate__fadeInUp absolute right-[calc(clamp(18px,5vw,90px)+clamp(115px,14vw,210px)-100px)] bottom-[clamp(24px,calc(14vw-110px),100px)] z-[2] flex flex-col items-center gap-5 max-tab:right-gutter max-tab:bottom-[150px] max-phone:bottom-[165px] max-phone:flex-row"
          >
            <div
              ref={petSpot}
              style={{ aspectRatio: `${PET_WIDTH} / ${PET_HEIGHT}` }}
              className="w-[120px] max-phone:w-[80px]"
            />
            <PetStatus {...pet} />
          </div>
        </section>

        <section aria-labelledby="projects-title" inert={phase !== "projects"} className="absolute inset-0">
          {/* Remounting on each appearance from above replays the entrance sequence */}
          <Projects
            key={projectsKey}
            projects={projects}
            progress={projectProgress}
            motion={projectsMotion}
            onSelect={selectProject}
          />
        </section>

        <section aria-label="Solution Provider" inert={phase !== "slogan"} className="absolute inset-0">
          <Slogan motion={sloganMotion} active={phase === "slogan"} progress={solveProgress} />
        </section>

        <section
          aria-labelledby="workflow-title"
          inert={phase !== "flow"}
          className={cn("absolute inset-0", panelClass[flowMotion])}
        >
          <Workflow
            key={flowKey}
            steps={workflowSteps}
            progress={flowProgress}
            leaving={flowMotion === "out-sides"}
            onSelect={selectFlowStep}
          />
        </section>

        {/* The footer is part of this last screen, so the link text centres in the space between header and footer */}
        <section
          aria-label="More works"
          inert={phase !== "links"}
          className={cn("absolute inset-0 flex flex-col pt-header", linksClass[linksMotion])}
        >
          <div className="min-h-0 flex-1">
            {/* Remounting on each appearance replays the entrance */}
            <LinkSection key={linksKey} play={linksMotion !== "hidden"} />
          </div>
          <SiteFooter />
        </section>

        {/* Outside the hero it is always awake; it leaves with the work flow */}
        <div
          ref={petRef}
          aria-hidden="true"
          className="group pointer-events-none absolute top-0 left-0 z-[3] origin-top-left transition-transform duration-[1100ms] ease-in-out motion-reduce:transition-none"
        >
          <div style={{ animationDelay: `${PET_DELAY_MS}ms` }} className="animate__animated animate__fadeInUp">
            <div
              className={cn(
                (phase === "flow" || phase === "links") && flowMotion !== "enter" && panelClass[flowMotion],
                // Beside the work flow title, it leaves with the left half.
                flowMotion === "out-sides" && "animate__animated animate__fadeOutLeft",
              )}
            >
              <PetSprite mood={phase === "hero" ? pet.mood : "awake"} hopping={pet.hopping} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
