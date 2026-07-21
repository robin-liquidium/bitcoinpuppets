import Image from "next/image";
import Link from "next/link";
import CommunityChecklist from "./sections/CommunityChecklist";
import CursedInscriptionsSection from "./sections/CursedInscriptionsSection";
import FaqSection from "./sections/FaqSection";
import FunnyMediaSection from "./sections/FunnyMediaSection";
import LicenseSection from "./sections/LicenseSection";
import LoreSection from "./sections/LoreSection";
import ManifestoSection from "./sections/ManifestoSection";
import NoCollabSection from "./sections/NoCollabSection";
import QuickLinksSection from "./sections/QuickLinksSection";
import SiteFooter from "./sections/SiteFooter";
import { OpiumOrigins, PuppetInterview } from "./sections/VideosSection";

type DoodleButtonTone = "blue" | "green" | "pink" | "purple";
type DoodlePanelKind = "hero" | "media";

interface DoodlePanelProps {
  children: React.ReactNode;
  className?: string;
  kind: DoodlePanelKind;
}

interface DoodleButtonProps {
  children: React.ReactNode;
  className?: string;
  href: string;
  tone: DoodleButtonTone;
}

interface DoodleStickerProps {
  alt: string;
  className: string;
  height?: number;
  src: string;
  width?: number;
}

function DoodlePanel({ children, className = "", kind }: DoodlePanelProps) {
  return (
    <section className={`doodle-panel doodle-panel-${kind} ${className}`}>
      {children}
    </section>
  );
}

function DoodleTitlebar({ children }: { children: React.ReactNode }) {
  return <div className="doodle-titlebar">{children}</div>;
}

function DoodleButton({
  children,
  className = "",
  href,
  tone,
}: DoodleButtonProps) {
  const isInternal = href.startsWith("/");
  const sharedClass = `doodle-button doodle-button-${tone} ${className}`;

  if (isInternal) {
    return (
      <Link className={sharedClass} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <a
      className={sharedClass}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
}

function DoodleSticker({
  alt,
  className,
  height = 86,
  src,
  width = 86,
}: DoodleStickerProps) {
  return (
    <span className={`doodle-sticker ${className}`}>
      <Image
        alt={alt}
        className="h-auto w-full"
        draggable={false}
        height={height}
        priority
        src={src}
        width={width}
        unoptimized
      />
    </span>
  );
}

function DoodleHeroContent() {
  return (
    <>
      <DoodleTitlebar>
        <span>Bitcoin Puppets</span>
      </DoodleTitlebar>
      <h1 className="doodle-heading">
        <span className="doodle-bj">
          <span className="doodle-bj-b">B</span>
          <span className="doodle-bj-j">J</span>
        </span>{" "}
        from the puppetverse
      </h1>
      <p className="doodle-copy">
        When you engage with the Puppets, leave behind the shackles of
        conventional thinking and surrender to the enchantment of the
        unconventional. Embrace the whimsy, relish in the absurd, and allow your
        imagination to roam freely. This is the sanctuary for the offbeat.
      </p>
      <div className="doodle-actions">
        <DoodleButton href="/gallery" tone="blue">
          Gallery
        </DoodleButton>
        <DoodleButton href="/santa-generator" tone="green">
          Santa Generator 🎅
        </DoodleButton>
        <DoodleButton href="https://x.com/BitcoinPuppets" tone="pink">
          Twitter
        </DoodleButton>
        <DoodleButton
          href="https://youtu.be/NwKhK9-Jg20?si=nxixY_iMVben8FQv"
          tone="purple"
        >
          World Peace 🌎☮️
        </DoodleButton>
      </div>
    </>
  );
}

function BullaCard() {
  return (
    <DoodlePanel className="doodle-bulla-card" kind="media">
      <DoodleTitlebar>Bulla.webp</DoodleTitlebar>
      <a
        className="doodle-media-link"
        href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        rel="noopener noreferrer"
        target="_blank"
      >
        <Image
          alt="Bitcoin Puppets bulla preview"
          className="doodle-media-image"
          height={300}
          src="/bulla.webp"
          width={390}
          priority
          unoptimized
        />
      </a>
    </DoodlePanel>
  );
}

export default function DoodleHomepage() {
  return (
    <div className="doodle-home">
      <div className="doodle-ticker">
        bj bj bj ✦ WORLD PEACE ONLY ✦ FREE MINT ✦ COMMUNITY-LED ✦ CHAOTIC PIXEL
        ENERGY ✦ WHERE ART TRANSCENDS LIMITS ✦ bj bj bj
      </div>
      <main className="doodle-stage">
        <DoodleSticker
          alt="Ghost doodle"
          className="doodle-sticker-ghost"
          src="/smile.avif"
        />
        <DoodleSticker
          alt="Side puppet"
          className="doodle-sticker-left"
          src="/puppets_heads/head-2.avif"
        />
        <section className="doodle-hero-grid">
          <DoodlePanel className="doodle-hero-panel" kind="hero">
            <DoodleHeroContent />
          </DoodlePanel>
          <BullaCard />
        </section>
        <ManifestoSection />
        <div className="doodle-content-grid">
          <div className="doodle-column">
            <QuickLinksSection />
            <CursedInscriptionsSection />
          </div>
          <div className="doodle-column">
            <OpiumOrigins />
            <PuppetInterview />
            <CommunityChecklist />
          </div>
        </div>
        <FaqSection />
        <FunnyMediaSection />
        <LicenseSection />
        <NoCollabSection />
        <LoreSection />
      </main>
      <SiteFooter />
    </div>
  );
}
