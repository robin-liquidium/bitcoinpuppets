import { Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useTransition } from "react";
import type { GallerySearch } from "./types";

type GalleryPaginationProps = {
  baseQuery: string;
  page: number;
  hasNext: boolean;
  hasPrev: boolean;
  lastPage?: number | null;
  totalPages?: number | null;
};

function buildSearch(baseQuery: string, page: number): GallerySearch {
  const params = Object.fromEntries(new URLSearchParams(baseQuery));
  return { ...params, page };
}

export default function GalleryPagination({
  baseQuery,
  page,
  hasNext,
  hasPrev,
  lastPage,
  totalPages,
}: GalleryPaginationProps) {
  const navigate = useNavigate({ from: "/gallery" });
  const [pending, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState(String(page));

  const lastSearch = useMemo(() => {
    if (!lastPage) return null;
    return buildSearch(baseQuery, lastPage);
  }, [baseQuery, lastPage]);

  const handleJump = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = Number(inputValue);
    if (!Number.isFinite(parsed) || parsed < 1) return;
    const target = Math.floor(parsed);
    startTransition(() => {
      void navigate({
        to: "/gallery",
        search: buildSearch(baseQuery, target),
        replace: true,
      });
    });
  };

  const pageLabel = totalPages
    ? `Page ${page} of ${totalPages}`
    : `Page ${page}`;

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
      <div className="text-xs font-bold uppercase">
        {pageLabel}
        {pending ? " · Loading" : ""}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {hasPrev ? (
          <Link
            to="/gallery"
            search={buildSearch(baseQuery, 1)}
            className="pixel-border bg-white px-3 py-2 text-xs font-bold uppercase text-black hover:-translate-y-0.5 hover:shadow-press transition"
          >
            First
          </Link>
        ) : (
          <span className="pixel-border bg-white/60 px-3 py-2 text-xs font-bold uppercase text-black/50">
            First
          </span>
        )}

        {hasPrev ? (
          <Link
            to="/gallery"
            search={buildSearch(baseQuery, page - 1)}
            className="pixel-border bg-white px-3 py-2 text-xs font-bold uppercase text-black hover:-translate-y-0.5 hover:shadow-press transition"
          >
            Prev
          </Link>
        ) : (
          <span className="pixel-border bg-white/60 px-3 py-2 text-xs font-bold uppercase text-black/50">
            Prev
          </span>
        )}

        {hasNext ? (
          <Link
            to="/gallery"
            search={buildSearch(baseQuery, page + 1)}
            className="pixel-border bg-white px-3 py-2 text-xs font-bold uppercase text-black hover:-translate-y-0.5 hover:shadow-press transition"
          >
            Next
          </Link>
        ) : (
          <span className="pixel-border bg-white/60 px-3 py-2 text-xs font-bold uppercase text-black/50">
            Next
          </span>
        )}

        {lastSearch ? (
          <Link
            to="/gallery"
            search={lastSearch}
            className="pixel-border bg-white px-3 py-2 text-xs font-bold uppercase text-black hover:-translate-y-0.5 hover:shadow-press transition"
          >
            Last
          </Link>
        ) : (
          <span
            className="pixel-border bg-white/60 px-3 py-2 text-xs font-bold uppercase text-black/50"
            title="Last page unknown. Use jump input."
          >
            Last
          </span>
        )}

        <form onSubmit={handleJump} className="flex items-center gap-2">
          <label
            htmlFor="gallery-page-jump"
            className="text-[11px] font-bold uppercase"
          >
            Jump to
          </label>
          <input
            id="gallery-page-jump"
            type="number"
            min={1}
            inputMode="numeric"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            className="pixel-border w-20 bg-white px-2 py-1 text-xs"
          />
          <button
            type="submit"
            className="pixel-border bg-puppet-green px-2 py-1 text-[11px] font-bold uppercase text-black hover:-translate-y-0.5 hover:shadow-press transition"
          >
            Go
          </button>
        </form>
      </div>
    </div>
  );
}
