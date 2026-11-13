import { Hero } from "@/components/hero"
import { SiteHeader } from "@/components/site-header"

export default function HomePage() {
  return (
    <main>
      <SiteHeader active="home" />
      <Hero />
    </main>
  )
}
