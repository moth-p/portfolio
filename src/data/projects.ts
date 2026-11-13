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
  techStack: string[]
  /** What I was responsible for on the project */
  duties: string[]
  /** Repository URL; leave out when there isn't a public one */
  github?: string
  /** Live site URL; leave out when there isn't a public one */
  website?: string
}

export const projects: Project[] = [
  {
    id: "sma-monitor",
    number: "01",
    title: "SMA Monitor",
    category: "IoT dashboard",
    year: "2026",
    summary: "Where every device is, and how it's performing.",
    description:
      "A warehouse monitoring dashboard that pairs an interactive 3D building model with live metric charts. Device popovers stay anchored as the camera orbits, so an operator sees both where equipment sits and how it performs on one screen.",
    image: "/projects/sma-monitor/cover.png",
    video: "/projects/sma-monitor/preview.mp4",
    color: "#cccccc",
    techStack: ["React", "Autodesk Forge", "Chart.js", "shadcn/ui"],
    duties: [
      "Built the dashboard UI in React with shadcn/ui",
      "Integrated the Autodesk Forge 3D viewer and kept device popovers anchored while the camera orbits",
      "Wired live device metrics into Chart.js charts",
    ],
  },
  {
    id: "long-term-care",
    number: "02",
    title: "UARK Care",
    category: "Data dashboard",
    year: "2026",
    summary: "One overview for every care institution.",
    description:
      "A visualization dashboard for a group of long-term care institutions. Management sees occupancy, residents, diets, events and car dispatch across all sites at a glance, then drills into a single institution from one dropdown.",
    image: "/projects/long-term-care/cover.png",
    video: "/projects/long-term-care/preview.mp4",
    color: "#d9d8d5",
    techStack: ["React", "TypeScript", "Vite", "Redux Toolkit", "React Router", "Tailwind CSS", "shadcn/ui", "Leaflet", "Recharts", "ESLint"],
    duties: [
      "Built the multi-institution dashboard in React",
      "Managed shared filters and institution data with Redux Toolkit",
      "Built the Leaflet map and Recharts charts for occupancy, residents, diets and dispatch",
    ],
  },
  {
    id: "mixxtopia",
    number: "03",
    title: "Mixxtopia",
    category: "Brand site",
    year: "2026",
    summary: "A blueprint-style brand experience for NMIXX.",
    description:
      "A single-page brand site for the K-pop group NMIXX, styled as a blueprint terminal HUD. A boot sequence leads into six scroll-linked scenes, from a 3D album ring to a submarine flight, all built on a strict design-token system with light and dark themes.",
    image: "/projects/mixxtopia/cover.png",
    video: "/projects/mixxtopia/preview.mp4",
    color: "#eee8d0",
    techStack: ["React", "TypeScript", "Vite", "Tailwind CSS", "Animate.css", "GSAP", "three.js", "p5.js", "Iconify"],
    duties: [
      "Designed and built the blueprint HUD and design-token system with light and dark themes",
      "Choreographed the boot sequence and six scroll-linked scenes with GSAP",
      "Built the 3D album ring and submarine flight in three.js",
    ],
  },
  {
    id: "iot-monitor",
    number: "04",
    title: "IoT Monitor",
    category: "Factory monitoring",
    year: "2026",
    summary: "Every factory's equipment, live on a 3D map.",
    description:
      "A 2.5D/3D dashboard for a food manufacturer to watch equipment across its regional factories in near real time. Floor plans rise out of a vector map with each machine as a marker, and popover cards show live temperature, humidity, status and anomaly alerts.",
    image: "/projects/iot-monitor/cover.png",
    video: "/projects/iot-monitor/preview.mp4",
    color: "#d2d2d6",
    techStack: ["React", "TypeScript", "Vite", "Zustand", "React Router", "Tailwind CSS", "shadcn/ui", "MapLibre GL", "deck.gl", "three.js", "ESLint"],
    duties: [
      "Built the 2.5D/3D map view with MapLibre GL and deck.gl",
      "Raised factory floor plans and machine markers out of the vector map",
      "Built popover cards for live readings and anomaly alerts, fed by an Express API",
    ],
  },
  {
    id: "gamehub",
    number: "05",
    title: "GameHub",
    category: "Web app",
    year: "2026",
    summary: "A pixel-art catalogue of 900k video games.",
    description:
      "A retro, pixel-art catalogue for browsing the RAWG games database. Search, filter, sort and rank close to a million titles, open any game in detail, and keep a personal collection, with the API key kept safely on the server.",
    image: "/projects/gamehub/cover.png",
    video: "/projects/gamehub/preview.mp4",
    color: "#787878",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "ESLint"],
    duties: [
      "Designed and built the pixel-art UI with Tailwind CSS and shadcn/ui",
      "Built search, filter, sort and ranking over the RAWG API",
      "Proxied the RAWG API through Next.js so the key stays on the server",
    ],
  },
]

// The Development section on the home page shows the first four
export const featuredProjects = projects.slice(0, 4)

export function getProject(id: string) {
  return projects.find((project) => project.id === id)
}

// The projects either side of `id`, wrapping around the list
export function getAdjacentProjects(id: string) {
  const index = projects.findIndex((project) => project.id === id)
  return {
    previous: projects[(index - 1 + projects.length) % projects.length],
    next: projects[(index + 1) % projects.length],
  }
}
