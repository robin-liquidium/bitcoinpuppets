export type GallerySearch = {
  collection?: string;
  page?: number;
  q?: string;
  sortBy?: string;
};

export function validateGallerySearch(
  search: Record<string, unknown>,
): GallerySearch {
  const stringValue = (value: unknown) => {
    if (typeof value === "string") return value;
    if (typeof value === "number") return String(value);
    return undefined;
  };

  return {
    collection: stringValue(search.collection),
    page:
      typeof search.page === "number" || typeof search.page === "string"
        ? Math.max(1, Math.floor(Number(search.page) || 1))
        : undefined,
    q: stringValue(search.q),
    sortBy: stringValue(search.sortBy),
  };
}
