import type { Metadata } from "next"
import Link from "next/link"
import type { CSSProperties } from "react"

import { FadeInUp } from "@/components/fade-in-up"
import { LaptopMockup } from "@/components/laptop-mockup"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { projects } from "@/data/projects"

export const metadata: Metadata = {
  title: "Works",
  description: "Every project, from brand systems to digital products.",
}

export default function WorksPage() {
  return (
    <main className="pt-header">
      <SiteHeader active="works" />
      <section className="grid grid-cols-12 items-end px-gutter pt-[90px] pb-[clamp(55px,7vw,100px)]">
        <span className="col-span-2 self-start pt-3 text-[10px] tracking-[0.08em] text-muted-foreground uppercase max-tab:col-span-12">
          {String(projects.length).padStart(2, "0")} projects
        </span>
        <FadeInUp as="h1" className="col-start-3 col-end-12 font-serif text-[clamp(76px,10vw,150px)] leading-[0.78] font-normal tracking-[-0.055em] max-tab:col-span-12 max-tab:mt-[45px] max-phone:text-[68px] max-phone:leading-[0.88]">
          More works
        </FadeInUp>
      </section>

      <ul className="grid grid-cols-12 gap-x-[18px] gap-y-[clamp(50px,6vw,80px)] px-gutter pb-[clamp(100px,13vw,180px)]">
        {projects.map((project) => (
          <li key={project.id} className="col-span-6 max-phone:col-span-12">
            <Link href={`/project/${project.id}`} className="group block">
              <div
                className="mockup-panel rounded-[28px] p-[clamp(14px,2vw,28px)] max-phone:rounded-[22px]"
                style={{ "--panel": project.color } as CSSProperties}
              >
                <div className="relative aspect-[4/3]">
                  <LaptopMockup
                    src={project.image}
                    video={project.video}
                    alt={`${project.title} project`}
                    sizes="(max-width: 520px) 100vw, 50vw"
                    laptopClassName="transition duration-500 ease-soft group-hover:scale-[1.03]"
                  />
                </div>
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-border pt-[13px]">
                <span className="text-[clamp(22px,2.2vw,32px)] leading-tight">
                  <span className="mr-3 align-middle text-[11px] tracking-[0.08em] text-muted-foreground tabular-nums">
                    {project.number}
                  </span>
                  <span className="link-underline">{project.title}</span>
                </span>
                <span className="text-[10px] tracking-[0.08em] whitespace-nowrap text-muted-foreground uppercase">
                  {project.category} · {project.year}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{project.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
      <SiteFooter />
    </main>
  )
}
