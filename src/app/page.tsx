import { About } from "@/components/about"
import { Hero } from "@/components/hero"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export default function HomePage() {
  return (
    <main>
      <SiteHeader />
      <Hero />
      <About />
      <SiteFooter />
    </main>
  )
}
