import { createFileRoute, Link } from "@tanstack/react-router";
import FloorPriceTicker from "@/components/FloorPriceTicker";
import GalleryControls from "@/features/gallery/GalleryControls";
import GalleryGrid from "@/features/gallery/GalleryGrid";
import GalleryPagination from "@/features/gallery/GalleryPagination";
import LiquidiumGallery from "@/features/gallery/LiquidiumGallery";
import { loadGalleryData } from "@/features/gallery/load-gallery";
import { validateGallerySearch } from "@/features/gallery/types";
import { SITE_NAME, SITE_URL, SOCIAL_IMAGE } from "@/lib/site";

function getGalleryMarquee(collection: string) {
  return collection === "liquidium"
    ? "bj bj bj ✦ LIQUIDIUM LOANS ✦ WORLD PEACE ONLY ✦ CHAOTIC PIXEL ENERGY ✦ bj bj bj"
    : "bj bj bj ✦ ORDINALS GALLERY ✦ WORLD PEACE ONLY ✦ CHAOTIC PIXEL ENERGY ✦ bj bj bj";
}

function getGalleryDescription(collection: string) {
  return collection === "liquidium"
    ? "Pulling all active Bitcoin Puppets loans from Liquidium.WTF. Filter by duration and sort by amount or date."
    : "Browse Bitcoin Puppets and OPIUM ordinals from our local index. Filter, sort, and inspect each puppet up close.";
}

export const Route = createFileRoute("/gallery")({
  validateSearch: validateGallerySearch,
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => loadGalleryData({ data: deps }),
  head: ({ loaderData }) => {
    const collection = loaderData?.filters.collection ?? "bitcoin-puppets";
    const title = `${loaderData?.activeCollection?.label ?? "Gallery"} Gallery`;
    const description = getGalleryDescription(collection);
    const hasFilters =
      collection !== "bitcoin-puppets" ||
      loaderData?.filters.requestedSort !== "priceAsc" ||
      Boolean(loaderData?.filters.query);

    return {
      meta: [
        { title: `${title} — Bitcoin Puppets` },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: `${SITE_URL}/gallery` },
        { property: "og:site_name", content: SITE_NAME },
        { property: "og:locale", content: "en_US" },
        { property: "og:type", content: "website" },
        { property: "og:image", content: SOCIAL_IMAGE },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: SOCIAL_IMAGE },
        {
          name: "robots",
          content: hasFilters ? "noindex, follow" : "index, follow",
        },
      ],
      links: [{ rel: "canonical", href: `${SITE_URL}/gallery` }],
    };
  },
  pendingComponent: () => (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 pt-10 sm:px-6">
      <div className="pixel-border taped bg-note-yellow/95 p-6 font-marker text-sm uppercase text-black">
        Loading gallery... probably
      </div>
    </main>
  ),
  component: GalleryPage,
});

function GalleryPage() {
  const data = Route.useLoaderData();
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
    filters: { collection, requestedSort, query },
    floorPrice,
    listingDataAvailable,
  } = data;
  const isLiquidiumCollection = collection === "liquidium";

  return (
    <div className="relative min-h-screen pb-20">
      <div className="marquee-strip relative">
        <FloorPriceTicker />
        <div className="marquee marquee-inner px-2 py-1.5">
          <span className="text-sm md:text-base tracking-wide">
            {getGalleryMarquee(collection)}
          </span>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pt-10 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/"
            className="pixel-border rotate-[-1.5deg] bg-note-yellow px-3 py-2 font-marker text-xs uppercase text-black hover:-translate-y-0.5 hover:rotate-0 transition"
          >
            ← Back to Home
          </Link>
          <div className="pixel-border-alt rotate-[1.2deg] bg-black px-3 py-2 font-marker text-xs uppercase text-hl-yellow">
            {activeCollection?.label ?? "Gallery"}
          </div>
        </div>

        <section className="pixel-border taped rotate-[0.5deg] bg-note-blue/95 p-6 text-black">
          <div className="window-titlebar mb-4 inline-block px-4 py-2">
            {activeCollection?.label ?? "Gallery"} Gallery
          </div>
          <p className="text-sm leading-relaxed">
            {getGalleryDescription(collection)}
          </p>
        </section>

        <GalleryControls
          collection={collection}
          sortBy={requestedSort}
          query={query}
        />

        <section className="pixel-border-alt rotate-[-0.3deg] bg-white/95 p-6 text-black">
          <div className="window-titlebar mb-4 flex items-center justify-between px-3 py-2">
            <span>Results</span>
            <span className="text-xs">
              {isLiquidiumCollection ? (
                `Showing all ${loans.length} active loans`
              ) : (
                <>
                  Page {page}
                  {totalPages ? ` of ${totalPages}` : ""}
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
                to="/gallery"
                search={{ collection, sortBy: requestedSort }}
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
          ) : isLiquidiumCollection ? (
            <LiquidiumGallery loans={loans} floorPrice={floorPrice} />
          ) : tokens.length ? (
            <GalleryGrid
              tokens={tokens}
              collectionLabel={activeCollection?.label ?? "Gallery"}
              listingDataAvailable={listingDataAvailable}
            />
          ) : (
            <div className="pixel-border bg-white px-4 py-3 text-sm">
              {query && !hasSearchMatch
                ? "No results on this page. Try another page or clear search."
                : "No puppets found for these filters."}
            </div>
          )}

          {!isLiquidiumCollection && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs font-bold uppercase">
                Showing {tokens.length} items
              </div>
            </div>
          )}

          {!isLiquidiumCollection && (
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
