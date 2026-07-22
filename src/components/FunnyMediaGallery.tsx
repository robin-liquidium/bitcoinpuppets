import { useEffect, useRef, useState } from "react";

type FunnyMediaGalleryProps = {
  sources: string[];
};

const SKELETON_KEYS = Array.from(
  { length: 10 },
  (_, position) => `placeholder-${position}`,
);

const TILTS = [
  "-rotate-2",
  "rotate-[1.4deg]",
  "-rotate-[0.8deg]",
  "rotate-[2.2deg]",
  "-rotate-[1.6deg]",
  "rotate-[0.7deg]",
  "-rotate-[2.4deg]",
  "rotate-[1.1deg]",
];

const BORDERS = ["pixel-border", "pixel-border-alt", "pixel-border-dash"];
const isFeaturedPosition = (position: number) =>
  position === 0 || position % 9 === 4;

export default function FunnyMediaGallery({ sources }: FunnyMediaGalleryProps) {
  const [selectedSrc, setSelectedSrc] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!selectedSrc) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedSrc(null);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [selectedSrc]);

  useEffect(() => {
    if (isActive) return;
    const element = containerRef.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) {
      setIsActive(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [isActive]);

  return (
    <>
      <div ref={containerRef}>
        {isActive ? (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {sources.map((src, i) => {
              const featured = isFeaturedPosition(i);
              const taped = i % 5 === 2;
              return (
                <button
                  key={src}
                  type="button"
                  onClick={() => setSelectedSrc(src)}
                  className={`${BORDERS[i % BORDERS.length]} ${TILTS[i % TILTS.length]} ${
                    taped ? "taped" : ""
                  } ${
                    featured ? "col-span-2 row-span-2" : ""
                  } bg-white p-2 text-left transition hover:z-20 hover:rotate-0 hover:scale-[1.03]`}
                >
                  <div className="relative aspect-square w-full">
                    <img
                      src={src}
                      alt="Funny puppet media"
                      sizes="(min-width: 1024px) 200px, (min-width: 640px) 160px, 120px"
                      className="h-full w-full object-contain"
                      decoding="async"
                      loading="lazy"
                      fetchPriority="low"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {SKELETON_KEYS.map((key, i) => (
              <div
                key={key}
                className={`${BORDERS[i % BORDERS.length]} ${TILTS[i % TILTS.length]} ${
                  isFeaturedPosition(i) ? "col-span-2 row-span-2" : ""
                } bg-white/80 p-2`}
              >
                <div className="aspect-square w-full bg-black/10" />
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedSrc ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-4 py-8">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            onClick={() => setSelectedSrc(null)}
            aria-label="Close media viewer"
          />
          <div className="pixel-border relative z-10 flex max-h-[90vh] w-full max-w-[92vw] flex-col overflow-y-auto bg-white/95 p-4 text-black">
            <div className="window-titlebar mb-3 flex items-center justify-between px-3 py-2 text-sm font-bold uppercase">
              <span>Funny Pictures and Videos</span>
              <button
                type="button"
                onClick={() => setSelectedSrc(null)}
                className="pixel-border bg-puppet-pink px-2 py-1 text-xs font-bold uppercase text-black hover:-translate-y-0.5 hover:shadow-press transition"
              >
                Close
              </button>
            </div>
            <div className="pixel-border bg-white p-3">
              <div className="relative h-[60vh] max-h-[calc(100vh-14rem)] w-full max-w-[85vw] sm:h-[70vh]">
                <img
                  src={selectedSrc}
                  alt="Funny puppet media enlarged"
                  sizes="85vw"
                  className="h-full w-full object-contain"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
