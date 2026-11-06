"use client"

import { Accordion } from "radix-ui"
import Image from "next/image"
import Link from "next/link"

import { ArrowIcon } from "@/components/icons"
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
  activeIndex,
  motion,
  onSelect,
}: {
  projects: Project[]
  activeIndex: number
  motion: ProjectsMotion
  onSelect: (index: number) => void
}) {
  return (
    <div className="flex h-svh flex-col px-gutter pt-[clamp(36px,9vh,110px)] pb-[clamp(24px,5vh,56px)] max-tab:pt-[clamp(28px,6vh,60px)]">
      <div className={cn("mb-[clamp(20px,4vh,44px)]", motionClass[motion])}>
        <span className="mb-[14px] block text-[11px] tracking-[0.12em] text-muted-foreground uppercase">Selected work</span>
        <h2
          id="projects-title"
          className="text-[clamp(44px,5.4vw,84px)] leading-[0.89] font-medium max-phone:text-[clamp(40px,12vw,56px)]"
        >
          Projects
        </h2>
      </div>

      {/*
        Scrolling unfolds one project at a time and folds the previous one.
        Desktop: side-by-side slides split by vertical lines, read left to right.
        Tablet/phone: stacked slides split by horizontal lines, read top to bottom.
      */}
      <Accordion.Root
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
          const href = `/project/${project.id}`
          return (
            <Accordion.Item
              key={project.id}
              value={project.id}
              style={motion === "in-up" ? slideDelay(index) : undefined}
              className={cn(
                "flex min-h-0 min-w-0 grow-0 overflow-hidden border-l border-border transition-[flex-grow] duration-500 ease-soft first:border-l-0 data-[state=open]:grow max-tab:flex-col max-tab:border-t max-tab:border-l-0 max-tab:first:border-t-0",
                motion === "in-up" && motionClass[motion],
              )}
            >
              <Accordion.Header className="flex">
                <Accordion.Trigger className="group flex w-[clamp(56px,5vw,80px)] cursor-pointer items-center justify-between gap-4 py-[clamp(16px,2.6vh,28px)] text-left text-[clamp(18px,1.75vw,26px)] whitespace-nowrap transition-colors [writing-mode:vertical-rl] rotate-180 data-[state=closed]:text-muted-foreground data-[state=closed]:hover:text-foreground max-tab:w-full max-tab:rotate-0 max-tab:py-[clamp(10px,1.9vh,16px)] max-tab:[writing-mode:horizontal-tb]">
                  <span>{project.title}</span>
                  <span className="text-[10px] tracking-[0.08em] uppercase">{project.category}</span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="flex min-h-0 min-w-0 flex-1 gap-[clamp(20px,2.6vw,44px)] py-[clamp(16px,2.6vh,28px)] pr-[clamp(16px,2.6vw,44px)] data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:duration-500 max-tab:flex-col max-tab:gap-4 max-tab:pt-0 max-tab:pr-0">
                <Link
                  href={href}
                  aria-label={`View ${project.title} case study`}
                  className="group/image relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-[26px] bg-border max-phone:rounded-[18px]"
                >
                  <Image
                    src={project.image}
                    alt=""
                    fill
                    quality={85}
                    sizes="(max-width: 800px) 100vw, 60vw"
                    className="object-cover saturate-[0.62] transition-[filter,scale] duration-[550ms,700ms] ease-[ease,var(--ease-soft)] group-hover/image:scale-[1.035] group-hover/image:saturate-[0.95]"
                  />
                </Link>
                <div className="flex w-[clamp(220px,20vw,300px)] flex-none flex-col justify-end max-tab:w-full">
                  <span className="text-[10px] tracking-[0.08em] text-muted-foreground uppercase">
                    {project.category} · {project.year}
                  </span>
                  <p className="mt-3 text-[clamp(16px,1.4vw,21px)] leading-snug max-tab:mt-1.5 max-tab:text-[15px]">
                    {project.summary}
                  </p>
                  <Link
                    href={href}
                    className="mt-[clamp(14px,2.4vh,26px)] flex w-fit items-center gap-[15px] rounded-full border border-foreground py-3 pr-3.5 pl-[17px] text-[11px] transition-colors duration-[250ms] hover:bg-foreground hover:text-background max-tab:mt-3"
                  >
                    View project <ArrowIcon className="w-4" />
                  </Link>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          )
        })}
      </Accordion.Root>
    </div>
  )
}
