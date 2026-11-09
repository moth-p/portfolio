# GameHub

**Source:** `~/Desktop/00_coding/frontend/gamehub`

## Brief
A browsable catalogue of video games — search, filter, sort, and collect — on live data from the RAWG Video Games Database API (~900k games), in a deliberate pixel-art / retro visual style (cream graph-paper background, purple accent, square corners, hard offset shadows).

- **Browse:** responsive card grid (cover, rating, platform badges, genre chips, collect button).
- **Search:** debounced, URL-driven, passed to RAWG's full-catalogue search.
- **Filter & sort:** genres, platforms, release time, rankings (best of year, popular, all-time top 250).
- **Game detail** page at `/games/[id]`.
- **Collection:** personal list saved in `localStorage`, shown at `/collection`.
- No own backend/database; `src/lib/rawg/` is the only network layer and the API key stays server-side.

## Tech Stack
| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) + React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (CSS config, `@utility` recipes), no inline styles (ESLint-enforced) |
| Components | shadcn/ui (vendored) + Radix UI, CVA variants, lucide-react |
| Data | RAWG REST API, server components + `server-only` |
| Testing / Lint | Playwright e2e, ESLint 9 |
