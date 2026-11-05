import { useEffect, useRef, useState } from "react"

type Project = {
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

type Theme = "light" | "dark"

const projects: Project[] = [
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

function Arrow({ direction = "right" }: { direction?: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={direction === "left" ? "rotate-180" : ""}
    >
      <path d="M3 10h13M11.5 5.5 16 10l-4.5 4.5" />
    </svg>
  )
}

function BrandMark() {
  return (
    <button
      className="brand"
      onClick={() => {
        window.location.hash = ""
        window.scrollTo({ top: 0, behavior: "smooth" })
      }}
      aria-label="Go to home"
    >
      <span>AV</span>
      <i />
    </button>
  )
}

function ThemeIcon({ theme }: { theme: Theme }) {
  return theme === "light" ? (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 2.5v1.25M10 16.25v1.25M2.5 10h1.25M16.25 10h1.25M4.7 4.7l.88.88M14.42 14.42l.88.88M15.3 4.7l-.88.88M5.58 14.42l-.88.88" />
      <circle cx="10" cy="10" r="3.5" />
    </svg>
  ) : (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M16.4 12.8A7 7 0 0 1 7.2 3.6 7 7 0 1 0 16.4 12.8Z" />
    </svg>
  )
}

function Header({
  detail = false,
  theme,
  onToggleTheme,
}: {
  detail?: boolean
  theme: Theme
  onToggleTheme: () => void
}) {
  return (
    <header className="site-header">
      <BrandMark />
      <nav aria-label="Main navigation">
        {detail ? (
          <button
            className="nav-link"
            onClick={() => (window.location.hash = "")}
          >
            <span>Back to work</span>
          </button>
        ) : (
          <>
            <a className="nav-link active" href="#work">
              Work
            </a>
            <a className="nav-link" href="#about">
              About
            </a>
          </>
        )}
      </nav>
      <div className="header-actions">
        <a className="availability" href="mailto:hello@averyvale.design">
          <span className="availability-dot" />
          Available for work
        </a>
        <button
          className="theme-toggle"
          type="button"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          <ThemeIcon theme={theme} />
        </button>
      </div>
    </header>
  )
}

function HomePage({
  theme,
  onToggleTheme,
}: {
  theme: Theme
  onToggleTheme: () => void
}) {
  const scroller = useRef<HTMLDivElement>(null)

  const moveProjects = (direction: number) => {
    scroller.current?.scrollBy({ left: direction * 440, behavior: "smooth" })
  }

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const element = scroller.current
    if (!element || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return
    event.preventDefault()
    element.scrollLeft += event.deltaY
  }

  return (
    <main>
      <Header theme={theme} onToggleTheme={onToggleTheme} />
      <section className="hero page-grid" aria-labelledby="hero-title">
        <div className="eyebrow">
          <span>Independent designer</span>
          <span>Based in Amsterdam</span>
        </div>
        <h1 id="hero-title">
          I shape ideas into <em>graceful</em> digital experiences.
        </h1>
        <div className="hero-bottom">
          <p>
            Brand and product designer partnering with thoughtful people to make
            useful, lasting things.
          </p>
          <a
            className="circle-link"
            href="#work"
            aria-label="See selected work"
          >
            <Arrow />
          </a>
        </div>
        <div className="hero-orbit" aria-hidden="true">
          <div className="orbit-line" />
          <div className="orbit-dot" />
          <span>FORM / FUNCTION / FEELING</span>
        </div>
      </section>

      <section className="work-section" id="work" aria-labelledby="work-title">
        <div className="section-heading page-grid">
          <div>
            <span className="section-number">01</span>
            <h2 id="work-title">Selected work</h2>
          </div>
          <p>Drag or scroll to explore</p>
          <div className="scroll-controls">
            <button
              aria-label="Scroll projects left"
              onClick={() => moveProjects(-1)}
            >
              <Arrow direction="left" />
            </button>
            <button
              aria-label="Scroll projects right"
              onClick={() => moveProjects(1)}
            >
              <Arrow />
            </button>
          </div>
        </div>

        <div className="project-scroller" ref={scroller} onWheel={handleWheel}>
          <div className="project-track">
            {projects.map((project) => (
              <article className="project-card" key={project.id}>
                <button
                  className="project-image"
                  onClick={() =>
                    (window.location.hash = `project/${project.id}`)
                  }
                  aria-label={`View ${project.title} case study`}
                >
                  <img src={project.image} alt="" />
                  <span className="project-index">{project.number}</span>
                  <span className="view-pill">
                    View project <Arrow />
                  </span>
                </button>
                <button
                  className="project-info"
                  onClick={() =>
                    (window.location.hash = `project/${project.id}`)
                  }
                >
                  <span>
                    {project.category} · {project.year}
                  </span>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about page-grid" id="about">
        <span className="section-number">02</span>
        <p className="about-statement">
          Good design should feel <em>obvious</em> in hindsight. I bring
          strategy, identity, and interaction together to get there.
        </p>
        <div className="about-note">
          <span>Capabilities</span>
          <p>
            Brand systems, digital products, creative direction, and frontend
            collaboration.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function ProjectPage({
  project,
  theme,
  onToggleTheme,
}: {
  project: Project
  theme: Theme
  onToggleTheme: () => void
}) {
  const index = projects.findIndex((item) => item.id === project.id)
  const next = projects[(index + 1) % projects.length]

  useEffect(() => window.scrollTo(0, 0), [project.id])

  return (
    <main className="detail-page">
      <Header detail theme={theme} onToggleTheme={onToggleTheme} />
      <section className="project-hero page-grid">
        <div className="project-kicker">
          <span>{project.number} / 04</span>
          <span>{project.category}</span>
        </div>
        <h1>{project.title}</h1>
        <p>{project.summary}</p>
      </section>
      <section
        className="detail-cover"
        style={{ backgroundColor: project.color }}
      >
        <img src={project.image} alt={`${project.title} project`} />
      </section>
      <section className="project-overview page-grid">
        <div className="overview-meta">
          <div>
            <span>Year</span>
            <p>{project.year}</p>
          </div>
          <div>
            <span>Services</span>
            {project.services.map((service) => (
              <p key={service}>{service}</p>
            ))}
          </div>
        </div>
        <div className="overview-copy">
          <span>The idea</span>
          <h2>{project.description}</h2>
        </div>
      </section>
      <section className="process-grid page-grid">
        <div className="process-card dark-card">
          <span>01 — Clarity</span>
          <p>Remove the noise until the central idea has room to breathe.</p>
          <div className="shape shape-one" />
        </div>
        <div className="process-card yellow-card">
          <span>02 — Character</span>
          <p>Build a distinct language from a small set of memorable moves.</p>
          <div className="shape shape-two" />
        </div>
        <div className="process-card light-card">
          <span>03 — System</span>
          <p>Make every piece useful on its own and stronger together.</p>
          <div className="shape shape-three" />
        </div>
      </section>
      <button
        className="next-project page-grid"
        onClick={() => (window.location.hash = `project/${next.id}`)}
      >
        <span>Next project</span>
        <strong>{next.title}</strong>
        <span className="next-arrow">
          <Arrow />
        </span>
      </button>
      <Footer />
    </main>
  )
}

function Footer() {
  return (
    <footer>
      <div className="footer-top page-grid">
        <p>
          Have something
          <br />
          <em>good</em> in mind?
        </p>
        <a className="footer-cta" href="mailto:hello@averyvale.design">
          Let’s talk <Arrow />
        </a>
      </div>
      <div className="footer-bottom page-grid">
        <BrandMark />
        <div>
          <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href="https://www.behance.net" target="_blank" rel="noreferrer">
            Behance
          </a>
        </div>
        <span>© 2025 Avery Vale</span>
      </div>
    </footer>
  )
}

export default function App() {
  const [hash, setHash] = useState(window.location.hash)
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = window.localStorage.getItem("portfolio-theme")
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  })

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash)
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    window.localStorage.setItem("portfolio-theme", theme)
  }, [theme])

  const id = hash.match(/^#project\/(.+)$/)?.[1]
  const project = projects.find((item) => item.id === id)
  const toggleTheme = () =>
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"))

  return project ? (
    <ProjectPage project={project} theme={theme} onToggleTheme={toggleTheme} />
  ) : (
    <HomePage theme={theme} onToggleTheme={toggleTheme} />
  )
}
