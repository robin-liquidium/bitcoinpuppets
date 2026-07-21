import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () =>
        new Response(
          `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\nHost: ${SITE_URL}\n`,
          { headers: { "Content-Type": "text/plain; charset=utf-8" } },
        ),
    },
  },
});
