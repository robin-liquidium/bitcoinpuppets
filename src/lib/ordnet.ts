export type OrdNetListings = {
  floorSats: number | null;
  listedCount: number;
  prices: Map<string, number>;
};

type OrdNetItem = {
  id?: string;
  listingState?: string;
  priceSats?: number;
};

type OrdNetItemsResponse = {
  items?: OrdNetItem[];
  pagination?: { hasNext?: boolean; nextCursor?: string };
};

const CACHE_TTL_MS = 120_000;
const FAILURE_CACHE_TTL_MS = 30_000;
const PAGE_SIZE = 60;
const MAX_PAGES = Math.ceil(10_001 / PAGE_SIZE);
const PAGE_TIMEOUT_MS = 5_000;
const FRESH_FETCH_TIMEOUT_MS = 15_000;

const cache = new Map<string, { data: OrdNetListings; expiresAt: number }>();
const failureCache = new Map<string, { error: Error; expiresAt: number }>();
const inFlight = new Map<string, Promise<OrdNetListings>>();

async function fetchOrdNetListingsFresh(slug: string): Promise<OrdNetListings> {
  const prices = new Map<string, number>();
  const seenCursors = new Set<string>();
  const freshFetchSignal = AbortSignal.timeout(FRESH_FETCH_TIMEOUT_MS);
  let cursor: string | undefined;
  let paginationComplete = false;

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const url = new URL(`https://ord.net/api/collections/${slug}/items`);
    url.searchParams.set("limit", String(PAGE_SIZE));
    url.searchParams.set("status", "listed");
    if (cursor) url.searchParams.set("cursor", cursor);

    const res = await fetch(url, {
      headers: {
        accept: "application/json",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) bitcoinpuppets.community",
      },
      signal: AbortSignal.any([
        freshFetchSignal,
        AbortSignal.timeout(PAGE_TIMEOUT_MS),
      ]),
    });
    if (!res.ok) throw new Error(`ord.net ${res.status}`);

    const data = (await res.json()) as OrdNetItemsResponse;
    for (const item of data.items ?? []) {
      if (
        item.listingState === "buyable" &&
        typeof item.id === "string" &&
        typeof item.priceSats === "number" &&
        Number.isSafeInteger(item.priceSats) &&
        item.priceSats >= 0 &&
        !prices.has(item.id)
      ) {
        prices.set(item.id, item.priceSats);
      }
    }

    const nextCursor = data.pagination?.nextCursor;
    if (!data.pagination?.hasNext) {
      paginationComplete = true;
      break;
    }
    if (!nextCursor) throw new Error("ord.net pagination cursor missing");
    if (seenCursors.has(nextCursor)) {
      throw new Error("ord.net pagination cursor repeated");
    }
    seenCursors.add(nextCursor);
    cursor = nextCursor;
  }

  if (!paginationComplete) {
    throw new Error("ord.net pagination exceeded maximum pages");
  }

  const floorSats = prices.size ? Math.min(...prices.values()) : null;
  return { floorSats, listedCount: prices.size, prices };
}

export async function fetchOrdNetListings(
  slug = "bitcoin-puppets",
): Promise<OrdNetListings> {
  const now = Date.now();
  const cached = cache.get(slug);
  if (cached && cached.expiresAt > now) return cached.data;

  const cachedFailure = failureCache.get(slug);
  if (cachedFailure && cachedFailure.expiresAt > now) {
    throw cachedFailure.error;
  }
  failureCache.delete(slug);

  const pending = inFlight.get(slug);
  if (pending) return pending;

  const request = fetchOrdNetListingsFresh(slug)
    .then((data) => {
      cache.set(slug, { data, expiresAt: Date.now() + CACHE_TTL_MS });
      failureCache.delete(slug);
      return data;
    })
    .catch((error: unknown) => {
      const normalizedError =
        error instanceof Error ? error : new Error("ord.net request failed");
      failureCache.set(slug, {
        error: normalizedError,
        expiresAt: Date.now() + FAILURE_CACHE_TTL_MS,
      });
      throw normalizedError;
    })
    .finally(() => {
      inFlight.delete(slug);
    });

  inFlight.set(slug, request);
  return request;
}
