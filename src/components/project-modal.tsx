"use client"

import { Dialog } from "radix-ui"
import { XIcon } from "lucide-react"

import { ArrowIcon } from "@/components/icons"
import { LaptopMockup } from "@/components/laptop-mockup"
import { TitlePet } from "@/components/pixel-pet"
import { getAdjacentProjects, getProject, projects, type Project } from "@/data/projects"
import { cn } from "@/lib/utils"

const label = "text-[10px] tracking-[0.1em] uppercase"
// The Traditional Chinese beside a label, a touch larger so the characters stay legible.
const labelTw = "ml-2 text-[11px] tracking-[0.15em]"
const pageButton =
  "flex min-w-0 max-w-[calc(50%-48px)] cursor-pointer items-center gap-2.5 rounded-full border border-ink bg-background py-2.5 font-sans text-[15px] font-semibold text-ink transition-colors duration-[250ms] hover:bg-highlight hover:text-ink dark:border-border dark:text-foreground dark:hover:border-ink dark:hover:text-ink max-phone:py-2 max-phone:text-[13px]"

const linkButton =
  "flex items-center gap-1.5 rounded-full border border-foreground py-1 pr-2 pl-3 text-xs font-semibold transition-colors duration-[250ms] hover:bg-highlight hover:text-ink"

