import { useEffect, useMemo, useState } from "react";
import { DURATIONS, type LiquidiumLoan } from "@/lib/liquidium";

interface LiquidiumGalleryProps {
  loans: LiquidiumLoan[];
  floorPrice?: number | null;
}

function formatSats(sats: number) {
  return new Intl.NumberFormat("en-US").format(sats);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getTimeRemaining(acceptedDate: string, durationDays: number) {
  const expiry =
    new Date(acceptedDate).getTime() + durationDays * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const diff = expiry - now;

  if (diff <= 0) return "Expired";

  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const mins = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));

  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${mins}m left`;
  return `${mins}m left`;
}

const DURATION_COLOR_CLASS: Record<number, string> = {
  5: "bg-puppet-yellow",
  10: "bg-puppet-green",
  16: "bg-puppet-pink",
  30: "bg-puppet-purple",
};

export default function LiquidiumGallery({
  loans,
  floorPrice,
}: LiquidiumGalleryProps) {
  const [durationFilter, setDurationFilter] = useState<number | null>(null);
  type LiquidiumSort = "date" | "amount" | "duration" | "ltv-desc" | "ltv-asc";
  const [sortBy, setSortBy] = useState<LiquidiumSort>("date");

  // Force a re-render to update "time remaining"
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  const filteredAndSortedLoans = useMemo(() => {
    let result = [...loans];

    if (durationFilter) {
      result = result.filter((l) => l.duration === durationFilter);
    }

    result.sort((a, b) => {
      if (sortBy === "date") {
        return (
          new Date(b.accepted_date).getTime() -
          new Date(a.accepted_date).getTime()
        );
      }
      if (sortBy === "amount") {
        return b.principal_amount_sats - a.principal_amount_sats;
      }
      if (sortBy === "duration") {
        return b.duration - a.duration;
      }
      if (sortBy === "ltv-desc") {
        return b.principal_amount_sats - a.principal_amount_sats;
      }
      if (sortBy === "ltv-asc") {
        return a.principal_amount_sats - b.principal_amount_sats;
      }
      return 0;
    });

    return result;
  }, [loans, durationFilter, sortBy]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pixel-border bg-white p-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase">Filter Duration:</span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setDurationFilter(null)}
              className={`pixel-border px-2 py-1 text-[10px] font-bold uppercase transition ${
                !durationFilter
                  ? "bg-black text-white"
                  : "bg-gray-100 text-black hover:bg-gray-200"
              }`}
            >
              All
            </button>
            {DURATIONS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDurationFilter(d)}
                className={`pixel-border px-2 py-1 text-[10px] font-bold uppercase transition ${
                  durationFilter === d
                    ? "bg-black text-white"
                    : "bg-gray-100 text-black hover:bg-gray-200"
                }`}
              >
                {d}D
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as LiquidiumSort)}
            className="pixel-border bg-white px-2 py-1 text-xs font-bold uppercase outline-none"
          >
            <option value="date">Newest First</option>
            <option value="amount">Amount (High to Low)</option>
            <option value="ltv-desc">LTV (High to Low)</option>
            <option value="ltv-asc">LTV (Low to High)</option>
            <option value="duration">Duration (Longest First)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAndSortedLoans.map((loan) => {
          const ltvValue = floorPrice
            ? (loan.principal_amount_sats / floorPrice) * 100
            : null;
          const ltvText = ltvValue ? ltvValue.toFixed(1) : null;
          const timeRemaining = getTimeRemaining(
            loan.accepted_date,
            loan.duration,
          );

          // Color logic: < 90 green, 90-100 orange, 100+ red
          let ltvColor = "#16a34a"; // mid-ground green (green-600)
          if (ltvValue !== null) {
            if (ltvValue >= 100) {
              ltvColor = "#dc2626"; // red (red-600)
            } else if (ltvValue >= 90) {
              ltvColor = "#ea580c"; // orange (orange-600)
            }
          }

          return (
            <div
              key={loan.id}
              className="pixel-border flex flex-col gap-3 bg-white p-4 transition hover:shadow-press"
            >
              <div className="flex items-center justify-between border-b-2 border-black/10 pb-2">
                <span
                  className={`pixel-border px-2 py-0.5 text-[10px] font-bold uppercase text-black ${
                    DURATION_COLOR_CLASS[loan.duration] ?? "bg-puppet-blue"
                  }`}
                >
                  {loan.duration} Day Loan
                </span>
                <span
                  className={`text-xs font-bold uppercase ${timeRemaining === "Expired" ? "text-red-600" : "text-gray-500"}`}
                >
                  {timeRemaining}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold uppercase text-gray-500">
                    Amount
                  </span>
                  <span className="text-lg font-bold text-puppet-purple">
                    {formatSats(loan.principal_amount_sats)} sats
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold uppercase text-gray-500">
                    Accepted
                  </span>
                  <span className="text-xs font-bold">
                    {formatDate(loan.accepted_date)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1 border-t-2 border-black/10 pt-2">
                <div className="flex items-center justify-between text-xs font-bold uppercase">
                  <span className="font-normal text-gray-500">Floor Price</span>
                  <span className="text-black">
                    {floorPrice ? `${formatSats(floorPrice)} sats` : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold uppercase">
                  <span className="font-normal text-gray-500">LTV Ratio</span>
                  <span className="font-bold" style={{ color: ltvColor }}>
                    {ltvText ? `${ltvText}%` : "N/A"}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`https://app.liquidium.wtf/borrow/ordinals`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pixel-border block w-full bg-puppet-blue-light py-2.5 text-center text-xs font-bold uppercase text-black transition hover:bg-white hover:text-black border-2 border-transparent hover:border-black"
                >
                  View on Liquidium.WTF
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAndSortedLoans.length === 0 && (
        <div className="pixel-border p-10 text-center font-bold uppercase text-gray-400 bg-white">
          No active loans found for this duration
        </div>
      )}
    </div>
  );
}
