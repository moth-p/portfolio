export type Audience = "enterprise" | "consumer"

export type Project = {
  id: string
  number: string
  title: string
  category: string
  /** Who the product is for: an internal enterprise back office (企業後台) or a public consumer-facing site (前台) */
  audience: Audience
  year: string
  /** One-line brief, condensed from the description */
  summary: string
  /** Traditional Chinese brief, shown under the English one */
  summaryTw: string
  description: string
  /** Traditional Chinese description, shown on the case study page */
  descriptionTw: string
  image: string
  video: string
  color: string
  techStack: string[]
  /** What I was responsible for on the project */
  duties: string[]
  /** Traditional Chinese duties, shown on the case study page */
  dutiesTw: string[]
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
    audience: "enterprise",
    year: "2026",
    summary: "A device monitoring interface pairing a 3D building model with live device metric charts.",
    summaryTw: "結合 3D 建築模型與即時設備數據圖表的設備監控介面。",
    description:
      "A device monitoring interface that pairs an interactive 3D building model with live metric charts. Device popovers stay anchored as the camera orbits, so an operator sees both where equipment sits and how it performs on one screen.",
    descriptionTw:
      "農業 IoT 監控系統，結合 3D 建築模型與即時設備數據圖表以掌握設備位置與運作狀況。",
    image: "/projects/sma-monitor/cover-v2.png",
    video: "/projects/sma-monitor/preview-v2.mp4",
    color: "#cccccc",
    techStack: ["React", "TypeScript", "Vite", "Zustand", "React Router", "Tailwind CSS", "shadcn/ui", "Autodesk Forge", "Chart.js", "ESLint"],
    duties: [
      "Worked with the PM and backend engineers to define requirements and API contracts",
      "Designed the UI/UX, from user flows and wireframes to the final interface",
      "Led the whole frontend: layout, tech stack choices and API integration",
      "Integrated the Autodesk Forge 3D viewer with live Chart.js metric charts",
    ],
    dutiesTw: [
      "與 PM 協作，釐清需求並製作 Prototype 與 MVP",
      "主責 UI/UX 設計，從使用者流程到最終介面",
      "整合 Autodesk Forge 3D 檢視器與 Chart.js 即時數據圖表",
    ],
  },
  {
    id: "long-term-care",
    number: "02",
    title: "UARK Care",
    category: "Data dashboard",
    audience: "enterprise",
    year: "2026",
    summary: "A visualization interface for a long-term care group, with a GIS map showing how every institution is running.",
    summaryTw: "集團式長照機構監控系統，透過 GIS 地圖掌握各機構的營運狀況。",
    description:
      "A visualization interface for a group of long-term care institutions. A GIS map shows management the occupancy, residents, diets, events and car dispatch of every site, and one dropdown drills into a single institution.",
    descriptionTw:
      "集團式長照機構監控系統，透過 GIS 地圖掌握各機構的住民、床位、膳食、活動與派車狀況，結合圖表與 3D 地圖。",
    image: "/projects/long-term-care/cover-map.png",
    video: "/projects/long-term-care/preview-map.mp4",
    color: "#d9d8d5",
    techStack: ["React", "TypeScript", "Vite", "Redux Toolkit", "React Router", "Axios", "Tailwind CSS", "shadcn/ui", "Leaflet", "Recharts", "ESLint"],
    duties: [
      "Worked with the PM and backend engineers to define requirements and API contracts",
      "Designed the UI/UX, from user flows and wireframes to the final interface",
      "Led the whole frontend: layout, tech stack choices and API integration",
      "Built the Leaflet GIS map and Recharts charts for each institution's operations",
    ],
    dutiesTw: [
      "與 PM 及後端工程師協作，釐清需求並制定 API 規格",
      "主責 UI/UX 設計，從使用者流程到最終介面",
      "主責前端開發，包含版面架構、技術棧與 API 串接",
      "以 Leaflet 與 OpenFreeMap 建置 GIS 地圖",
    ],
  },
  {
    id: "mixxtopia",
    number: "03",
    title: "Mixxtopia",
    category: "Brand site",
    audience: "consumer",
    year: "2026",
    summary: "An NMIXX brand site, with motion built around the group's MMU concept.",
    summaryTw: "NMIXX 形象網站，透過品牌 MMU 概念打造動態效果。",
    description:
      "An NMIXX brand site, with motion built around the group's MMU concept. It draws on the color palette of their first full album, Blue Valentine, for a cyber-styled visual experience.",
    descriptionTw:
      "品牌形象網站，透過品牌 MMU 概念來製作動態效果。內容包含音樂風格概述、成員與近期歷程介紹。",
    image: "/projects/mixxtopia/cover.png",
    video: "/projects/mixxtopia/preview.mp4",
    github: "https://github.com/moth-p/mixxtopia-front",
    website: "https://mixxtopia.pages.dev",
    color: "#eee8d0",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "three.js", "GSAP", "p5.js", "Animate.css", "Iconify"],
    duties: [
      "A personal side project: designed the UI/UX and built the whole frontend on my own",
      "Built motion around NMIXX's MMU concept with GSAP and three.js",
      "Turned the Blue Valentine album palette into a cyber-styled design-token system",
    ],
    dutiesTw: [
      "個人 Side Project，獨立完成 UI/UX 設計與前端開發",
      "以 GSAP 與 Three.js 打造動態效果",
      "以 P5.js 製作簡易互動遊戲",
    ],
  },
  {
    id: "iot-monitor",
    number: "04",
    title: "IoT Monitor",
    category: "Factory monitoring",
    audience: "enterprise",
    year: "2026",
    summary: "A 3D map interface for monitoring factory equipment across regions in real time.",
    summaryTw: "以 3D 地圖來即時監控各地工廠設備的介面。",
    description:
      "A 3D map interface for a food manufacturer to monitor equipment across its regional factories in real time. Floor plans rise out of a vector map with each machine as a marker, and popover cards show live temperature, humidity, status and anomaly alerts.",
    descriptionTw:
      "消防 IoT 監控系統，即時監控各地工廠的設備，每台機器以標記呈現，資訊卡顯示即時溫度、濕度、狀態與異常警示。",
    image: "/projects/iot-monitor/cover-v2.png",
    video: "/projects/iot-monitor/preview-v2.mp4",
    color: "#d2d2d6",
    techStack: ["React", "TypeScript", "Vite", "Zustand", "React Router", "Axios", "Tailwind CSS", "shadcn/ui", "MapLibre GL", "three.js", "ESLint"],
    duties: [
      "Worked with the PM and backend engineers to define requirements and API contracts",
      "Designed the UI/UX, from user flows and wireframes to the final interface",
      "Led the whole frontend: layout, tech stack choices and API integration",
      "Built the 3D map with MapLibre GL, deck.gl and three.js, showing live readings and anomaly alerts",
    ],
    dutiesTw: [
      "與 PM 協作，釐清需求並製作 Prototype 與 MVP",
      "主責 UI/UX 設計，從使用者流程到最終介面",
      "以 MapLibre GL 與 Three.js 建置 3D 地圖，視覺化異常警示",
    ],
  },
  {
    id: "gamehub",
    number: "05",
    title: "GameHub",
    category: "Web app",
    audience: "consumer",
    year: "2026",
    summary: "A catalogue for searching and collecting from 900k games.",
    summaryTw: "遊戲列表，可搜尋、篩選並收藏近百萬款遊戲。",
    description:
      "A catalogue for browsing the RAWG games database. Search, filter, sort and rank close to a million titles, open any game in detail, and keep a personal collection, with the API key kept safely on the server.",
    descriptionTw:
      "串接 RAWG 資料庫的遊戲列表，可搜尋、篩選、排序並排名近百萬款遊戲，查看每款遊戲的詳細資訊並建立個人收藏。",
    image: "/projects/gamehub/cover-grid.png",
    video: "/projects/gamehub/preview-collect.mp4",
    color: "#787878",
    techStack: ["Next.js", "TypeScript", "Axios", "Tailwind CSS", "shadcn/ui", "ESLint"],
    duties: [
      "A personal side project: designed the UI/UX and built the whole frontend on my own",
      "Built the pixel-art interface with Tailwind CSS and shadcn/ui",
      "Built search, filter, sort and ranking over the RAWG API, proxied through Next.js to keep the key on the server",
    ],
    dutiesTw: [
      "個人 Side Project，獨立完成 UI/UX 設計與前端開發",
      "串接 RAWG API 實作搜尋、篩選、排序與排名",
    ],
  },
  {
    id: "cvilux",
    number: "06",
    title: "CviLux",
    category: "Energy dashboard",
    audience: "enterprise",
    year: "2025",
    summary: "A company energy dashboard and IoT monitor built around a 3D model of the headquarters.",
    summaryTw: "結合總部 3D 建築模型的企業能源介面與 IoT 監控系統。",
    description:
      "An energy dashboard and IoT monitor for an electronics manufacturer. A 3D model of the headquarters sits beside live consumption figures, a per-department energy ranking, 30-day trends and the online, offline and alarm status of every building system, with views for monitoring, alerts, maintenance and devices.",
    descriptionTw:
      "企業能源與 IoT 監控系統。呈現總部與分部的即時用電數據、各部門能耗、用電趨勢，以及各系統設備的在線、離線與告警狀態。",
    image: "/projects/cvilux/cover.png",
    video: "/projects/cvilux/preview.mp4",
    color: "#2b333d",
    techStack: ["Vue", "Pinia", "Axios", "Vite", "Tailwind CSS", "Autodesk Forge"],
    duties: [
      "Maintained and debugged the existing Vue codebase",
      "Added and adjusted small features as new requirements came in",
    ],
    dutiesTw: [
      "維護既有 Vue 專案並排除問題",
      "依需求新增與調整小型功能",
    ],
  },
  {
    id: "explorer-iceland",
    number: "07",
    title: "Explorer",
    category: "Booking site",
    audience: "consumer",
    year: "2026",
    summary: "A booking site for Iceland excursions, with editorial type over full-bleed landscape photography.",
    summaryTw: "冰島旅遊行程預訂網站。",
    description:
      "A booking website for excursions in Iceland. Full-bleed landscape photography and large editorial type set the mood, and visitors move from the concept and about pages to a shop where they browse and book tours.",
    descriptionTw:
      "冰島旅遊行程預訂網站，首頁以滿版風景營造至置身其中的氛圍，訪客可從品牌概念與介紹頁面進入商店，瀏覽並預訂行程。",
    image: "/projects/explorer-iceland/cover.png",
    video: "/projects/explorer-iceland/preview.mp4",
    color: "#d8dbe0",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "ESLint"],
    duties: [
      "A personal side project: designed the UI/UX and built the whole frontend on my own",
      "Built the concept, about and shop pages for browsing and booking excursions",
    ],
    dutiesTw: [
      "個人 Side Project，獨立完成 UI/UX 設計與前端開發",
      "打造品牌概念，提供行程瀏覽與預訂",
    ],
  },
  {
    id: "weather-card",
    number: "08",
    title: "Taiwan Weather",
    category: "Weather card",
    audience: "consumer",
    year: "2026",
    summary: "A weather card for every area of Taiwan, powered by the Central Weather Administration's open data.",
    summaryTw: "串接中央氣象署開放資料，查詢台灣各地天氣的天氣卡片。",
    description:
      "A weather card for Taiwan built on the Central Weather Administration's open data API. Pick an area from the dropdown and the card fetches its current forecast, presented with pixel type, a speech bubble and a playful 3D flower character.",
    descriptionTw:
      "串接中央氣象署開放資料 API 的台灣天氣卡片。從下拉選單選擇縣市即可取得當地天氣預報。",
    image: "/projects/weather-card/cover.png",
    video: "/projects/weather-card/preview.mp4",
    color: "#3d3d3d",
    techStack: ["HTML", "CSS", "JavaScript", "Tailwind CSS", "GSAP"],
    duties: [
      "A personal side project: designed the UI/UX and built the whole frontend on my own",
      "Integrated the Central Weather Administration open data API to fetch forecasts by area",
    ],
    dutiesTw: [
      "個人 Side Project",
      "串接中央氣象署開放資料 API，依縣市取得天氣預報",
    ],
  },
  {
    id: "ils",
    number: "09",
    title: "ILS",
    category: "Energy dashboard",
    audience: "enterprise",
    year: "2025",
    summary: "An energy dashboard and IoT monitor for warehouses and the supply chain, on a GIS map.",
    summaryTw: "以 GIS 地圖呈現的倉儲物流能源介面與 IoT 監控系統。",
    description:
      "An energy dashboard and IoT monitor for a smart logistics warehouse. A GIS map pins each site with its storage usage, alongside device status for temperature, cold storage and fire detection, daily carbon emissions, energy trends, period-over-period comparisons and inventory charts.",
    descriptionTw:
      "智慧物流倉儲的能源與 IoT 監控系統。以 GIS 地圖標示各倉儲據點與使用量，呈現室溫、冷藏、煙火偵測等設備狀態、每日碳排、能耗趨勢與環比分析。",
    image: "/projects/ils/cover.png",
    video: "/projects/ils/preview.mp4",
    color: "#e4e6ea",
    techStack: ["Vue", "Pinia", "Axios", "Vite", "Tailwind CSS", "Leaflet", "ECharts"],
    duties: [
      "Maintained and debugged the existing Vue codebase",
      "Added and adjusted small features as new requirements came in",
    ],
    dutiesTw: [
      "維護既有 Vue 專案並排除問題",
      "依需求新增與調整小型功能",
    ],
  },
  {
    id: "netzero",
    number: "10",
    title: "NetZero",
    category: "Carbon accounting",
    audience: "enterprise",
    year: "2025",
    summary: "A carbon emission inventory system where companies enter emission data and export their reports.",
    summaryTw: "企業碳盤查系統，輸入各類排放源數據並產出盤查報告。",
    description:
      "A net zero carbon emission system for companies. An inventory plan lays out every emission source across the upstream, the organisation and the downstream, each with its own guided form for activity data and emission factors, and the results come out as an emissions overview and report.",
    descriptionTw:
      "企業淨零碳排盤查系統。盤查計畫依上游、組織與下游列出各類排放源，每一類都有對應的填報表單，輸入活動數據與排放係數後產出排放總覽與盤查報告。",
    image: "/projects/netzero/cover.png",
    video: "/projects/netzero/preview.mp4",
    color: "#d6d9ee",
    techStack: ["React", "Redux", "React Router", "Vite", "Tailwind CSS", "ECharts"],
    duties: [
      "Maintained and debugged the existing React codebase",
      "Added and adjusted small features as new requirements came in",
    ],
    dutiesTw: [
      "維護既有 React 專案並排除問題",
      "依需求新增與調整小型功能",
    ],
  },
]

// The Development section on the home page shows the first four
export const featuredProjects = projects.slice(0, 4)

export function getProject(id: string) {
  return projects.find((project) => project.id === id)
}

// The projects either side of `id`, wrapping around the list
// The projects either side of `id` in `list` (every project by default), wrapping around its ends.
export function getAdjacentProjects(id: string, list: Project[] = projects) {
  const index = list.findIndex((project) => project.id === id)
  return {
    previous: list[(index - 1 + list.length) % list.length],
    next: list[(index + 1) % list.length],
  }
}