// A project's case study in a popup, opened from the project cards. Previous / next page through `list` (every
// project unless given, e.g. only the filtered ones), wrapping around it, in the bar along the bottom. `projectId` is
// the open project, null when closed.
export function ProjectModal({
  projectId,
  onProjectChange,
  list = projects,
}: {
  projectId: string | null
  onProjectChange: (id: string | null) => void
  list?: Project[]
}) {
  const project = projectId ? getProject(projectId) : undefined

  return (
    <Dialog.Root open={!!project} onOpenChange={(open) => !open && onProjectChange(null)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/50 backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-x-gutter top-1/2 z-50 mx-auto flex h-[min(800px,calc(100svh-2*clamp(16px,4vh,48px)))] max-w-[1040px] -translate-y-1/2 flex-col overflow-hidden rounded-[26px] border border-border bg-background outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-[0.97] data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-[0.97] max-phone:inset-x-3 max-phone:h-[calc(100svh-24px)] max-phone:rounded-[18px]"
        >
          <div className="flex flex-none items-center justify-between gap-4 border-b border-border px-[clamp(16px,2.4vw,40px)] py-[clamp(12px,1.6vw,20px)] max-phone:px-6">
            <div className="flex min-w-0 items-end gap-[clamp(12px,1.4vw,20px)]">
              <Dialog.Title className="truncate text-[clamp(28px,3vw,44px)] leading-[1.05] font-medium max-phone:text-[clamp(24px,7vw,32px)]">
                <span key={project?.id} className="animate-in fade-in duration-300">{project?.title}</span>
              </Dialog.Title>
              <TitlePet height={30} className="flex-none max-phone:hidden" />
            </div>
            <Dialog.Close
              aria-label="Close"
              className="flex size-10 flex-none cursor-pointer items-center justify-center rounded-full border border-ink bg-background text-ink transition-colors duration-[250ms] hover:bg-highlight dark:border-border dark:text-foreground dark:hover:border-ink dark:hover:text-ink max-phone:size-9"
            >
              <XIcon className="size-4" />
            </Dialog.Close>
          </div>
          {project && <ProjectBody project={project} />}
          {project && <Pagination {...getAdjacentProjects(project.id, list)} list={list} onSelect={onProjectChange} current={project} />}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

// Two columns: the recording and its links (if any) on the left, the details on the right. The recording panel grows to
// make the left column as tall as the right. On tablet and phone they stack, and the body scrolls without showing a
// scrollbar.
function ProjectBody({ project }: { project: Project }) {
  const links = [
    { name: "GitHub", href: project.github },
    { name: "Website", href: project.website },
  ].filter((link): link is { name: string; href: string } => !!link.href)
  return (
    <div
      key={project.id}
      className="grid min-h-0 flex-1 animate-in fade-in duration-300 grid-cols-12 gap-[clamp(24px,3vw,56px)] overflow-y-auto p-[clamp(16px,2.4vw,40px)] [scrollbar-width:none] max-tab:auto-rows-max max-tab:grid-cols-1 max-tab:gap-6 max-phone:gap-5 max-phone:px-6 [&::-webkit-scrollbar]:hidden"
    >
      {/* On phone the column dissolves into the body's grid, so the recording (and its links) can stay pinned to the
          top (on the background, edge to edge) while everything below it scrolls */}
      <div className="col-span-7 flex flex-col max-tab:col-span-1 max-phone:contents">
        <div className="flex min-h-[200px] flex-1 flex-col gap-[clamp(12px,2vh,20px)] max-tab:min-h-0 max-tab:flex-none max-phone:sticky max-phone:-top-4 max-phone:z-10 max-phone:-mx-6 max-phone:-mt-4 max-phone:gap-2.5 max-phone:bg-background max-phone:px-6 max-phone:pt-4 max-phone:pb-6">
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-[20px] mockup-panel max-tab:aspect-[16/11] max-tab:flex-none max-phone:rounded-[14px]">
            <LaptopMockup src={project.image} video={project.video} alt={`${project.title} project`} sizes="(max-width: 800px) 100vw, 60vw" preload />
          </div>
          {/* Only the links a project has; most have none, and then the row is left out */}
          {links.length > 0 && (
            <div className="flex gap-2">
              {links.map((link) => (
                <a key={link.name} href={link.href} target="_blank" rel="noreferrer" className={linkButton}>
                  {link.name}
                  <ArrowIcon className="w-3 -rotate-45" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="col-span-5 flex flex-col gap-[clamp(18px,3.4vh,36px)] max-tab:col-span-1">
        <p lang="zh-Hant" className="text-[clamp(15px,1.15vw,18px)] leading-[1.7] tracking-[0.1em]">
          {project.descriptionTw}
        </p>

        <div>
          <span className={cn(label, "text-muted-foreground")}>
            Tech stack<span lang="zh-Hant" className={labelTw}>技術棧</span>
          </span>
          <ul className="mt-2.5 flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <li key={tech} className="rounded-full border border-border px-3 py-1 text-xs">
                {tech}
              </li>
            ))}
          </ul>
        </div>


        <div>
          <span className={cn(label, "text-muted-foreground")}>
            My role<span lang="zh-Hant" className={labelTw}>負責項目</span>
          </span>
          <ul lang="zh-Hant" className="mt-2.5 flex flex-col gap-1.5 text-sm leading-snug max-phone:text-[13px] tracking-[0.08em]">
            {project.dutiesTw.map((duty) => (
              <li key={duty} className="flex gap-2.5">
                <span aria-hidden="true" className="mt-[0.55em] size-1.5 flex-none rounded-full bg-highlight" />
                {duty}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function Pagination({
  current,
  previous,
  next,
  list,
  onSelect,
}: {
  current: Project
  previous: Project
  next: Project
  list: Project[]
  onSelect: (id: string) => void
}) {
  // By id: a list handed down from a server component holds copies, not the same objects as `current`.
  const position = String(list.findIndex((project) => project.id === current.id) + 1).padStart(2, "0")
  const total = String(list.length).padStart(2, "0")
  return (
    <nav
      aria-label="More projects"
      className="flex flex-none items-center justify-between gap-4 border-t border-border px-[clamp(16px,2.4vw,40px)] py-[clamp(12px,1.6vw,20px)] max-phone:px-6"
    >
      <button type="button" onClick={() => onSelect(previous.id)} className={cn(pageButton, "pr-4 pl-3")}>
        <ArrowIcon direction="left" className="w-4 flex-none" />
        <span className="truncate">
          <span className="sr-only">Previous project: </span>
          {previous.title}
        </span>
      </button>
      <span className="flex-none text-[13px] tracking-[0.1em] whitespace-nowrap text-muted-foreground tabular-nums">
        {position} / {total}
      </span>
      <button type="button" onClick={() => onSelect(next.id)} className={cn(pageButton, "pr-3 pl-4")}>
        <span className="truncate">
          <span className="sr-only">Next project: </span>
          {next.title}
        </span>
        <ArrowIcon className="w-4 flex-none" />
      </button>
    </nav>
  )
}
