import { About } from "@/components/about"
import { Hero } from "@/components/hero"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { WorkSection } from "@/components/work-section"
import { projects } from "@/data/projects"

export default function HomePage() {
  return (
    <main>
      <SiteHeader />
      <Hero />
      <WorkSection projects={projects} />
      <About />
      <SiteFooter />
    </main>
  )
}
