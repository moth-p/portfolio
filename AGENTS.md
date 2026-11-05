# portfolio

Next.js (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui portfolio site.

## Development

- `pnpm dev` - Next.js dev server (Turbopack) on http://localhost:3000
- `pnpm build` / `pnpm start` - production build and server
- `pnpm lint` - ESLint (flat config, `eslint-config-next` core-web-vitals + typescript)
- `pnpm typecheck` - `tsc --noEmit` (run `pnpm build` or `next typegen` first so route types like `PageProps` exist)

## Project Structure

- `src/app/layout.tsx` - Root layout: fonts (`next/font`), metadata, `ThemeProvider`
- `src/app/page.tsx` - Home page (`/`)
- `src/app/project/[id]/page.tsx` - Case study pages, statically generated from `src/data/projects.ts`; unknown ids 404
- `src/app/globals.css` - Tailwind v4 import, theme tokens, custom utilities
- `src/components/` - Page sections and shared pieces; `src/components/ui/` holds shadcn/ui components
- `src/data/projects.ts` - Project content and lookup helpers
- `src/lib/utils.ts` - `cn` class-name helper
- `components.json` - shadcn/ui CLI config (`pnpm dlx shadcn@latest add <component>`)
- `.mise.toml` - Toolchain versions for Node.js and pnpm

## Styling

- Colors are CSS variables on `:root` / `[data-theme='dark']` in `globals.css`, exposed as Tailwind colors (`bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-section`, `bg-highlight`, `bg-footer`, ...). Use these instead of hex values.
- Dark mode is driven by `next-themes` setting `data-theme` on `<html>`; the `dark:` variant targets it. The stored preference key is `portfolio-theme`.
- The layout is desktop-first: use `max-tab:` (≤800px) and `max-phone:` (≤520px) for responsive overrides, and `px-gutter` / `mx-gutter` for the page side gutter. Sections use a 12-column grid (`grid grid-cols-12 px-gutter`).
- Custom utilities in `globals.css`: `grid-lines` (column guide background), `marker` (highlighter stroke behind a word), `link-underline` (animated underline; add `data-active` to keep it shown).
- Put global element styles inside `@layer base { ... }` so utilities still override them.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
