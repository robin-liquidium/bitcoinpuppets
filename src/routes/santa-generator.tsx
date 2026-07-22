import { createFileRoute, Link } from "@tanstack/react-router";
import SantaGeneratorForm from "@/features/santa-generator/SantaGeneratorForm";
import { SITE_URL } from "@/lib/site";

const description =
  "Upload a Bitcoin Puppet and slap on the official Santa hat with the latest image model.";

export const Route = createFileRoute("/santa-generator")({
  head: () => ({
    meta: [
      { title: "Santa Hat Generator — Bitcoin Puppets" },
      { name: "description", content: description },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/santa-generator` }],
  }),
  component: SantaGeneratorPage,
});

function SantaGeneratorPage() {
  return (
    <div className="min-h-screen pb-16">
      <div className="marquee-strip">
        <div className="marquee marquee-inner px-2 py-1.5">
          <span className="text-sm md:text-base tracking-wide">
            bj bj bj ✦ santa hat generator ✦ keep it square ✦ world peace ✦ bj
            bj bj
          </span>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 pt-10 sm:px-6">
        <section className="pixel-border taped rotate-[-0.6deg] bg-note-pink/95 p-6 text-black">
          <div className="window-titlebar mb-4 inline-block px-4 py-2">
            Santa Mode
          </div>
          <h1 className="font-marker text-3xl tracking-tight md:text-5xl">
            Bitcoin Puppet{" "}
            <span className="highlighter inline-block rotate-[-1.5deg]">
              Santa Hat
            </span>{" "}
            Generator
          </h1>
          <p className="mt-3 text-lg leading-relaxed">
            BJ. <br />
            Le Fou&apos;s last gift to the puppets was the Santa hat. <br />
            Upload your puppet and give yours the Christmas spirit.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/"
              className="pixel-border rotate-[-1.5deg] bg-puppet-blue px-3 py-2 font-marker text-sm uppercase inline-block hover:-translate-y-0.5 hover:rotate-0 transition"
            >
              Back Home
            </Link>
            <Link
              to="/gallery"
              className="pixel-border-alt rotate-[1.2deg] bg-puppet-pink px-3 py-2 font-marker text-sm uppercase inline-block hover:-translate-y-0.5 hover:rotate-0 transition"
            >
              Gallery
            </Link>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <SantaGeneratorForm />

          <aside className="pixel-border-alt taped taped-corner rotate-[1.4deg] bg-note-yellow/95 p-5 text-black">
            <div className="window-titlebar mb-4 inline-block px-4 py-2">
              Hat Reference
            </div>
            <div className="bg-black p-3 pixel-border rotate-[-0.8deg]">
              <img
                src="/assets/puppets-santa-hat.webp"
                alt="Bitcoin Puppets Santa hat reference"
                width={512}
                height={512}
                className="h-auto w-full"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
