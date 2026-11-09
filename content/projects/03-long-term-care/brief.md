# Long-term Care Smart Visualization Dashboard (UARK)

**Source:** `~/Desktop/00_coding/frontend/long-term-care`
*(Production successor: `~/Desktop/00_coding/frontend/ibms-uark-web` — see note below)*

## Brief
Dashboard for UARK, a company that owns several (<10) long-term care institutions. Gives management an HQ overview of all institutions and lets them drill down into a single one. Read-only, single role, mock data.

- **Navbar:** institution dropdown (HQ = all, or one institution) that re-filters every section.
- **Home page:** institution card (photo, services); progress-bar metric cards — occupancy, hospitalized, new residents, closed cases; diet breakdown (veg / non-veg × normal / minced / tube-feeding); GIS map with all institution pins; paginated tables for activities, abnormal events and car dispatch.
- **Operation page:** "Coming Soon" placeholder.

## Tech Stack
| Concern | Choice |
|---|---|
| Build | Vite 8 |
| Framework | React 19 + TypeScript 6 |
| Styling | Tailwind CSS v4 (Vite plugin, no config file) |
| Components | shadcn/ui v4 (Base UI primitives), lucide-react, Geist font |
| Routing | React Router 7 |
| State | Redux Toolkit + react-redux (`institutionSlice`) |
| Map | Leaflet + React-Leaflet + OpenStreetMap tiles |
| Charts | Recharts 3 |
| Lint | ESLint |

## Related: UARK IBMS (production frontend)
`ibms-uark-web` is the real-backend version: Vue 3 + TypeScript SPA (being migrated to React 19, both coexisting), Autodesk Forge 3D floor models for bed status, Zustand, ECharts, FullCalendar, Leaflet/MapLibre, Tailwind v4, Vitest, multi-tenant/multi-brand, deployed as an Nginx Docker image with runtime config.
