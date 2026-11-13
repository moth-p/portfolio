import Link from "next/link"

import { FadeInUp } from "@/components/fade-in-up"
import { ArrowIcon } from "@/components/icons"
import { LaptopMockup } from "@/components/laptop-mockup"
import { TitlePet } from "@/components/pixel-pet"
import { projects, type Project } from "@/data/projects"
import { cn } from "@/lib/utils"

const label = "text-[10px] tracking-[0.1em] uppercase"
// Pill buttons laid over the cover panel. Back to the list is the same outlined pill, filled light yellow
// and turning black on hover, in both themes.
const panelButton =
  "absolute z-[1] flex max-w-[calc(50%-16px)] items-center rounded-full font-sans text-[15px] font-semibold transition-colors duration-[250ms]"
const backButton =
  "gap-2.5 border border-ink bg-highlight py-2.5 pr-4 pl-3 text-ink hover:bg-ink hover:text-highlight max-phone:py-2 max-phone:text-[13px]"
const pageButton =
  "gap-2.5 border border-ink bg-background/80 py-2.5 text-ink backdrop-blur-sm hover:border-ink hover:bg-highlight hover:text-ink dark:border-border dark:text-foreground dark:hover:border-ink dark:hover:text-ink max-phone:py-2 max-phone:text-[13px]"
const panelInset = "clamp(12px,1.6vw,20px)"

export function ProjectDetail({ project, previous, next }: { project: Project; previous: Project; next: Project }) {
  return (
    <>
      {/* Everything about the project fits in the first screen: recording on the left, details on the right */}
      <section className="grid min-h-[calc(100svh-var(--spacing-header))] grid-cols-12 gap-[clamp(24px,3vw,56px)] px-gutter py-[clamp(20px,4vh,48px)] max-tab:min-h-0 max-tab:grid-cols-1">
        <div className="relative col-span-6 min-h-[320px] overflow-hidden rounded-[26px] mockup-panel max-tab:col-span-1 max-tab:aspect-[16/11] max-tab:min-h-0 max-phone:aspect-[4/3.6] max-phone:rounded-[18px]">
          <LaptopMockup src={project.image} video={project.video} alt={`${project.title} project`} sizes="(max-width: 800px) 100vw, 60vw" preload className="max-tab:py-[68px] max-phone:py-[58px]" />
          <Link
            href="/projects"
            style={{ top: panelInset, left: panelInset }}
            className={cn(panelButton, backButton)}
          >
            <ArrowIcon direction="left" className="w-4" />
            All projects
          </Link>
          <nav aria-label="More projects">
            <Link
              href={`/project/${previous.id}`}
              rel="prev"
              style={{ bottom: panelInset, left: panelInset }}
              className={cn(panelButton, pageButton, "pr-4 pl-3")}
            >
              <ArrowIcon direction="left" className="w-4" />
              <span className="truncate">
                <span className="sr-only">Previous project: </span>
                {previous.title}
              </span>
            </Link>
            <Link
              href={`/project/${next.id}`}
              rel="next"
              style={{ bottom: panelInset, right: panelInset }}
              className={cn(panelButton, pageButton, "pr-3 pl-4")}
            >
              <span className="truncate">
                <span className="sr-only">Next project: </span>
                {next.title}
              </span>
              <ArrowIcon className="w-4" />
            </Link>
          </nav>
        </div>

        <div className="col-span-6 flex flex-col justify-center gap-[clamp(18px,3.4vh,36px)] max-tab:col-span-1">
          <div>
            <span className={cn(label, "text-muted-foreground")}>
              {project.number} / {String(projects.length).padStart(2, "0")} · {project.category} · {project.year}
            </span>
            <div className="mt-3 flex items-end gap-[clamp(14px,1.6vw,24px)]">
              <FadeInUp
                as="h1"
                className="text-[clamp(40px,4.6vw,72px)] leading-[0.95] font-medium max-phone:text-[clamp(36px,11vw,52px)]"
              >
                {project.title}
              </FadeInUp>
              <TitlePet height={56} className="max-phone:hidden" />
            </div>
          </div>

          <p className="text-[clamp(15px,1.15vw,18px)] leading-[1.5]">{project.description}</p>

          <div>
            <span className={cn(label, "text-muted-foreground")}>Tech stack</span>
            <ul className="mt-2.5 flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <li key={tech} className="rounded-full border border-border px-3 py-1 text-xs">
                  {tech}
                </li>
              ))}
            </ul>
          </div>

          <dl className="grid grid-cols-2 gap-5">
            {[
              { name: "GitHub", href: project.github },
              { name: "Website", href: project.website },
            ].map((link) => (
              <div key={link.name} className="min-w-0 border-t border-border pt-[13px]">
                <dt className={cn(label, "text-muted-foreground")}>{link.name}</dt>
                <dd className="mt-2 text-sm">
                  {link.href ? (
                    <a href={link.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
                      <span className="link-underline break-all">{link.href.replace(/^https?:\/\//, "")}</span>
                      <ArrowIcon className="w-3.5 -rotate-45" />
                    </a>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <div>
            <span className={cn(label, "text-muted-foreground")}>My role</span>
            <ul className="mt-2.5 flex flex-col gap-1.5 text-sm leading-snug">
              {project.duties.map((duty) => (
                <li key={duty} className="flex gap-2.5">
                  <span aria-hidden="true" className="mt-[0.55em] size-1.5 flex-none rounded-full bg-highlight" />
                  {duty}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
