import { createFileRoute } from "@tanstack/react-router";
import { fetchLiquidiumActiveLoans } from "@/lib/liquidium";

export const Route = createFileRoute("/api/liquidium")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const loans = await fetchLiquidiumActiveLoans();
          return Response.json({ activeCount: loans.length, loans });
        } catch (error) {
          console.error("Error fetching Liquidium.WTF public stats:", error);
          return Response.json({ activeCount: 0, loans: [] });
        }
      },
    },
  },
});
