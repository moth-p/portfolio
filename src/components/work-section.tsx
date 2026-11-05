"use client"

import { useRef, type WheelEvent } from "react"

import { ArrowIcon } from "@/components/icons"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import type { Project } from "@/data/projects"

const scrollButton =
  "size-11 rounded-full border-border bg-background shadow-none duration-[220ms] hover:scale-106 hover:bg-foreground hover:text-background max-phone:size-10 dark:border-border dark:bg-background dark:hover:bg-foreground"

export function WorkSection({ projects }: { projects: Project[] }) {
  const scroller = useRef<HTMLDivElement>(null)

  const moveProjects = (direction: number) => {
    scroller.current?.scrollBy({ left: direction * 440, behavior: "smooth" })
  }

  // Turn vertical wheel movement into horizontal scrolling over the project row.
  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    const element = scroller.current
    if (!element || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return
    element.scrollLeft += event.deltaY
  }

  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="border-b border-border bg-section py-[clamp(85px,11vw,155px)] max-phone:pt-[75px]"
    >
      <div className="mb-[42px] grid grid-cols-12 items-end px-gutter">
        <div className="col-span-6 max-tab:col-span-8">
          <span className="mb-[18px] block text-[11px] tracking-[0.12em] text-muted-foreground">01</span>
          <h2 id="work-title" className="font-serif text-[clamp(46px,5.5vw,78px)] leading-[0.95] font-normal max-phone:text-[44px]">
            Selected work
          </h2>
        </div>
        <p className="col-start-8 col-end-11 mb-3 text-xs text-muted-foreground max-tab:hidden">Drag or scroll to explore</p>
        <div className="col-start-11 col-end-13 flex justify-end gap-2 max-tab:col-start-9">
          <Button variant="outline" size="icon" className={scrollButton} aria-label="Scroll projects left" onClick={() => moveProjects(-1)}>
            <ArrowIcon direction="left" />
          </Button>
          <Button variant="outline" size="icon" className={scrollButton} aria-label="Scroll projects right" onClick={() => moveProjects(1)}>
            <ArrowIcon />
          </Button>
        </div>
      </div>

      <div
        ref={scroller}
        onWheel={handleWheel}
        className="cursor-ew-resize overflow-x-auto overscroll-x-contain px-gutter pb-[25px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex w-max flex-row-reverse justify-end gap-[18px] max-tab:flex-row">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
