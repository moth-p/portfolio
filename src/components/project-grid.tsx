"use client"

import Link from "next/link"
import { useEffect, useRef, useState, type ReactNode } from "react"

import { LaptopMockup } from "@/components/laptop-mockup"
import { PixelNumber } from "@/components/pixel-icons"
import type { Project } from "@/data/projects"
import { cn } from "@/lib/utils"

// The Projects page grid. Cards fade up like the page title (FadeInUp): Animate.css timing, each row 120ms after the
// one above, played when a card scrolls into view and replayed the next time. They rise by about the title's line
// height rather than their own height.
export function ProjectGrid({ projects, title }: { projects: Project[]; title: ReactNode }) {
  const list = useRef<HTMLUListElement>(null)
  // Delay (ms) of each card currently in view; cards not in it are hidden, ready to play again.
  const [shown, setShown] = useState<Record<string, number>>({})

  useEffect(() => {
    const items = Array.from(list.current?.children ?? []) as HTMLElement[]
    const observer = new IntersectionObserver(
      (entries) => {
        // Cards entering together are staggered by row: the first row among them starts at once.
        const entering = entries
          .filter((entry) => entry.intersectionRatio >= 0.2)
          .map((entry) => entry.target as HTMLElement)
          .sort((first, second) => first.offsetTop - second.offsetTop)
        const rowTops = [...new Set(entering.map((item) => item.offsetTop))]
        setShown((current) => {
          const next = { ...current }
          for (const entry of entries) {
            const id = (entry.target as HTMLElement).dataset.id!
            if (!entry.isIntersecting) delete next[id]
          }
          for (const item of entering) {
            const id = item.dataset.id!
            if (!(id in next)) next[id] = rowTops.indexOf(item.offsetTop) * 120
          }
          return next
        })
      },
      { threshold: [0, 0.2] },
    )
    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {title}
      <ul
        ref={list}
        className="mt-[clamp(36px,7vh,80px)] grid grid-cols-4 gap-x-[18px] gap-y-[clamp(40px,5vw,64px)] max-tab:grid-cols-2 max-phone:grid-cols-1"
      >
        {projects.map((project, index) => (
          <li
            key={project.id}
            data-id={project.id}
            style={{ animationDelay: `${shown[project.id] ?? 0}ms` }}
            className={cn(
              project.id in shown
                ? "animate-in fill-mode-both fade-in slide-in-from-bottom-[clamp(40px,4.8vw,75px)] ease-[ease] animation-duration-[1000ms] motion-reduce:animate-none"
                : "opacity-0 motion-reduce:opacity-100",
            )}
          >
            <Link href={`/project/${project.id}`} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[26px] mockup-panel max-phone:rounded-[18px]">
                <LaptopMockup
                  src={project.image}
                  alt={`${project.title} project`}
                  sizes="(max-width: 520px) 100vw, (max-width: 800px) 50vw, 25vw"
                  laptopClassName="transition-[scale] duration-700 ease-soft group-hover:scale-[1.035]"
                />
                {/* The project's number in pixels, in the top left corner */}
                <span
                  aria-hidden="true"
                  className="absolute top-[clamp(14px,1.4vw,22px)] left-[clamp(16px,1.6vw,24px)] block h-[clamp(22px,2vw,30px)] max-phone:top-3 max-phone:left-3.5"
                >
                  <PixelNumber value={String(index + 1).padStart(2, "0")} />
                </span>
              </div>
              <span className="mt-4 block text-[clamp(18px,1.75vw,26px)] leading-tight">
                <span className="link-underline">{project.title}</span>
              </span>
              <p className="mt-2 text-sm leading-snug text-muted-foreground">{project.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
