# SMA — Symon (世茂) IoT Monitor

**Source:** `~/Desktop/00_coding/frontend/turn2data/sma_front`

## Brief
Single-page dashboard for monitoring IoT equipment in a warehouse facility. An interactive Autodesk Forge 3D model of the building sits beside metric charts, so an operator sees both *where* a device is and *how it's performing* on one screen.

- Login screen → dashboard (hash router with an auth guard; session in `localStorage`).
- Device-category tabs (RGV travelling lifts, shuttle vehicles, temp/humidity sensors, heat exchangers, CO₂ monitors) isolate and highlight matching equipment in the 3D model.
- Popovers stay anchored to each device as the camera orbits/zooms (3D → 2D projection every frame); clicking one opens a detail card with a daily energy bar chart.
- Right-hand column: temperature/humidity, power usage and carbon-emission charts with day / week / month / year period selectors.
- **Status:** front-end demo — no backend, placeholder data (`src/features/home/data/devices.ts` defines the intended API shapes). 營運 / 告警 / 設定 tabs are placeholders.

## Tech Stack
| Concern | Choice |
|---|---|
| Framework | React 19 + TypeScript 5.9 *(currently migrating from Vue 3 — uncommitted)* |
| Build | Vite 7 |
| Routing | React Router 7 (hash history) |
| Styling | Tailwind CSS 3.4 + tailwindcss-animate, CSS-variable design tokens |
| Components | shadcn/ui (Radix primitives), lucide-react icons |
| Charts | Chart.js 4 + react-chartjs-2 |
| 3D | Autodesk Forge Viewer 7.x (CDN) |
| Validation / HTTP | Zod, axios (installed, not yet used) |
| Testing | Vitest + Testing Library (happy-dom), Playwright e2e |
