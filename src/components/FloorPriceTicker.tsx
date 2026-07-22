import { useEffect, useState } from "react";
import { formatSats } from "@/lib/format";

type FloorPrice = {
  floorSats: number;
  listedCount: number;
};

export default function FloorPriceTicker() {
  const [floor, setFloor] = useState<FloorPrice | null>(null);

  useEffect(() => {
    let cancelled = false;
    let requestId = 0;
    let activeController: AbortController | null = null;
    const load = async () => {
      activeController?.abort();
      const controller = new AbortController();
      activeController = controller;
      const currentRequestId = ++requestId;
      try {
        const response = await fetch("/api/floor-price", {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Floor price request failed with ${response.status}`);
        }
        const data = await response.json();
        const floorData = data as FloorPrice | null;
        if (!cancelled && currentRequestId === requestId) {
          setFloor(
            floorData && typeof floorData.floorSats === "number"
              ? floorData
              : null,
          );
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        console.warn("Failed to refresh floor price ticker", error);
        if (!cancelled && currentRequestId === requestId) {
          setFloor(null);
        }
      } finally {
        if (activeController === controller) activeController = null;
      }
    };
    load();
    const interval = window.setInterval(load, 120_000);
    return () => {
      cancelled = true;
      activeController?.abort();
      window.clearInterval(interval);
    };
  }, []);

  if (!floor) return null;

  return (
    <a
      href="https://ord.net/collection/bitcoin-puppets"
      target="_blank"
      rel="noopener noreferrer"
      className="pixel-border absolute left-2 top-1/2 z-10 -translate-y-1/2 rotate-[-1.5deg] bg-hl-yellow px-2 py-1 font-marker text-[11px] uppercase text-black sm:text-xs"
    >
      floor {formatSats(floor.floorSats)} sats
      <span className="hidden sm:inline">
        {" "}
        ({floor.listedCount} listed, ngmi)
      </span>
    </a>
  );
}
