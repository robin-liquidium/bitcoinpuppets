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
      <div className="window-titlebar marquee border-b-4 border-black">
        <span className="text-sm md:text-base font-bold tracking-wide">
          bj bj bj ✦ santa hat generator ✦ keep it square ✦ world peace ✦ bj bj
          bj
        </span>
      </div>

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 pt-10 sm:px-6">
        <section className="pixel-border bg-white/90 p-6 text-black">
          <div className="window-titlebar mb-4 flex items-center justify-between px-3 py-2">
            <span className="text-sm font-bold uppercase">Santa Mode</span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight md:text-4xl">
            Bitcoin Puppet Santa Hat Generator
          </h1>
          <p className="mt-3 text-lg leading-relaxed">
            BJ. <br />
            Le Fou&apos;s last gift to the puppets was the Santa hat. <br />
            Upload your puppet and give yours the Christmas spirit.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/"
              className="pixel-border bg-puppet-blue px-3 py-2 text-sm font-bold uppercase inline-block hover:-translate-y-0.5 hover:shadow-press transition"
            >
              Back Home
            </Link>
            <Link
              to="/gallery"
              className="pixel-border bg-puppet-pink px-3 py-2 text-sm font-bold uppercase inline-block hover:-translate-y-0.5 hover:shadow-press transition"
            >
              Gallery
            </Link>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <SantaGeneratorForm />

          <aside className="pixel-border bg-white/90 p-5 text-black">
            <div className="window-titlebar mb-4 flex items-center justify-between px-3 py-2">
              <span className="text-sm font-bold uppercase">Hat Reference</span>
            </div>
            <div className="bg-black p-3 border-4 border-black">
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
