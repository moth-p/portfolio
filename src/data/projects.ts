export type Project = {
  id: string
  number: string
  title: string
  category: string
  year: string
  summary: string
  description: string
  image: string
  color: string
  services: string[]
}

export const projects: Project[] = [
  {
    id: "luma",
    number: "01",
    title: "Luma Living",
    category: "Brand & digital",
    year: "2025",
    summary: "A gentler way to find your next home.",
    description:
      "Luma transforms a typically stressful property search into a calm, considered experience. We created an identity and product system that makes every interaction feel reassuring, human, and clear.",
    image:
      "https://images.unsplash.com/photo-1534841070059-fac69c75d466?auto=format&fit=crop&w=1600&q=85",
    color: "#eee8d0",
    services: ["Strategy", "Identity", "Product design"],
  },
  {
    id: "alto",
    number: "02",
    title: "Alto Objects",
    category: "E-commerce",
    year: "2024",
    summary: "Everyday objects, elevated by intention.",
    description:
      "A digital flagship for a new generation of collectible furniture. Generous space, tactile motion, and a modular editorial system let each object tell its own story.",
    image:
      "https://images.unsplash.com/photo-1758467614302-e429ce30fc13?auto=format&fit=crop&w=1600&q=85",
    color: "#cccccc",
    services: ["Creative direction", "Web design", "Development"],
  },
  {
    id: "field",
    number: "03",
    title: "Field Notes",
    category: "Editorial platform",
    year: "2024",
    summary: "Stories from the people shaping new places.",
    description:
      "Field Notes is an independent journal exploring architecture, food, and local culture. The flexible identity and reading experience shift naturally between long-form stories and visual essays.",
    image:
      "https://images.unsplash.com/photo-1761237584852-1a6fc838d35a?auto=format&fit=crop&w=1600&q=85",
    color: "#787878",
    services: ["Editorial design", "Digital product", "Art direction"],
  },
  {
    id: "common",
    number: "04",
    title: "Common Ground",
    category: "Place & identity",
    year: "2023",
    summary: "A shared space for thoughtful city living.",
    description:
      "We shaped a living identity for a mixed-use neighborhood rooted in connection. The system balances a civic sense of permanence with warmth, movement, and daily discovery.",
    image:
      "https://images.unsplash.com/photo-1772734436980-f24738818c5c?auto=format&fit=crop&w=1600&q=85",
    color: "#efefef",
    services: ["Brand strategy", "Identity", "Environmental"],
  },
]

export function getProject(id: string) {
  return projects.find((project) => project.id === id)
}

export function getNextProject(id: string) {
  const index = projects.findIndex((project) => project.id === id)
  return projects[(index + 1) % projects.length]
}
