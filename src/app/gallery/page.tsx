import type { Metadata } from "next";
import Link from "next/link";
import { isOrdinalSort } from "@/lib/ordinals";
import { DEFAULT_SORT, SITE_NAME, SOCIAL_IMAGE } from "./constants";
import GalleryControls from "./GalleryControls";
import GalleryGrid from "./GalleryGrid";
import GalleryPagination from "./GalleryPagination";
import LiquidiumGallery from "./LiquidiumGallery";
import { getGalleryData } from "./service";
import type { GalleryMetadataProps, GalleryPageProps } from "./types";
import { getParam, resolveCollection } from "./utils";

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  const data = await getGalleryData(resolvedSearchParams);

  const {
    tokens,
    loans = [],
    activeCollection,
    pagination: {
      page,
      totalPages,
      previousPage,
      nextPage,
      lastPage,
      baseQuery,
    },
    errorMessage,
    hasSearchMatch,
    filters: { collection, sortBy, listedOnly, query },
    floorPrice,
  } = data;

  return (
    <div className="relative min-h-screen pb-20">
      <div className="window-titlebar marquee border-b-4 border-black">
        <span className="text-sm md:text-base font-bold tracking-wide">
          bj bj bj ✦ ORDINALS GALLERY ✦ WORLD PEACE ONLY ✦ CHAOTIC PIXEL ENERGY
          ✦ bj bj bj
        </span>
      </div>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pt-10 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="pixel-border bg-white px-3 py-2 text-xs font-bold uppercase text-black hover:-translate-y-0.5 hover:shadow-press transition"
          >
            Back to Home
          </Link>
          <div className="pixel-border bg-black px-3 py-2 text-xs font-bold uppercase text-white">
            {activeCollection?.label ?? "Gallery"}
          </div>
        </div>

        <section className="pixel-border bg-white/90 p-6 text-black">
          <div className="window-titlebar mb-4 px-3 py-2 text-sm font-bold uppercase">
            {activeCollection?.label ?? "Gallery"} Gallery
          </div>
          <p className="text-sm leading-relaxed">
            {collection === "liquidium"
              ? "Pulling all active Bitcoin Puppets loans from Liquidium.WTF. Filter by duration and sort by amount or date."
              : "Pulling ordinals data from our local collection index. Use the controls to sort, filter, and inspect each puppet up close."}
          </p>
        </section>

        <GalleryControls
          collection={collection}
          sortBy={sortBy}
          query={query}
        />

        <section className="pixel-border bg-white/95 p-6 text-black">
          <div className="window-titlebar mb-4 flex items-center justify-between px-3 py-2 text-sm font-bold uppercase">
            <span>Results</span>
            <span className="text-xs">
              {collection === "liquidium" ? (
                `Showing all ${loans.length} active loans`
              ) : (
                <>
                  Page {page}
                  {totalPages ? ` of ${totalPages}` : ""}
                  {listedOnly ? " · Listed" : ""}
                  {query ? " · Search" : ""}
                </>
              )}
            </span>
          </div>
          {query ? (
            <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-bold uppercase">
              <div className="pixel-border bg-white px-3 py-2">
                Results for: <span className="text-puppet-purple">{query}</span>
              </div>
              <Link
                href={`/gallery?${new URLSearchParams({
                  collection,
                  sortBy,
                  ...(listedOnly ? { listed: "true" } : {}),
                }).toString()}`}
                className="pixel-border bg-puppet-pink px-3 py-2 text-xs font-bold uppercase text-black hover:-translate-y-0.5 hover:shadow-press transition"
              >
                Clear
              </Link>
            </div>
          ) : null}

          {errorMessage ? (
            <div className="pixel-border bg-puppet-pink px-4 py-3 text-sm font-bold uppercase text-black">
              {errorMessage}
            </div>
          ) : collection === "liquidium" ? (
            <LiquidiumGallery loans={loans} floorPrice={floorPrice} />
          ) : tokens.length ? (
            <GalleryGrid
              tokens={tokens}
              collectionLabel={activeCollection?.label ?? "Gallery"}
            />
          ) : (
            <div className="pixel-border bg-white px-4 py-3 text-sm">
              {query && !hasSearchMatch
                ? "No results on this page. Try another page or clear search."
                : "No puppets found for these filters."}
            </div>
          )}

          {collection !== "liquidium" && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs font-bold uppercase">
                Showing {tokens.length} items
              </div>
            </div>
          )}

          {collection !== "liquidium" && (
            <GalleryPagination
              baseQuery={baseQuery}
              page={page}
              hasNext={Boolean(nextPage)}
              hasPrev={Boolean(previousPage)}
              lastPage={lastPage}
              totalPages={totalPages}
            />
          )}
        </section>
      </main>
    </div>
  );
}

export async function generateMetadata({
  searchParams,
}: GalleryMetadataProps): Promise<Metadata> {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const collection = resolveCollection(
    getParam(resolvedSearchParams, "collection"),
  );
  const sortByParam = getParam(resolvedSearchParams, "sortBy");
  const sortBy = isOrdinalSort(sortByParam) ? sortByParam : DEFAULT_SORT;
  const listedOnly = getParam(resolvedSearchParams, "listed") === "true";
  const query = getParam(resolvedSearchParams, "q")?.trim() ?? "";

  // We can't reuse resolveActiveCollection easily without moving it, but find is cheap.
  // Actually we should export collections from constants and use finding logic there if duplicated.
  // For now inline is fine or import COLLECTIONS.
  const { COLLECTIONS } = await import("./constants");

  const activeCollection = COLLECTIONS.find(
    (item) => item.symbol === collection,
  );

  const title = `${activeCollection?.label ?? "Gallery"} Gallery`;
  const description =
    "Browse Bitcoin Puppets and OPIUM ordinals from our local index. Filter, sort, and inspect each puppet up close.";
  const hasFilters =
    collection !== "bitcoin-puppets" || // DEFAULT_COLLECTION
    sortBy !== DEFAULT_SORT ||
    listedOnly ||
    Boolean(query);

  return {
    title,
    description,
    alternates: {
      canonical: "/gallery",
    },
    openGraph: {
      title,
      description,
      url: "/gallery",
      siteName: SITE_NAME,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: SOCIAL_IMAGE,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SOCIAL_IMAGE],
    },
    robots: hasFilters
      ? {
          index: false,
          follow: true,
        }
      : {
          index: true,
          follow: true,
        },
  };
}
