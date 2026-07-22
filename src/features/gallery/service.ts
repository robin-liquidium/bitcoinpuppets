import { getCollectionIndex } from "@/data/collections";
import { fetchLiquidiumActiveLoans, type LiquidiumLoan } from "@/lib/liquidium";
import {
  getCollectionTokens,
  getTokensByIds,
  isOrdinalSort,
} from "@/lib/ordinals";
import { fetchOrdNetListings, type OrdNetListings } from "@/lib/ordnet";
import {
  COLLECTION_TOTALS,
  COLLECTIONS,
  DEFAULT_SORT,
  PAGE_SIZE,
  SEARCH_MAX_MATCHES,
} from "./constants";
import type { GallerySearch } from "./types";
import {
  buildBaseQuery,
  extractSearchNumber,
  getParam,
  matchesTokenQuery,
  resolveCollection,
  resolvePage,
} from "./utils";

type Token = ReturnType<typeof getCollectionTokens>["tokens"][0];

interface SearchCollectionTokensParams {
  collection: string;
  query: string;
  page: number;
  pageSize: number;
  prices?: Map<string, number>;
  sortBy: string;
}

function orderTokensByPrice<T extends { id: string }>(
  tokens: T[],
  prices: Map<string, number>,
  sortBy: string,
) {
  return [...tokens].sort((a, b) => {
    const aPrice = prices.get(a.id);
    const bPrice = prices.get(b.id);

    if (aPrice === undefined) return bPrice === undefined ? 0 : 1;
    if (bPrice === undefined) return -1;
    return sortBy === "priceAsc" ? aPrice - bPrice : bPrice - aPrice;
  });
}

function searchCollectionIndex({
  collection,
  query,
  page,
  pageSize,
  prices,
  sortBy,
}: SearchCollectionTokensParams) {
  const number = extractSearchNumber(query);
  const index = getCollectionIndex(collection);
  const matches: typeof index = [];
  let capped = false;

  for (const token of index) {
    if (!matchesTokenQuery(token, query, number)) continue;
    matches.push(token);
    if (!prices && matches.length >= SEARCH_MAX_MATCHES) {
      capped = true;
      break;
    }
  }

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const orderedMatches = prices
    ? orderTokensByPrice(matches, prices, sortBy).slice(0, SEARCH_MAX_MATCHES)
    : matches;
  if (prices && matches.length > SEARCH_MAX_MATCHES) capped = true;
  const results = orderedMatches.slice(start, end);
  const hasNext = capped ? end < SEARCH_MAX_MATCHES : matches.length > end;

  return { results, hasNext };
}

function orderTokensById(tokens: Token[], order: string[]) {
  const ordering = new Map(order.map((id, index) => [id, index]));
  return [...tokens].sort((a, b) => {
    const aIndex = ordering.get(a.id) ?? Number.MAX_SAFE_INTEGER;
    const bIndex = ordering.get(b.id) ?? Number.MAX_SAFE_INTEGER;
    return aIndex - bIndex;
  });
}

