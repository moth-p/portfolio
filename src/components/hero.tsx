"use client"

import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"

import { FadeInUp } from "@/components/fade-in-up"
import { ArrowIcon } from "@/components/icons"
import { PET_HEIGHT, PET_WIDTH, PetSprite, PetStatus, usePetEnergy } from "@/components/pixel-pet"
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

// Entrance order: the title's lines fade in first, then each photo, then the pet — all with fadeInUp.
const TITLE_MS = 1100
const PHOTO_STAGGER_MS = 450
const PET_DELAY_MS = TITLE_MS + 2 * PHOTO_STAGGER_MS

// The pet walks from its hero spot to the right of each section title, and stays with the work flow.
const PET_TITLE = { projects: "projects-title", flow: "workflow-title", after: "workflow-title" } as const
// Next to a title the pet stands on the baseline and is about as tall as the capitals.
const PET_TITLE_HEIGHT = 0.78
const PET_TITLE_GAP = 0.3
const PET_TITLE_DROP = 0.07

// Position of an element inside an ancestor from layout offsets, so running entrance transforms don't skew it.
function offsetWithin(element: HTMLElement, ancestor: HTMLElement) {
  let x = 0
  let y = 0
  let node: HTMLElement | null = element
  while (node && node !== ancestor) {
    x += node.offsetLeft
    y += node.offsetTop
    node = node.offsetParent as HTMLElement | null
  }
  return { x, y }
}

// Square photos floating around the title, positioned by their centres (the `translate` property
// leaves `transform` free for the float animation): one sitting on top of the first line, a little right of its
// middle, and one further right and lower, beside the second line.
const heroPhotos = [
  {
    image: projects[0].image,
    className: "top-[19%] left-[26%] w-[clamp(75px,9vw,135px)] max-tab:left-[60%]",
    style: undefined,
  },
  {
    image: projects[2].image,
    className: "top-[47%] left-[53%] w-[clamp(55px,6vw,95px)] max-tab:left-[78%] max-phone:top-[41%] max-phone:left-[86%]",
    style: { animationDelay: "-3s", animationDuration: "7s" },
  },
]

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
  const pet = usePetEnergy()
  const stage = useRef<HTMLDivElement>(null)
  const petSpot = useRef<HTMLDivElement>(null)
  const petRef = useRef<HTMLDivElement>(null)
  const petAt = useRef<{ x: number; y: number } | null>(null)

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
      if (phase !== "hero") {
        const height = target.offsetHeight
        scale = (height * PET_TITLE_HEIGHT) / PET_HEIGHT
        x = left + target.offsetWidth + height * PET_TITLE_GAP
        y = top + height * (1 - PET_TITLE_DROP) - PET_HEIGHT * scale
      }
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
      className="relative border-b border-border"
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
            "grid-lines absolute inset-x-0 top-0 isolate grid h-[calc(100svh-88px)] overflow-hidden grid-cols-12 bg-background px-gutter transition-colors duration-[280ms] max-phone:h-[calc(100svh-72px)]",
            panelClass[heroMotion],
          )}
        >
          <div className="col-span-12 flex justify-between pt-[clamp(38px,7vh,72px)] text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
            <span>Independent designer</span>
            <span className="max-tab:hidden">Based in Amsterdam</span>
          </div>
          {heroPhotos.map((photo, index) => (
            // The outer box plays the entrance, the inner one floats, so the two animations don't clash.
            <div
              key={photo.image}
              aria-hidden="true"
              style={{ animationDelay: `${TITLE_MS + index * PHOTO_STAGGER_MS}ms` }}
              className={cn(
                "animate__animated animate__fadeInUp absolute z-[1] aspect-square -translate-1/2",
                photo.className,
              )}
            >
              <div
                style={photo.style}
                className="relative size-full animate-float overflow-hidden bg-border motion-reduce:animate-none"
              >
                <Image src={photo.image} alt="" fill priority quality={85} sizes="135px" className="object-cover" />
              </div>
            </div>
          ))}
          {/* White text in difference mode reads as the inverse of whatever sits behind it: dark on the page, inverted over the photos */}
          <FadeInUp
            as="h1"
            id="hero-title"
            className="z-[2] col-span-10 mt-[clamp(52px,8vh,100px)] mb-11 max-w-[900px] self-center text-[clamp(58px,8.1vw,124px)] leading-[0.89] font-medium text-white mix-blend-difference max-tab:col-span-12 max-tab:mt-[70px] max-tab:self-start max-tab:text-[clamp(58px,10.5vw,84px)] max-phone:text-[clamp(40px,13vw,68px)]"
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

        {/* Outside the hero it is always awake; it leaves with the work flow */}
        <div
          ref={petRef}
          aria-hidden="true"
          className="group pointer-events-none absolute top-0 left-0 z-[3] origin-top-left transition-transform duration-[1100ms] ease-in-out motion-reduce:transition-none"
        >
          <div style={{ animationDelay: `${PET_DELAY_MS}ms` }} className="animate__animated animate__fadeInUp">
            <div className={cn((phase === "flow" || phase === "after") && flowMotion !== "enter" && panelClass[flowMotion])}>
              <PetSprite mood={phase === "hero" ? pet.mood : "awake"} hopping={pet.hopping} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
