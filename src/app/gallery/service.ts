import { getCollectionIndex } from "@/data/collections";
import { fetchLiquidiumActiveLoans, type LiquidiumLoan } from "@/lib/liquidium";
import {
  getCollectionTokens,
  getTokensByIds,
  isOrdinalSort,
} from "@/lib/ordinals";
import {
  COLLECTION_TOTALS,
  COLLECTIONS,
  DEFAULT_SORT,
  PAGE_SIZE,
  SEARCH_MAX_MATCHES,
} from "./constants";
import type { SearchParams } from "./types";
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
}

function searchCollectionIndex({
  collection,
  query,
  page,
  pageSize,
}: SearchCollectionTokensParams) {
  const number = extractSearchNumber(query);
  const index = getCollectionIndex(collection);
  const matches: typeof index = [];
  let capped = false;

  for (const token of index) {
    if (!matchesTokenQuery(token, query, number)) continue;
    matches.push(token);
    if (matches.length >= SEARCH_MAX_MATCHES) {
      capped = true;
      break;
    }
  }

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const results = matches.slice(start, end);
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

export async function getGalleryData(searchParams: SearchParams | undefined) {
  const collection = resolveCollection(getParam(searchParams, "collection"));
  const sortByParam = getParam(searchParams, "sortBy");
  const sortBy = isOrdinalSort(sortByParam) ? sortByParam : DEFAULT_SORT;
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
        const loans = await fetchLiquidiumActiveLoans();

        return {
          tokens: [],
          loans,
          floorPrice: null,
          collection,
          activeCollection,
          sortBy,
          listedOnly,
          query,
          filters: { collection, sortBy, listedOnly, query },
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
      hasSearchMatch = tokens.length > 0;
      nextPage = null;
    } else if (query) {
      const response = searchCollectionIndex({
        collection,
        query,
        page,
        pageSize: PAGE_SIZE,
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

  const previousPage = page > 1 ? page - 1 : null;
  const baseQuery = buildBaseQuery(searchParams);
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
    floorPrice: null as number | null,
  };
}
