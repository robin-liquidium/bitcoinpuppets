import { createFileRoute } from "@tanstack/react-router";
import { fetchOrdNetListings } from "@/lib/ordnet";

export const Route = createFileRoute("/api/floor-price")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const { floorSats, listedCount } = await fetchOrdNetListings();
          if (floorSats === null) throw new Error("No listings data");
          return Response.json(
            { floorSats, listedCount },
            { headers: { "Cache-Control": "public, max-age=120" } },
          );
        } catch (error) {
          console.error("Error fetching ord.net floor:", error);
          return Response.json({ error: "floor unavailable" }, { status: 502 });
        }
      },
    },
  },
});
