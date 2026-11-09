# Mixxtopia — NMIXX Branding Site

**Source:** `~/Desktop/00_coding/frontend/mixxtopia`

## Brief
A single-page brand experience for the K-pop group NMIXX, styled as a blueprint / terminal HUD (grid backgrounds, corner brackets, monospace display type, scanlines, boot-sequence intro). Light and dark themes. One page, no routes, no commerce.

- Boot loading gate, then six scroll-linked sections: **VISUAL** (boot terminal, wordmark, HUD), **CONCEPT** (copy panels, orbital diagram, stat bar), **MEMBERS** (unit cards + member mini-game), **ALBUMS** (3D album ring + track-list popover), **EVENTS** (scroll-pinned full-bleed reel), **BON VOYAGE** (submarine flight scene, social rail).
- Theme follows OS preference, manual toggle persisted to `localStorage`.
- Strict design-token system: no colour values in `.tsx`, `style` only stamps CSS custom properties (lint-enforced).

## Tech Stack
| Concern | Choice |
|---|---|
| Framework | React 19 + TypeScript 5.7 |
| Build | Vite 8 (Node ≥ 22.12) |
| Styling | Tailwind CSS v4 + CSS token files (`src/styles/tokens/`), animate.css |
| Animation | GSAP |
| 3D / Generative | three.js, p5.js |
| Icons | Iconify (lucide, mdi, simple-icons) |
| Testing | Vitest + Testing Library (jsdom, v8 coverage), Playwright e2e |
| Tooling | oxfmt formatter, custom grep-based token / inline-style lints |
