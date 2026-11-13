export type Project = {
  id: string
  number: string
  title: string
  category: string
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
    year: "2026",
    summary: "A device monitoring interface pairing a 3D building model with live device metric charts.",
    summaryTw: "結合 3D 建築模型與即時設備數據圖表的設備監控介面。",
    description:
      "A device monitoring interface that pairs an interactive 3D building model with live metric charts. Device popovers stay anchored as the camera orbits, so an operator sees both where equipment sits and how it performs on one screen.",
    descriptionTw:
      "結合可互動的 3D 建築模型與即時設備數據圖表的設備監控介面。設備資訊卡會隨鏡頭旋轉固定在設備位置上，讓操作人員在同一個畫面中同時掌握設備位置與運作狀況。",
    image: "/projects/sma-monitor/cover.png",
    video: "/projects/sma-monitor/preview.mp4",
    color: "#cccccc",
    techStack: ["React", "Autodesk Forge", "Chart.js", "shadcn/ui"],
    duties: [
      "Worked with the PM and backend engineers to define requirements and API contracts",
      "Designed the UI/UX, from user flows and wireframes to the final interface",
      "Led the whole frontend: layout, tech stack choices and API integration",
      "Integrated the Autodesk Forge 3D viewer with live Chart.js metric charts",
    ],
    dutiesTw: [
      "與 PM 及後端工程師協作，釐清需求並制定 API 規格",
      "負責 UI/UX 設計，從使用者流程、線框稿到最終介面",
      "主導前端開發，包含版面架構、技術選型與 API 串接",
      "整合 Autodesk Forge 3D 檢視器與 Chart.js 即時數據圖表",
    ],
  },
  {
    id: "long-term-care",
    number: "02",
    title: "UARK Care",
    category: "Data dashboard",
    year: "2026",
    summary: "A visualization interface for a long-term care group, with a GIS map showing how every institution is running.",
    summaryTw: "長照機構集團的視覺化介面，透過 GIS 地圖掌握各機構的營運狀況。",
    description:
      "A visualization interface for a group of long-term care institutions. A GIS map shows management the occupancy, residents, diets, events and car dispatch of every site, and one dropdown drills into a single institution.",
    descriptionTw:
      "長照機構集團的視覺化介面。管理者透過 GIS 地圖掌握各機構的入住率、住民、膳食、活動與派車狀況，並可從下拉選單深入查看單一機構。",
    image: "/projects/long-term-care/cover.png",
    video: "/projects/long-term-care/preview.mp4",
    color: "#d9d8d5",
    techStack: ["React", "TypeScript", "Vite", "Redux Toolkit", "React Router", "Tailwind CSS", "shadcn/ui", "Leaflet", "Recharts", "ESLint"],
    duties: [
      "Worked with the PM and backend engineers to define requirements and API contracts",
      "Designed the UI/UX, from user flows and wireframes to the final interface",
      "Led the whole frontend: layout, tech stack choices and API integration",
      "Built the Leaflet GIS map and Recharts charts for each institution's operations",
    ],
    dutiesTw: [
      "與 PM 及後端工程師協作，釐清需求並制定 API 規格",
      "負責 UI/UX 設計，從使用者流程、線框稿到最終介面",
      "主導前端開發，包含版面架構、技術選型與 API 串接",
      "以 Leaflet 建置 GIS 地圖，並以 Recharts 呈現各機構營運數據",
    ],
  },
  {
    id: "mixxtopia",
    number: "03",
    title: "Mixxtopia",
    category: "Brand site",
    year: "2026",
    summary: "An NMIXX brand site, with motion built around the group's MMU concept.",
    summaryTw: "NMIXX 形象網站，透過品牌 MMU 概念打造動態效果。",
    description:
      "An NMIXX brand site, with motion built around the group's MMU concept. It draws on the color palette of their first full album, Blue Valentine, for a cyber-styled visual experience.",
    descriptionTw:
      "NMIXX 品牌網站，透過品牌 MMU 概念打造動態效果。結合正規一輯 Blue Valentine 的色彩計劃，打造賽博風格的的視覺體驗。",
    image: "/projects/mixxtopia/cover.png",
    video: "/projects/mixxtopia/preview.mp4",
    color: "#eee8d0",
    techStack: ["React", "TypeScript", "Vite", "Tailwind CSS", "Animate.css", "GSAP", "three.js", "p5.js", "Iconify"],
    duties: [
      "A personal side project: designed the UI/UX and built the whole frontend on my own",
      "Built motion around NMIXX's MMU concept with GSAP and three.js",
      "Turned the Blue Valentine album palette into a cyber-styled design-token system",
    ],
    dutiesTw: [
      "個人 Side Project，獨立完成 UI/UX 設計與前端開發",
      "以 GSAP 與 three.js 圍繞 NMIXX 的 MMU 概念打造動態效果",
      "以 P5.js 製作簡易互動遊戲",
    ],
  },
  {
    id: "iot-monitor",
    number: "04",
    title: "IoT Monitor",
    category: "Factory monitoring",
    year: "2026",
    summary: "A 2.5D/3D map interface for monitoring factory equipment across regions in real time.",
    summaryTw: "以 2.5D/3D 地圖來即時監控各地工廠設備的介面。",
    description:
      "A 2.5D/3D map interface for a food manufacturer to monitor equipment across its regional factories in real time. Floor plans rise out of a vector map with each machine as a marker, and popover cards show live temperature, humidity, status and anomaly alerts.",
    descriptionTw:
      "為食品製造商打造的 2.5D/3D 地圖介面，即時監控各地工廠的設備。廠區平面圖從向量地圖中立體浮現，每台機器以標記呈現，資訊卡顯示即時溫度、濕度、狀態與異常警示。",
    image: "/projects/iot-monitor/cover.png",
    video: "/projects/iot-monitor/preview.mp4",
    color: "#d2d2d6",
    techStack: ["React", "TypeScript", "Vite", "Zustand", "React Router", "Tailwind CSS", "shadcn/ui", "MapLibre GL", "deck.gl", "three.js", "ESLint"],
    duties: [
      "Worked with the PM and backend engineers to define requirements and API contracts",
      "Designed the UI/UX, from user flows and wireframes to the final interface",
      "Led the whole frontend: layout, tech stack choices and API integration",
      "Built the 2.5D/3D map with MapLibre GL, deck.gl and three.js, showing live readings and anomaly alerts",
    ],
    dutiesTw: [
      "與 PM 及後端工程師協作，釐清需求並制定 API 規格",
      "負責 UI/UX 設計，從使用者流程、線框稿到最終介面",
      "主導前端開發，包含版面架構、技術選型與 API 串接",
      "以 MapLibre GL、deck.gl 與 three.js 建置 2.5D/3D 地圖，呈現即時讀數與異常警示",
    ],
  },
  {
    id: "gamehub",
    number: "05",
    title: "GameHub",
    category: "Web app",
    year: "2026",
    summary: "A pixel-art catalogue for searching and collecting from 900k games.",
    summaryTw: "像素風格的遊戲目錄，可搜尋、篩選並收藏近百萬款遊戲。",
    description:
      "A retro, pixel-art catalogue for browsing the RAWG games database. Search, filter, sort and rank close to a million titles, open any game in detail, and keep a personal collection, with the API key kept safely on the server.",
    descriptionTw:
      "瀏覽 RAWG 遊戲資料庫的復古像素風遊戲目錄。可搜尋、篩選、排序並排名近百萬款遊戲，查看每款遊戲的詳細資訊並建立個人收藏。",
    image: "/projects/gamehub/cover.png",
    video: "/projects/gamehub/preview.mp4",
    color: "#787878",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "ESLint"],
    duties: [
      "A personal side project: designed the UI/UX and built the whole frontend on my own",
      "Built the pixel-art interface with Tailwind CSS and shadcn/ui",
      "Built search, filter, sort and ranking over the RAWG API, proxied through Next.js to keep the key on the server",
    ],
    dutiesTw: [
      "個人 Side Project，獨立完成 UI/UX 設計與前端開發",
      "以 Tailwind CSS 與 shadcn/ui 打造像素風介面",
      "串接 RAWG API 實作搜尋、篩選、排序與排名",
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
