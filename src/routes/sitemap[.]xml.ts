import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/site";

const pages = [
  { path: "/", changeFrequency: "weekly", priority: "1.0" },
  { path: "/gallery", changeFrequency: "daily", priority: "0.8" },
  {
    path: "/santa-generator",
    changeFrequency: "weekly",
    priority: "0.7",
  },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls = pages
          .map(
            ({ path, changeFrequency, priority }) => `  <url>
    <loc>${new URL(path, SITE_URL).href}</loc>
    <changefreq>${changeFrequency}</changefreq>
    <priority>${priority}</priority>
  </url>`,
          )
          .join("\n");

        return new Response(
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
          { headers: { "Content-Type": "application/xml; charset=utf-8" } },
        );
      },
    },
  },
});
