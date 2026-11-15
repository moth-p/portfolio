import type { Metadata } from "next"

import { FadeInUp } from "@/components/fade-in-up"
import { ProjectGrid } from "@/components/project-grid"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { projects } from "@/data/projects"

export const metadata: Metadata = {
  title: "Projects",
  description: "Every project, from brand systems to digital products.",
}

export default function ProjectsPage() {
  return (
    <main className="pt-header">
      <SiteHeader active="projects" />
      {/* Title and cards follow the home page's Projects section */}
      <section className="grid-lines px-[calc(var(--spacing-gutter)*2)] pt-[clamp(28px,7vh,90px)] pb-[clamp(100px,13vw,180px)] max-tab:px-gutter max-tab:pt-[clamp(20px,4vh,44px)]">
        <FadeInUp
          as="h1"
          className="text-[clamp(44px,5.4vw,84px)] leading-[0.89] font-medium max-phone:text-[clamp(40px,12vw,56px)]"
        >
          Projects
        </FadeInUp>
        <ProjectGrid projects={projects} />
      </section>
      <SiteFooter />
    </main>
  )
}
