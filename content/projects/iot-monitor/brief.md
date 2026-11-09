# IoT Factory Monitoring Platform

**Source:** `~/Desktop/00_coding/frontend/iot-monitor` (monorepo: `client/` + `server/`)

## Brief
A 2.5D/3D dashboard for a food-manufacturing company to monitor equipment across its regional factories in near real time — temperature, humidity, boiler state, operational status and anomaly alerts.

- **Global map view:** all factories with high-level status indicators.
- **Factory 3D view:** glTF floor plans (extruded walls) layered over vector maps, with equipment as interactive markers.
- **Popover cards:** live telemetry on hover/click.
- **Equipment CRUD:** place, edit (properties, alert thresholds, location), relocate and remove equipment on the floor plan; destructive actions go through a confirm dialog.
- **RBAC:** two hard-coded backend roles — HQ (read-only, all factories) and factory manager.
- Mock telemetry generator on the server (cron) using seeded alert thresholds.
- Deploys: client → Vercel, server → Render.

## Tech Stack
**Frontend (`client/`)**
| Concern | Choice |
|---|---|
| Framework | React 19 + Vite + TypeScript |
| Map | MapLibre GL JS + OpenFreeMap vector tiles |
| 3D | deck.gl (MapboxOverlay, ScenegraphLayer) + three.js, glTF models |
| State | Zustand |
| Routing | React Router 7 |
| Styling | Tailwind CSS v4, shadcn/ui (Radix), lucide-react |

**Backend (`server/`)**
| Concern | Choice |
|---|---|
| Runtime | Node + Express 5 + TypeScript |
| DB / ORM | PostgreSQL (PostGIS) + Prisma 7 |
| Auth | JWT (jsonwebtoken) |
| Other | Zod validation, node-cron mock telemetry, CORS, dotenv |
