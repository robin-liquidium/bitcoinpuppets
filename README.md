# Bitcoin Puppets Community Site

https://bitcoinpuppets.community/

A community-led hub for the Bitcoin Puppets Ordinals collection. This site embraces the chaotic, retro, and playful vibe of the Puppets while keeping the codebase clean, fast, and deployable directly on Cloudflare Workers.

## Stack

- TanStack Start with TanStack Router file routes
- React 19 and TypeScript
- Vite and Tailwind CSS v4
- Cloudflare Workers via the native Cloudflare Vite plugin
- Bun

## Local Development

Use Bun 1.3.14 or newer and Node.js 22.22.1 or newer. Node is required by the
development tooling and Git hooks.

```bash
bun install
bun run dev
```

Open http://localhost:3000. The development server runs application code inside
the Cloudflare Workers runtime through `@cloudflare/vite-plugin`.

Local Worker secrets belong in `.dev.vars`. Generate binding and runtime types
after changing Worker configuration:

```bash
bun run cf-typegen
```

## Cloudflare Preview (workerd)

Build and run the production output in `workerd`:

```bash
bun run preview
```

Deploy the same native Worker build with:

```bash
bun run deploy
```

## Content Context

Bitcoin Puppets is a community-driven, free mint Ordinals collection. The broader lore stems from OPIUM (Ord Puppet Inu Undoxxed Millionaire) and a shared ethos of world peace, memes, and experimental art. This site is designed to celebrate the culture rather than sell a roadmap.

## Static search index

Gallery search uses a prebuilt index stored in `src/data/collections/*.json`.