export async function getGalleryData(searchParams: GallerySearch | undefined) {
  const collection = resolveCollection(getParam(searchParams, "collection"));
  const sortByParam = getParam(searchParams, "sortBy");
  const requestedSort = isOrdinalSort(sortByParam) ? sortByParam : DEFAULT_SORT;
  const listedOnly = false;
  const rawQuery = getParam(searchParams, "q")?.trim() ?? "";
  const page = resolvePage(getParam(searchParams, "page"));
  const offset = (page - 1) * PAGE_SIZE;

  const activeCollection = COLLECTIONS.find(
    (item) => item.symbol === collection,
  );

  let tokens: Token[] = [];
  let errorMessage: string | null = null;
  let hasSearchMatch = false;
  let nextPage: number | null = null;

  let ordNetListings: OrdNetListings | null = null;
  if (collection !== "liquidium") {
    ordNetListings = await fetchOrdNetListings(collection).catch((error) => {
      console.warn("ord.net listings unavailable:", error);
      return null;
    });
  }

  const requestedPriceSort =
    requestedSort === "priceAsc" || requestedSort === "priceDesc";
  const sortBy =
    collection !== "liquidium" && requestedPriceSort && !ordNetListings
      ? "inscriptionNumberDesc"
      : requestedSort;
  const isPriceSort = sortBy === "priceAsc" || sortBy === "priceDesc";

  const query = rawQuery.trim();
  const tokenIdCandidates = query
    .split(/[,\s]+/)
    .map((value) => value.trim())
    .filter(Boolean);
  const tokenIdsParam =
    tokenIdCandidates.length > 0 &&
    tokenIdCandidates.every((value) => /^[0-9a-f]{64}i\d+$/i.test(value))
      ? tokenIdCandidates
      : undefined;

  try {
    if (collection === "liquidium") {
      try {
        const [loans, listings] = await Promise.all([
          fetchLiquidiumActiveLoans(),
          fetchOrdNetListings().catch((error) => {
            console.warn("ord.net floor unavailable:", error);
            return null;
          }),
        ]);

        return {
          tokens: [],
          loans,
          floorPrice: listings?.floorSats ?? null,
          collection,
          activeCollection,
          sortBy,
          listedOnly,
          query,
          filters: {
            collection,
            sortBy,
            requestedSort,
            listedOnly,
            query,
          },
          pagination: {
            page: 1,
            nextPage: null,
            previousPage: null,
            lastPage: 1,
            totalPages: 1,
            baseQuery: "",
          },
          errorMessage: null,
          hasSearchMatch: true,
        };
      } catch (error) {
        console.error("Failed to load Liquidium data:", error);
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to load Liquidium data: ${message}`);
      }
    }

    if (query && tokenIdsParam) {
      tokens = getTokensByIds(collection, tokenIdsParam);
      if (isPriceSort && ordNetListings) {
        tokens = orderTokensByPrice(tokens, ordNetListings.prices, sortBy);
      }
      hasSearchMatch = tokens.length > 0;
      nextPage = null;
    } else if (query) {
      const response = searchCollectionIndex({
        collection,
        query,
        page,
        pageSize: PAGE_SIZE,
        prices:
          isPriceSort && ordNetListings ? ordNetListings.prices : undefined,
        sortBy,
      });
      const tokenIds = response.results.map((token) => token.id);

      if (tokenIds.length === 0) {
        tokens = [];
        hasSearchMatch = false;
        nextPage = null;
      } else {
        const staticTokens = getTokensByIds(collection, tokenIds);
        tokens = orderTokensById(staticTokens, tokenIds);
        hasSearchMatch = tokens.length > 0;
        nextPage = response.hasNext ? page + 1 : null;
      }
    } else if (isPriceSort && ordNetListings) {
      const index = getCollectionIndex(collection);
      const priceOf = (id: string) =>
        ordNetListings.prices.get(id) ?? Number.MAX_SAFE_INTEGER;
      const priced = index
        .filter((item) => ordNetListings.prices.has(item.id))
        .sort((a, b) =>
          sortBy === "priceAsc"
            ? priceOf(a.id) - priceOf(b.id)
            : priceOf(b.id) - priceOf(a.id),
        );
      const unpriced = index
        .filter((item) => !ordNetListings.prices.has(item.id))
        .sort((a, b) => b.inscriptionNumber - a.inscriptionNumber);
      const orderedIds = [...priced, ...unpriced]
        .map((item) => item.id)
        .slice(offset, offset + PAGE_SIZE);
      tokens = getTokensByIds(collection, orderedIds);
      nextPage = offset + PAGE_SIZE < index.length ? page + 1 : null;
    } else {
      const response = getCollectionTokens({
        collection,
        sortBy,
        limit: PAGE_SIZE,
        offset,
      });
      tokens = response.tokens;
      nextPage = offset + PAGE_SIZE < response.total ? page + 1 : null;
    }
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Unable to load gallery.";
  }

  if (ordNetListings && tokens.length > 0) {
    tokens = tokens.map((token) => {
      const price = ordNetListings.prices.get(token.id);
      return price !== undefined
        ? { ...token, listed: true, listedPrice: price }
        : { ...token, listed: false, listedPrice: undefined };
    });
  }

  const previousPage = page > 1 ? page - 1 : null;
  const baseQuery = buildBaseQuery({ ...searchParams, sortBy: requestedSort });
  const totalForCollection = COLLECTION_TOTALS[collection];
  const lastPage =
    !query && !listedOnly && totalForCollection
      ? Math.ceil(totalForCollection / PAGE_SIZE)
      : null;
  const totalPages =
    !query && !listedOnly && totalForCollection
      ? Math.ceil(totalForCollection / PAGE_SIZE)
      : null;

  return {
    tokens,
    loans: [] as LiquidiumLoan[],
    collection,
    activeCollection,
    sortBy,
    listedOnly,
    query,
    filters: {
      collection,
      sortBy,
      requestedSort,
      listedOnly,
      query,
    },
    pagination: {
      page,
      nextPage,
      previousPage,
      lastPage,
      totalPages,
      baseQuery,
    },
    errorMessage,
    hasSearchMatch,
    floorPrice: ordNetListings?.floorSats ?? null,
  };
}
