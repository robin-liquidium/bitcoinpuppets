import type { OrdinalSort } from "@/lib/ordinals";

export const COLLECTIONS = [
  { symbol: "bitcoin-puppets", label: "Bitcoin Puppets" },
  { symbol: "opium", label: "OPIUM" },
  { symbol: "liquidium", label: "Liquidium.WTF Loans" },
] as const;

export const DEFAULT_COLLECTION = "bitcoin-puppets";
export const DEFAULT_SORT: OrdinalSort = "inscriptionNumberDesc";
export const DEFAULT_PAGE = 1;
export const PAGE_SIZE = 20;
export const SEARCH_MAX_MATCHES = 500;

export const COLLECTION_TOTALS: Record<string, number> = {
  "bitcoin-puppets": 10001,
  opium: 777,
  liquidium: 0,
};

export const SOCIAL_IMAGE = "/social_preview.png";
export const SITE_NAME = "Bitcoin Puppets";
