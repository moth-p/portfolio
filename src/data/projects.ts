export type Project = {
  id: string
  number: string
  title: string
  category: string
  year: string
  summary: string
  description: string
  image: string
  video: string
  color: string
  services: string[]
}

export const projects: Project[] = [
  {
    id: "mixxtopia",
    number: "01",
    title: "Mixxtopia",
    category: "Brand site",
    year: "2026",
    summary: "A blueprint-style brand experience for NMIXX.",
    description:
      "A single-page brand site for the K-pop group NMIXX, styled as a blueprint terminal HUD. A boot sequence leads into six scroll-linked scenes, from a 3D album ring to a submarine flight, all built on a strict design-token system with light and dark themes.",
    image: "/projects/mixxtopia/cover.png",
    video: "/projects/mixxtopia/preview.mp4",
    color: "#eee8d0",
    services: ["React", "GSAP", "three.js", "Tailwind CSS"],
  },
  {
    id: "sma-monitor",
    number: "02",
    title: "SMA Monitor",
    category: "IoT dashboard",
    year: "2026",
    summary: "Where every device is, and how it's performing.",
    description:
      "A warehouse monitoring dashboard that pairs an interactive 3D building model with live metric charts. Device popovers stay anchored as the camera orbits, so an operator sees both where equipment sits and how it performs on one screen.",
    image: "/projects/sma-monitor/cover.png",
    video: "/projects/sma-monitor/preview.mp4",
    color: "#cccccc",
    services: ["React", "Autodesk Forge", "Chart.js", "shadcn/ui"],
  },
  {
    id: "long-term-care",
    number: "03",
    title: "UARK Care",
    category: "Data dashboard",
    year: "2026",
    summary: "One overview for every care institution.",
    description:
      "A visualization dashboard for a group of long-term care institutions. Management sees occupancy, residents, diets, events and car dispatch across all sites at a glance, then drills into a single institution from one dropdown.",
    image: "/projects/long-term-care/cover.png",
    video: "/projects/long-term-care/preview.mp4",
    color: "#d9d8d5",
    services: ["React", "Redux Toolkit", "Leaflet", "Recharts"],
  },
  {
    id: "gamehub",
    number: "04",
    title: "GameHub",
    category: "Web app",
    year: "2026",
    summary: "A pixel-art catalogue of 900k video games.",
    description:
      "A retro, pixel-art catalogue for browsing the RAWG games database. Search, filter, sort and rank close to a million titles, open any game in detail, and keep a personal collection, with the API key kept safely on the server.",
    image: "/projects/gamehub/cover.png",
    video: "/projects/gamehub/preview.mp4",
    color: "#787878",
    services: ["Next.js", "RAWG API", "Tailwind CSS", "shadcn/ui"],
  },
]

export function getProject(id: string) {
  return projects.find((project) => project.id === id)
}

export function getNextProject(id: string) {
  const index = projects.findIndex((project) => project.id === id)
  return projects[(index + 1) % projects.length]
}
