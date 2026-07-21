# AGENTS.md

## Project Overview

Bitcoin Puppets is a community-led hub for the Bitcoin Puppets Ordinals collection. The site embraces a chaotic retro desktop vibe while staying usable, fast, and deployable directly on Cloudflare Workers.

## Tech Stack

- TanStack Start with TanStack Router file-based routing
- React 19
- TypeScript (strict)
- Tailwind CSS v4
- Vite with `@cloudflare/vite-plugin`
- Cloudflare Workers + `wrangler.jsonc`
- Bun for package management

## Build, Lint, Test Commands

### Core Commands

- `bun run dev` — Vite development server in the Workers runtime.
- `bun run build` — TanStack Start client and Worker production build.
- `bun run preview` — Build and preview inside Cloudflare `workerd`.
- `bun run deploy` — Build and deploy with Wrangler.
- `bun run upload` — Build and upload a Worker version without deploying it.

### Linting, Formatting, Type Checks

- `bun run lint` — Biome code quality checks (lint + formatting diagnostics).
- `bun run format` — Biome formatter across the repo.
- `bun run typecheck` — `tsc --noEmit` strict type check.
- `bun run secretlint` — Secretlint scan across the repo.
- `bun run cf-typegen` — Generate Cloudflare environment types to `cloudflare-env.d.ts`.

### Single-File / Targeted Runs

- `bunx @biomejs/biome check path/to/file.tsx` — Check/lint a single file with Biome.
- `bunx @biomejs/biome format --write path/to/file.tsx` — Format a single file with Biome.
- `bun run typecheck` — No per-file target configured; run the full project.
- **Tests:** No unit test runner is configured in this repo yet.

### Pre-commit Hooks

- Husky + lint-staged run Biome fixes and Secretlint on staged files.
- If lint-staged fails, fix the reported file and re-stage.

## Runtime & Deployment Notes

- Local dev runs on `http://localhost:3000`.
- Local development and preview run in `workerd` through Cloudflare's Vite plugin.
- Production URL: https://bitcoinpuppets.community/

## Code Style Guidelines

### General

- Keep code clean and consistent even if visuals are intentionally messy.
- Prefer small, focused modules and reusable utilities.
- Avoid over-abstracting; favor clarity over cleverness.
- Do not add inline comments unless requested.

### Naming & Structure

- Directories are kebab-case (`santa-generator`, `quick-links`).
- React components are PascalCase (`HeroSection.tsx`).
- Hooks are `useX` camelCase (`useDraggableStickers.ts`).
- Utility functions are camelCase, constants are `SCREAMING_SNAKE_CASE`.
- TanStack routes live in `src/routes`; the generated `src/routeTree.gen.ts` must not be edited by hand.

### Imports

- Order imports: Node built-ins → third-party → `@/` aliases → relative (`./`).
- Prefer `@/` alias for `src` absolute imports.
- Use `import type` for type-only imports when mixing with values.
- Group related imports and keep blank lines between groups.

### TypeScript

- Project is `strict: true` — no implicit `any`.
- Prefer explicit types for public functions and exported values.
- Use `type` aliases for shapes, `interface` when extending.
- Avoid `as` casts unless narrowing from trusted sources.

### React & TanStack Start

- Use TanStack Router `Link` and navigation APIs for internal navigation.
- Use route loaders and server functions for server-only application data.
- Use server route handlers for public HTTP APIs.
- Keep Worker-only secrets and APIs out of client bundles.
- Prefer named exports for shared modules unless existing code uses default.

### Styling (Tailwind v4)

- Use Tailwind utilities; avoid inline styles.
- Prefer design tokens in `globals.css` via `@theme` when adding colors.
- Use responsive classes (mobile-first) and state variants (`hover:`, `focus:`).
- Keep CSS additions in `globals.css` or component-specific CSS when needed.

### Formatting

- Biome defaults (configured in `biome.json`) are the canonical format.
- Use double quotes and semicolons.
- Keep trailing commas in multiline objects/arrays.

### Error Handling & Logging

- Wrap external API calls in `try/catch`.
- Log with context (`console.warn`/`console.error`) and actionable messages.
- Convert unknown errors to safe `Error` messages before rethrowing.
- For user-facing errors, prefer friendly fallback strings.

## Visual Style (Retro Aesthetic)

- De-optimized retro look: Comic Sans fallback, heavy borders, pixel shadows.
- Prefer bold blocks, chunky buttons, and retro desktop panels.
- Disable antialiasing: no font smoothing; keep images pixelated.
- Keep layout intentionally playful but readable.

## Content & Data

- Gallery search uses static indices in `src/data/collections/*.json`.
- Gallery UI and loading logic live in `src/features/gallery`; shared Ordinals
  and Liquidium data access lives in `src/lib`.

## Security & Secrets

- Secretlint runs on every commit; avoid committing API keys.
- Use `.dev.vars` for local Worker secrets (do not commit).

## Editor/Assistant Rules

- No Cursor rules detected in `.cursor/rules/` or `.cursorrules`.
- No Copilot instructions detected in `.github/copilot-instructions.md`.
- If new rules are added, merge them into this file.

## Context (Lore)

- OPIUM is the original chaotic puppet HQ and a visual reference for tone.
- Bitcoin Puppets are a free mint Ordinals collection, fully community-driven.
- Community greeting is “bj” (like “gm” in crypto); ethos is world peace.
