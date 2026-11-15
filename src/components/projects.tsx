"use client"

import { Accordion } from "radix-ui"
import Link from "next/link"
import { useLayoutEffect, useRef, useState } from "react"

import { ArrowIcon } from "@/components/icons"
import { LaptopMockup } from "@/components/laptop-mockup"
import { ProjectModal } from "@/components/project-modal"
import type { Project } from "@/data/projects"
import { cn } from "@/lib/utils"

export type ProjectsMotion = "hidden" | "in-up" | "in-down" | "out-up" | "out-down"

const motionClass: Record<ProjectsMotion, string> = {
  hidden: "opacity-0",
  "in-up": "animate__animated animate__fadeInUp [--animate-duration:800ms]",
  "in-down": "animate__animated animate__fadeInDown",
  "out-up": "animate__animated animate__fadeOutUp",
  "out-down": "animate__animated animate__fadeOutDown",
}

// The title moves first and the accordion follows, both on the way in and on the way out.
// Entering from the hero, the slides then rise in one by one (left to right on desktop, top to bottom on phone).
const contentDelay = { animationDelay: "120ms" }
const slideDelay = (index: number) => ({ animationDelay: `${250 + index * 120}ms` })

export function Projects({
  projects,
  progress,
  motion,
  onSelect,
}: {
  projects: Project[]
  progress: number
  motion: ProjectsMotion
  onSelect: (index: number) => void
}) {
  const root = useRef<HTMLDivElement>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  // The slide that is mostly open counts as the open one (for its state, focus and the trigger colours).
  const activeIndex = Math.round(progress)

  // Every slide's content is laid out at the open size, so a slide doesn't reflow while it folds or unfolds: the
  // next slide's strip sweeps over the former one and covers it. The open size is what's left of the accordion
  // after every strip (and the dividers between slides).
  useLayoutEffect(() => {
    const element = root.current
    if (!element) return
    const measure = () => {
      const vertical = getComputedStyle(element).flexDirection === "column"
      const items = Array.from(element.children) as HTMLElement[]
      let open = vertical ? element.clientHeight : element.clientWidth
      for (const item of items) {
        const header = item.firstElementChild as HTMLElement
        open -= vertical
          ? item.offsetHeight - item.clientHeight + header.offsetHeight
          : item.offsetWidth - item.clientWidth + header.offsetWidth
      }
      element.style.setProperty("--open-size", `${Math.max(0, open)}px`)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="flex h-svh flex-col px-gutter pt-[calc(var(--spacing-header)+clamp(28px,7vh,90px))] pb-[clamp(24px,5vh,56px)] max-tab:pt-[calc(var(--spacing-header)+clamp(20px,4vh,44px))]">
      {/* The pet walks to just right of the title and button row (projects-pet-spot), so it never covers the button */}
      <div className={cn("mb-[clamp(20px,4vh,44px)]", motionClass[motion])}>
        <div id="projects-pet-spot" className="flex w-fit items-center gap-[clamp(14px,1.6vw,24px)]">
          <h2
            id="projects-title"
            className="text-[clamp(44px,5.4vw,84px)] leading-[0.89] font-medium max-phone:text-[clamp(40px,12vw,56px)]"
          >
            Developing
          </h2>
          <Link
            href="/projects"
            aria-label="View all projects"
            className="flex flex-none items-center gap-[15px] rounded-full border border-foreground py-3 pr-3.5 pl-[17px] text-[15px] font-semibold transition-colors duration-[250ms] hover:bg-highlight hover:text-ink max-phone:size-9 max-phone:justify-center max-phone:p-0"
          >
            <span className="max-phone:hidden">
              More
              <span lang="zh-Hant" className="ml-2 text-[0.8em] font-normal tracking-[0.15em]">
                看更多
              </span>
            </span> <ArrowIcon className="w-4" />
          </Link>
        </div>
        <p lang="zh-Hant" className="mt-[clamp(14px,1.6vw,22px)] text-[clamp(16px,1.4vw,20px)] leading-normal tracking-[0.15em] text-muted-foreground">
          開發 IOT 設備監控介面與品牌形象網站。
        </p>
      </div>

      {/*
        Scrolling slides each project over the previous one, in step with the scroll.
        Desktop: side-by-side slides split by vertical lines, read left to right.
        Tablet/phone: stacked slides split by horizontal lines, read top to bottom.
      */}
      <Accordion.Root
        ref={root}
        type="single"
        value={projects[activeIndex]?.id ?? ""}
        onValueChange={(value) => {
          const index = projects.findIndex((project) => project.id === value)
          if (index >= 0) onSelect(index)
        }}
        style={motion === "in-up" ? undefined : contentDelay}
        className={cn(
          "flex min-h-0 flex-1 border-x border-border max-tab:flex-col max-tab:border-x-0 max-tab:border-y",
          motion !== "in-up" && motionClass[motion],
        )}
      >
        {projects.map((project, index) => {
          const open = index === activeIndex
          // How far this slide is unfolded, tied directly to the scroll: between two slides, the next one has
          // covered the former by the fraction scrolled, and stops wherever the scroll stops.
          const openness = Math.max(0, 1 - Math.abs(progress - index))
          return (
            <Accordion.Item
              key={project.id}
              value={project.id}
              style={{ flexGrow: openness, ...(motion === "in-up" ? slideDelay(index) : undefined) }}
              className={cn(
                "flex min-h-0 min-w-0 overflow-hidden border-l border-border first:border-l-0 max-tab:flex-col max-tab:border-t max-tab:border-l-0 max-tab:first:border-t-0",
                motion === "in-up" && motionClass[motion],
              )}
            >
              <Accordion.Header className="flex">
                <Accordion.Trigger className="group flex w-[clamp(56px,5vw,80px)] cursor-pointer items-center justify-between gap-4 py-[clamp(16px,2.6vh,28px)] text-left text-[clamp(18px,1.75vw,26px)] whitespace-nowrap transition-colors [writing-mode:vertical-rl] rotate-180 data-[state=closed]:text-muted-foreground data-[state=closed]:hover:text-foreground max-tab:w-full max-tab:rotate-0 max-tab:py-[clamp(10px,1.9vh,16px)] max-tab:[writing-mode:horizontal-tb]">
                  <span>{project.title}</span>
                  <span className="text-[10px] tracking-[0.08em] uppercase">{project.category}</span>
                </Accordion.Trigger>
              </Accordion.Header>
              {/* Kept mounted so a folding slide stays in place while it's covered; the inner box holds the open size */}
              <Accordion.Content forceMount inert={!open} className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
                <div className="absolute inset-y-0 left-0 flex w-(--open-size) gap-[clamp(20px,2.6vw,44px)] py-[clamp(16px,2.6vh,28px)] pr-[clamp(16px,2.6vw,44px)] max-tab:inset-x-0 max-tab:top-0 max-tab:bottom-auto max-tab:h-(--open-size) max-tab:w-auto max-tab:flex-col max-tab:gap-4 max-tab:pt-0 max-tab:pr-0">
                  <button
                    type="button"
                    onClick={() => setOpenId(project.id)}
                    aria-label={`View ${project.title} case study`}
                    className="group/image relative min-h-0 cursor-pointer min-w-0 flex-1 overflow-hidden rounded-[26px] mockup-panel max-phone:rounded-[18px]"
                  >
                    <LaptopMockup
                      src={project.image}
                      video={project.video}
                      alt=""
                      sizes="(max-width: 800px) 100vw, 60vw"
                      laptopClassName="transition-[scale] duration-700 ease-soft group-hover/image:scale-[1.035]"
                    />
                  </button>
                  <div className="flex w-[clamp(220px,20vw,300px)] flex-none flex-col justify-end max-tab:w-full">
                    <p className="text-[clamp(16px,1.4vw,21px)] leading-snug max-tab:text-[15px]">{project.summary}</p>
                    <p lang="zh-Hant" className="mt-2 text-[clamp(13px,1.1vw,17px)] leading-normal tracking-[0.15em] text-muted-foreground">
                      {project.summaryTw}
                    </p>
                    <button
                      type="button"
                      onClick={() => setOpenId(project.id)}
                      className="mt-[clamp(14px,2.4vh,26px)] flex w-fit cursor-pointer items-center gap-[15px] rounded-full border border-foreground py-3 pr-3.5 pl-[17px] text-[15px] font-semibold transition-colors duration-[250ms] hover:bg-highlight hover:text-ink max-tab:mt-3"
                    >
                      <span>
                        View
                        <span lang="zh-Hant" className="ml-2 text-[0.8em] font-normal tracking-[0.15em]">
                          查看
                        </span>
                      </span>
                      <ArrowIcon className="w-4" />
                    </button>
                  </div>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          )
        })}
      </Accordion.Root>
      <ProjectModal projectId={openId} onProjectChange={setOpenId} />
    </div>
  )
}
