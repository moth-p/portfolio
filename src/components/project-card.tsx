import Image from "next/image"
import Link from "next/link"

import { ArrowIcon } from "@/components/icons"
import type { Project } from "@/data/projects"

export function ProjectCard({ project }: { project: Project }) {
  const href = `/project/${project.id}`

  return (
    <article className="group w-[clamp(295px,39vw,570px)] flex-none [direction:ltr]">
      <Link
        href={href}
        aria-label={`View ${project.title} case study`}
        className="relative block aspect-[1.23] w-full overflow-hidden rounded-[26px] bg-border after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(0,0,0,0.16),transparent_35%,rgba(0,0,0,0.08))] after:content-['']"
      >
        <Image
          src={project.image}
          alt=""
          fill
          quality={85}
          sizes="(max-width: 756px) 295px, (min-width: 1462px) 570px, 39vw"
          className="object-cover saturate-[0.62] transition-[filter,scale] duration-[550ms,700ms] ease-[ease,var(--ease-soft)] group-hover:scale-[1.035] group-hover:saturate-[0.95]"
        />
        <span className="absolute top-[22px] left-[22px] z-[2] grid size-[34px] place-items-center rounded-full bg-highlight text-[10px] text-ink">
          {project.number}
        </span>
        <span className="absolute right-[18px] bottom-[18px] z-[2] flex translate-y-2 items-center gap-[15px] rounded-full bg-background py-3 pr-3.5 pl-[17px] text-[11px] opacity-0 transition duration-[250ms] ease-[ease] group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100">
          View project <ArrowIcon className="w-4" />
        </span>
      </Link>
      <Link href={href} className="block w-full px-[3px] pt-[21px] text-left">
        <span className="text-[10px] tracking-[0.08em] text-muted-foreground uppercase">
          {project.category} · {project.year}
        </span>
        <h3 className="mt-2 mb-1 font-serif text-[clamp(30px,3vw,42px)] leading-none font-normal">{project.title}</h3>
        <p className="text-[13px] text-muted-foreground">{project.summary}</p>
      </Link>
    </article>
  )
}
