import { getCollectionIndex } from "@/data/collections";

export const ORDINAL_SORT_OPTIONS = [
  { value: "priceAsc", label: "Price: low to high" },
  { value: "priceDesc", label: "Price: high to low" },
  { value: "inscriptionNumberAsc", label: "Inscription: low to high" },
  { value: "inscriptionNumberDesc", label: "Inscription: high to low" },
  { value: "displayNameAsc", label: "Name: A to Z" },
  { value: "displayNameDesc", label: "Name: Z to A" },
] as const;

export type OrdinalSort = (typeof ORDINAL_SORT_OPTIONS)[number]["value"];

export type OrdinalToken = {
  id: string;
  contentURI: string;
  contentType: string;
  displayName: string;
  inscriptionNumber: number;
  listed: boolean;
  listedPrice?: number;
};

export function isOrdinalSort(value?: string): value is OrdinalSort {
  return ORDINAL_SORT_OPTIONS.some((option) => option.value === value);
}

function inferContentTypeFromDisplayName(displayName?: string) {
  const normalized = displayName?.toLowerCase() ?? "";
  if (normalized.endsWith(".webm")) return "video/webm";
  if (normalized.endsWith(".mp4")) return "video/mp4";
  if (normalized.endsWith(".gif")) return "image/gif";
  if (normalized.endsWith(".svg")) return "image/svg+xml";
  return "image/png";
}

function resolveContentUri(tokenId: string) {
  return `https://ordinals.com/content/${tokenId}`;
}

function sortTokens(tokens: OrdinalToken[], sortBy: OrdinalSort) {
  const sorted = [...tokens];

  if (sortBy === "inscriptionNumberAsc") {
    sorted.sort((a, b) => a.inscriptionNumber - b.inscriptionNumber);
    return sorted;
  }

  if (sortBy === "inscriptionNumberDesc") {
    sorted.sort((a, b) => b.inscriptionNumber - a.inscriptionNumber);
    return sorted;
  }

  if (sortBy === "displayNameAsc") {
    sorted.sort((a, b) => a.displayName.localeCompare(b.displayName));
    return sorted;
  }

  sorted.sort((a, b) => b.displayName.localeCompare(a.displayName));
  return sorted;
}

/**
 * Returns a paginated slice of tokens from the local collection index.
 */
export function getCollectionTokens(options: {
  collection: string;
  sortBy: OrdinalSort;
  offset: number;
  limit: number;
}) {
  const index = getCollectionIndex(options.collection);
  const mapped: OrdinalToken[] = index.map((item) => ({
    id: item.id,
    contentURI: resolveContentUri(item.id),
    contentType: inferContentTypeFromDisplayName(item.displayName),
    displayName: item.displayName ?? `Inscription #${item.inscriptionNumber}`,
    inscriptionNumber: item.inscriptionNumber,
    listed: false,
  }));

  const sorted = sortTokens(mapped, options.sortBy);
  const tokens = sorted.slice(options.offset, options.offset + options.limit);

  return {
    tokens,
    total: mapped.length,
  };
}

/**
 * Resolves tokens by id while preserving the caller-provided order.
 */
export function getTokensByIds(collection: string, tokenIds: string[]) {
  const indexById = new Map(
    getCollectionIndex(collection).map((item) => [
      item.id,
      {
        id: item.id,
        contentURI: resolveContentUri(item.id),
        contentType: inferContentTypeFromDisplayName(item.displayName),
        displayName:
          item.displayName ?? `Inscription #${item.inscriptionNumber}`,
        inscriptionNumber: item.inscriptionNumber,
        listed: false,
      } satisfies OrdinalToken,
    ]),
  );

  return tokenIds.flatMap((tokenId) => {
    const token = indexById.get(tokenId);
    return token ? [token] : [];
  });
}
