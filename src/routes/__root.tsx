import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import HamburgerMenu from "@/components/HamburgerMenu";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  SOCIAL_IMAGE,
} from "@/lib/site";
import "@/styles/globals.css";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESCRIPTION },
      { property: "og:title", content: SITE_TITLE },
      { property: "og:description", content: SITE_DESCRIPTION },
      { property: "og:url", content: SITE_URL },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "en_US" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: SOCIAL_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SITE_TITLE },
      { name: "twitter:description", content: SITE_DESCRIPTION },
      { name: "twitter:image", content: SOCIAL_IMAGE },
      { name: "robots", content: "index, follow" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Gochi+Hand&family=Permanent+Marker&display=swap",
      },
      { rel: "manifest", href: "/favicons/site.webmanifest" },
      {
        rel: "icon",
        href: "/favicons/favicon.png",
        sizes: "118x118",
        type: "image/png",
        media: "(prefers-color-scheme: light)",
      },
      {
        rel: "icon",
        href: "/favicons/favicon-dark.png",
        sizes: "118x118",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        rel: "icon",
        href: "/favicons/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
        media: "(prefers-color-scheme: light)",
      },
      {
        rel: "icon",
        href: "/favicons/favicon-32x32-dark.png",
        sizes: "32x32",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        rel: "icon",
        href: "/favicons/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
        media: "(prefers-color-scheme: light)",
      },
      {
        rel: "icon",
        href: "/favicons/favicon-16x16-dark.png",
        sizes: "16x16",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        rel: "apple-touch-icon",
        href: "/favicons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  }),
  component: RootDocument,
  notFoundComponent: NotFoundPage,
});

function RootDocument() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="font-comic relative">
        <HamburgerMenu />
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}

function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-4">
      <section className="pixel-border taped rotate-[-1deg] w-full bg-note-yellow/95 p-8 text-black">
        <div className="window-titlebar mb-4 inline-block px-4 py-2">
          404.exe
        </div>
        <h1 className="font-marker text-4xl md:text-5xl">
          <span className="scribble">Puppet</span> not found
        </h1>
        <p className="mt-3 text-sm">
          it probably went to zero. or to world peace. hard to tell.
        </p>
        <Link
          to="/"
          className="pixel-border-alt mt-6 inline-block rotate-[1.5deg] bg-puppet-green px-4 py-2 font-marker text-sm uppercase hover:rotate-0 transition"
        >
          Back home
        </Link>
      </section>
    </main>
  );
}
