import { COLLECTIONS, DEFAULT_COLLECTION, DEFAULT_PAGE } from "./constants";
import type { SearchParams } from "./types";

export function getParam(searchParams: SearchParams | undefined, key: string) {
  const value = searchParams?.[key];
  if (Array.isArray(value)) return value[0];
  return value;
}

export function resolveCollection(value?: string) {
  if (!value) return DEFAULT_COLLECTION;
  return COLLECTIONS.some((item) => item.symbol === value)
    ? value
    : DEFAULT_COLLECTION;
}

export function resolvePage(value?: string) {
  const parsed = Number(value ?? DEFAULT_PAGE);
  if (!Number.isFinite(parsed) || parsed < 1) return DEFAULT_PAGE;
  return Math.floor(parsed);
}

export function buildBaseQuery(searchParams: SearchParams | undefined) {
  const query = new URLSearchParams();
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key === "page") return;
      const normalized = Array.isArray(value) ? value[0] : value;
      if (normalized) {
        query.set(key, normalized);
      }
    });
  }
  return query.toString();
}

export function normalizeQuery(value: string) {
  return value.trim().toLowerCase();
}

export function extractSearchNumber(query: string) {
  const match = query.match(/#?\s*(\d{1,10})/);
  if (!match) return null;
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : null;
}

export function matchesTokenQuery(
  token: { id: string; displayName?: string; inscriptionNumber: number },
  query: string,
  number: number | null,
) {
  const normalized = normalizeQuery(query);
  if (!normalized) return false;
  if (token.id.toLowerCase() === normalized) return true;
  if (token.id.toLowerCase().includes(normalized)) return true;
  if (token.displayName?.toLowerCase().includes(normalized)) return true;
  if (number !== null && token.inscriptionNumber === number) return true;
  if (
    number !== null &&
    token.displayName?.toLowerCase().includes(`#${number}`)
  )
    return true;
  return false;
}
