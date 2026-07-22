import { useEffect, useMemo, useState } from "react";
import type { OrdinalToken } from "@/lib/ordinals";

type GalleryGridProps = {
  tokens: OrdinalToken[];
  collectionLabel: string;
};

function formatNumber(value?: number) {
  if (value === undefined || value === null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-US").format(value);
}

function isVideo(contentType: string) {
  return contentType.startsWith("video/");
}

function isImage(contentType: string) {
  return contentType.startsWith("image/");
}

export default function GalleryGrid({
  tokens,
  collectionLabel,
}: GalleryGridProps) {
  const [selected, setSelected] = useState<OrdinalToken | null>(null);

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelected(null);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  const gridContent = useMemo(
    () =>
      tokens.map((token) => {
        const title =
          token.displayName || `Inscription #${token.inscriptionNumber}`;
        return (
          <button
            key={token.id}
            type="button"
            onClick={() => setSelected(token)}
            className="pixel-border bg-white p-2 text-left hover:-translate-y-0.5 hover:shadow-press transition"
          >
            <div className="relative aspect-square w-full overflow-hidden bg-black">
              {isImage(token.contentType) ? (
                <img
                  src={token.contentURI}
                  alt={title}
                  loading="lazy"
                  decoding="async"
                  sizes="(min-width: 1024px) 200px, (min-width: 640px) 160px, 120px"
                  className="h-full w-full object-contain"
                />
              ) : isVideo(token.contentType) ? (
                <video
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-contain"
                  src={token.contentURI}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-white">
                  {token.contentType}
                </div>
              )}
            </div>
            <div className="mt-2 text-xs font-bold uppercase text-black">
              {title}
            </div>
            <div className="mt-1 text-[11px] text-black">
              <span className="mr-2">#{token.inscriptionNumber}</span>
              {token.listed && typeof token.listedPrice === "number" ? (
                <span className="font-bold text-puppet-purple">
                  {formatNumber(token.listedPrice)} sats
                </span>
              ) : (
                <span className="text-gray-600">Not listed</span>
              )}
            </div>
          </button>
        );
      }),
    [tokens],
  );

  return (
    <>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {gridContent}
      </div>

      {selected ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-4 py-8">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            onClick={() => setSelected(null)}
            aria-label="Close gallery item details"
          />
          <div className="pixel-border relative z-10 flex max-h-[90vh] w-full max-w-[92vw] flex-col overflow-y-auto bg-white/95 p-4 text-black sm:max-w-[640px]">
            <div className="window-titlebar mb-3 flex items-center justify-between px-3 py-2 text-sm font-bold uppercase">
              <span>
                {collectionLabel} —{" "}
                {selected.displayName || `#${selected.inscriptionNumber}`}
              </span>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="pixel-border bg-puppet-pink px-2 py-1 text-xs font-bold uppercase text-black hover:-translate-y-0.5 hover:shadow-press transition"
              >
                Close
              </button>
            </div>
            <div className="pixel-border bg-white p-3">
              <div className="relative aspect-square w-full max-w-[640px] max-h-[calc(100vh-16rem)] mx-auto">
                {isImage(selected.contentType) ? (
                  <img
                    src={selected.contentURI}
                    alt={
                      selected.displayName ||
                      `Inscription #${selected.inscriptionNumber}`
                    }
                    sizes="(min-width: 1024px) 42vw, (min-width: 640px) 60vw, 70vw"
                    className="h-full w-full object-contain"
                  />
                ) : isVideo(selected.contentType) ? (
                  <video
                    controls
                    className="h-full w-full object-contain"
                    src={selected.contentURI}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm">
                    {selected.contentType}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs uppercase">
              <div className="pixel-border bg-white px-3 py-2">
                Inscription #{selected.inscriptionNumber}
              </div>
              {selected.listed && typeof selected.listedPrice === "number" ? (
                <div className="pixel-border bg-puppet-yellow px-3 py-2 font-bold">
                  Listed {formatNumber(selected.listedPrice)} sats
                </div>
              ) : null}
              <a
                href={`https://www.satflow.com/ordinal/${selected.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="pixel-border bg-puppet-purple px-3 py-2 text-xs font-bold uppercase text-black hover:-translate-y-0.5 hover:shadow-press transition"
              >
                View on Satflow
              </a>
              <a
                href={`https://ord.net/inscription/${selected.inscriptionNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="pixel-border bg-puppet-pink px-3 py-2 text-xs font-bold uppercase text-black hover:-translate-y-0.5 hover:shadow-press transition"
              >
                View on ord.net
              </a>
              <a
                href={`https://ordinals.com/inscription/${selected.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="pixel-border bg-puppet-green px-3 py-2 text-xs font-bold uppercase text-black hover:-translate-y-0.5 hover:shadow-press transition"
              >
                View on Ordinals.com
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
