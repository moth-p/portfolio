import Link from "next/link"
import type { CSSProperties } from "react"

import { FadeInUp } from "@/components/fade-in-up"
import { ArrowIcon } from "@/components/icons"
import { LaptopMockup } from "@/components/laptop-mockup"
import { projects, type Project } from "@/data/projects"
import { cn } from "@/lib/utils"

const processCards = [
  {
    label: "01 — Clarity",
    text: "Remove the noise until the central idea has room to breathe.",
    card: "bg-footer text-footer-foreground",
    labelColor: "text-border",
    shape: "shape-rings -right-[70px] -bottom-[120px] size-[360px] rounded-full border border-muted-foreground",
  },
  {
    label: "02 — Character",
    text: "Build a distinct language from a small set of memorable moves.",
    card: "bg-highlight text-ink",
    labelColor: "text-ink-muted",
    shape: "-right-[45px] -bottom-[70px] h-[330px] w-[270px] -rotate-12 rounded-t-[140px] border-2 border-ink",
  },
  {
    label: "03 — System",
    text: "Make every piece useful on its own and stronger together.",
    card: "border border-border bg-secondary",
    labelColor: "text-muted-foreground",
    shape: "shape-frame -right-[30px] -bottom-[25px] size-[280px] rotate-[24deg] rounded-[45px] border border-muted-foreground",
  },
]

const label = "text-[10px] tracking-[0.1em] uppercase"

export function ProjectDetail({ project, next }: { project: Project; next: Project }) {
  return (
    <>
      <section className="grid min-h-[475px] grid-cols-12 items-end px-gutter pt-[90px] pb-[55px] max-phone:min-h-[420px]">
        <div className="col-span-2 flex flex-col gap-[7px] self-start pt-3 text-[10px] tracking-[0.08em] text-muted-foreground uppercase max-tab:col-span-12">
          <span>
            {project.number} / {String(projects.length).padStart(2, "0")}
          </span>
          <span>{project.category}</span>
        </div>
        <FadeInUp as="h1" className="col-start-3 col-end-12 font-serif text-[clamp(76px,10vw,150px)] leading-[0.78] font-normal tracking-[-0.055em] max-tab:col-span-12 max-tab:mt-[45px] max-phone:text-[68px] max-phone:leading-[0.88]">
          {project.title}
        </FadeInUp>
        <p className="col-start-8 col-end-13 mt-[50px] text-[clamp(17px,1.6vw,23px)] leading-[1.4] max-tab:col-start-4 max-phone:col-start-2 max-phone:mt-[45px]">
          {project.summary}
        </p>
      </section>

      <section
        className="mockup-panel mx-gutter rounded-[32px] p-[clamp(20px,3vw,48px)] max-phone:rounded-[22px]"
        style={{ "--panel": project.color } as CSSProperties}
      >
        <div className="relative h-[min(70vw,740px)] max-phone:h-[110vw]">
          <LaptopMockup src={project.image} video={project.video} alt={`${project.title} project`} sizes="100vw" preload />
        </div>
      </section>

      <section className="grid grid-cols-12 px-gutter py-[clamp(90px,12vw,170px)]">
        <div className="col-span-3 grid grid-cols-2 gap-5 max-tab:col-span-12 max-tab:mb-[70px]">
          <div className="border-t border-border pt-[13px]">
            <span className={cn(label, "text-muted-foreground")}>Year</span>
            <p className="mt-[9px] text-xs">{project.year}</p>
          </div>
          <div className="border-t border-border pt-[13px]">
            <span className={cn(label, "text-muted-foreground")}>Services</span>
            {project.services.map((service) => (
              <p key={service} className="mt-[9px] text-xs">
                {service}
              </p>
            ))}
          </div>
        </div>
        <div className="col-start-6 col-end-13 max-tab:col-start-2 max-phone:col-start-1">
          <span className={cn(label, "text-muted-foreground")}>The idea</span>
          <FadeInUp as="h2" className="mt-[27px] text-[clamp(34px,4.2vw,62px)] leading-[1.12] font-medium tracking-wide">
            {project.description}
          </FadeInUp>
        </div>
      </section>

      <section className="grid grid-cols-12 gap-[18px] px-gutter pb-[clamp(100px,13vw,180px)]">
        {processCards.map((card) => (
          <div
            key={card.label}
            className={cn(
              "relative col-span-4 min-h-[530px] overflow-hidden rounded-[28px] p-7 max-tab:col-span-12 max-tab:min-h-[430px] max-phone:min-h-[390px]",
              card.card,
            )}
          >
            <span className={cn(label, card.labelColor)}>{card.label}</span>
            <p className="relative z-[2] mt-5 max-w-[290px] font-serif text-[28px] leading-[1.08]">{card.text}</p>
            <div className={cn("absolute", card.shape)} />
          </div>
        ))}
      </section>

      <Link
        href={`/project/${next.id}`}
        className="group grid w-full grid-cols-12 items-center border-t border-border px-gutter py-[70px] text-left"
      >
        <span className="col-span-2 text-[11px] text-muted-foreground uppercase max-tab:col-span-3 max-phone:col-span-12 max-phone:mb-5">
          Next project
        </span>
        <strong className="col-start-3 col-end-11 font-serif text-[clamp(45px,6vw,85px)] font-normal max-tab:col-start-4 max-phone:col-start-1">
          {next.title}
        </strong>
        <span className="col-start-12 flex size-[54px] max-phone:col-start-11 max-phone:col-end-13 max-phone:justify-self-end items-center justify-center rounded-full border border-border bg-background transition duration-[220ms] group-hover:translate-x-[5px] group-hover:bg-foreground group-hover:text-background dark:group-hover:bg-highlight dark:group-hover:text-ink">
          <ArrowIcon />
        </span>
      </Link>
    </>
  )
}
