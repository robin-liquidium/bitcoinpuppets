"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { ORDINAL_SORT_OPTIONS, type OrdinalSort } from "@/lib/ordinals";

const COLLECTIONS = [
  { value: "bitcoin-puppets", label: "Bitcoin Puppets" },
  { value: "opium", label: "OPIUM" },
  { value: "liquidium", label: "Liquidium.WTF Loans" },
] as const;

type GalleryControlsProps = {
  collection: string;
  sortBy: OrdinalSort;
  query?: string;
};

export default function GalleryControls({
  collection,
  sortBy,
  query,
}: GalleryControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [searchInput, setSearchInput] = useState(query ?? "");

  const currentParams = useMemo(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams],
  );

  const updateParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(currentParams.toString());
    params.delete("listed");
    Object.entries(updates).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    params.delete("page");
    startTransition(() => {
      router.replace(`/gallery?${params.toString()}`);
    });
  };

  return (
    <div className="pixel-border bg-white/95 p-4 text-black">
      <div className="window-titlebar mb-4 flex flex-wrap items-center justify-between gap-3 px-3 py-2 text-sm font-bold uppercase">
        <span>Gallery Controls</span>
        {pending ? <span className="text-xs">Loading...</span> : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {COLLECTIONS.map((item) => {
          const active = item.value === collection;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => updateParams({ collection: item.value })}
              className={`pixel-border px-3 py-2 text-xs font-bold uppercase transition hover:-translate-y-0.5 hover:shadow-press ${
                active ? "bg-puppet-pink text-black" : "bg-white text-black"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {collection !== "liquidium" && (
        <div className="mt-4 grid gap-4 md:grid-cols-[1.3fr_1fr]">
          <label className="flex flex-col gap-2 text-xs font-bold uppercase">
            Sort by
            <select
              value={sortBy}
              onChange={(event) =>
                updateParams({ sortBy: event.target.value as OrdinalSort })
              }
              className="pixel-border bg-white px-3 py-2 text-sm font-bold"
            >
              {ORDINAL_SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <form
            className="flex flex-col gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              updateParams({ q: searchInput.trim() || undefined });
            }}
          >
            <label
              htmlFor="gallery-search"
              className="text-xs font-bold uppercase"
            >
              Search (token, inscription, name)
            </label>
            <div className="flex gap-2">
              <input
                id="gallery-search"
                type="text"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                className="pixel-border w-full bg-white px-3 py-2 text-sm"
                placeholder="Bitcoin Puppet #1231"
              />
              <button
                type="submit"
                className="pixel-border bg-puppet-green px-3 py-2 text-xs font-bold uppercase text-black hover:-translate-y-0.5 hover:shadow-press transition"
              >
                Apply
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
