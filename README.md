# Bitcoin Puppets Community Site

https://bitcoinpuppets.community/

A community-led hub for the Bitcoin Puppets Ordinals collection. This site embraces the chaotic, retro, and playful vibe of the Puppets while keeping the codebase clean, fast, and deployable on Cloudflare Workers via OpenNext.

## Stack

- Next.js (App Router)
- Tailwind CSS
- OpenNext adapter for Cloudflare Workers
- Bun

## Local Development

```bash
bun install
bun run dev
```

Open http://localhost:3000.

## Cloudflare Preview (workerd)

Run the site using the Cloudflare runtime to catch Workers-specific issues early:

```bash
bun run preview
```

## Content Context

Bitcoin Puppets is a community-driven, free mint Ordinals collection. The broader lore stems from OPIUM (Ord Puppet Inu Undoxxed Millionaire) and a shared ethos of world peace, memes, and experimental art. This site is designed to celebrate the culture rather than sell a roadmap.

## Static search index

Gallery search uses a prebuilt index stored in `src/data/collections/*.json` to avoid Magic Eden rate limits. Build or refresh the index by running:

```bash
MAGIC_EDEN_API_KEY=... node scripts/build-magiceden-index.mjs
```
