import { createFileRoute } from "@tanstack/react-router";
import ClientOnlyStickers from "@/components/ClientOnlyStickers";
import {
  CommunityChecklist,
  CursedInscriptionsSection,
  FaqSection,
  FunnyMediaSection,
  HeroSection,
  LicenseSection,
  LoreSection,
  ManifestoSection,
  NoCollabSection,
  OpiumOrigins,
  PuppetInterview,
  QuickLinksSection,
  SiteFooter,
} from "@/components/home";
import { SITE_DESCRIPTION, SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Community Hub — Bitcoin Puppets" },
      { name: "description", content: SITE_DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen pb-20">
      <div className="window-titlebar marquee border-b-4 border-black">
        <span className="text-sm md:text-base font-bold tracking-wide">
          bj bj bj ✦ WORLD PEACE ONLY ✦ FREE MINT ✦ COMMUNITY-LED ✦ CHAOTIC
          PIXEL ENERGY ✦ WHERE ART TRANSCENDS LIMITS ✦ bj bj bj
        </span>
      </div>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pt-10 sm:px-6 relative">
        <img
          src="/smile.avif"
          alt="Bitcoin Puppets favicon"
          width={96}
          height={96}
          loading="eager"
          fetchPriority="high"
          className="pointer-events-none absolute -left-2 top-4 h-24 w-auto rotate-[-8deg] z-[60]"
        />
        <HeroSection />
        <ClientOnlyStickers />
        <ManifestoSection />

        <div className="content-auto">
          <div className="grid gap-4 lg:grid-cols-2 items-start">
            <div className="flex flex-col gap-4">
              <QuickLinksSection />
              <CursedInscriptionsSection />
            </div>
            <div className="flex flex-col gap-4">
              <OpiumOrigins />
              <PuppetInterview />
              <CommunityChecklist />
            </div>
          </div>
        </div>

        <div className="content-auto">
          <FaqSection />
        </div>
        <FunnyMediaSection />

        <div className="content-auto">
          <LicenseSection />
        </div>
        <div className="content-auto">
          <NoCollabSection />
        </div>
        <div className="content-auto">
          <LoreSection />
        </div>
      </main>
      <div className="content-auto">
        <SiteFooter />
      </div>
    </div>
  );
}
