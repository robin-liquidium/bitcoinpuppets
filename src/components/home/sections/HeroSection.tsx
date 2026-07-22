import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ARROW_CURVE, Doodle } from "@/components/MarginDoodles";
import { useWindowDrag } from "@/components/useWindowDrag";

function DraggableWindow({
  className,
  title,
  hint,
  children,
}: {
  className: string;
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  const { cardRef, handleRef } = useWindowDrag<HTMLDivElement>();

  return (
    <div ref={cardRef} className={`relative ${className}`}>
      <div
        ref={handleRef}
        className="window-titlebar drag-handle mb-5 flex items-center justify-between px-4 py-2"
        title="drag me · double-click to snap back"
      >
        <span>{title}</span>
        {hint ? (
          <span className="font-hand text-xs normal-case tracking-normal opacity-70">
            {hint}
          </span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] relative">
      <Doodle
        caption="click dis"
        path={ARROW_CURVE}
        viewBox="0 0 100 70"
        className="-left-32 bottom-16 -rotate-6"
        captionClassName="rotate-[4deg]"
      />
      <Doodle
        caption="this one bangs"
        path={ARROW_CURVE}
        viewBox="0 0 100 70"
        className="-right-36 top-40 rotate-6"
        captionClassName="rotate-[-5deg]"
        svgClassName="-scale-x-100"
      />
      <DraggableWindow
        className="pixel-border taped rotate-[-0.8deg] bg-note-yellow/95 p-6 md:p-8 text-black"
        title="Bitcoin Puppets"
        hint="(drag me)"
      >
        <h1 className="font-marker text-4xl leading-[1.05] tracking-tight md:text-6xl">
          <span className="rainbow-text inline-block animate-wiggle">BJ</span>{" "}
          from the{" "}
          <span className="highlighter-pink inline-block rotate-[-1.5deg]">
            puppetverse
          </span>
        </h1>
        <p className="mt-5 text-lg leading-relaxed">
          When you engage with the Puppets, leave behind the shackles of
          conventional thinking and surrender to the{" "}
          <span className="scribble font-bold">enchantment</span> of the
          unconventional. Embrace the whimsy, relish in the absurd, and allow
          your imagination to roam freely. This is the{" "}
          <span className="doodle-circle font-marker text-sm">sanctuary</span>{" "}
          for the offbeat.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-4">
          <Link
            to="/gallery"
            className="pixel-border wobble-hover inline-block rotate-[-2deg] bg-puppet-blue-light px-4 py-2 font-marker text-sm uppercase transition hover:-translate-y-0.5 hover:rotate-0"
          >
            Gallery
          </Link>
          <Link
            to="/santa-generator"
            className="pixel-border-alt wobble-hover inline-block rotate-[1.5deg] bg-puppet-green px-4 py-2 font-marker text-sm uppercase transition hover:-translate-y-0.5 hover:rotate-0"
          >
            Santa Generator 🎅
          </Link>
          <Link
            to="/gallery"
            search={{
              collection: "liquidium",
              sortBy: "inscriptionNumberDesc",
            }}
            className="pixel-border-alt wobble-hover inline-block rotate-[1deg] bg-puppet-yellow px-4 py-2 font-marker text-sm uppercase transition hover:-translate-y-0.5 hover:rotate-0"
          >
            Active Loans
          </Link>
          <a
            href="https://x.com/BitcoinPuppets"
            target="_blank"
            rel="noopener noreferrer"
            className="pixel-border wobble-hover inline-block rotate-[-1deg] bg-puppet-pink px-4 py-2 font-marker text-sm uppercase transition hover:-translate-y-0.5 hover:rotate-0"
          >
            Twitter
          </a>
          <a
            href="https://youtu.be/NwKhK9-Jg20?si=nxixY_iMVben8FQv"
            target="_blank"
            rel="noopener noreferrer"
            className="pixel-border-dash wobble-hover inline-block rotate-[2deg] bg-puppet-purple px-4 py-2 font-marker text-sm uppercase transition hover:-translate-y-0.5 hover:rotate-0"
          >
            World Peace 🌎☮️
          </a>
        </div>
      </DraggableWindow>

      <DraggableWindow
        className="pixel-border-alt taped taped-corner rotate-[1.6deg] bg-white/95 p-3 text-black"
        title="Bulla.webp"
        hint="(drag me, do not feed)"
      >
        <div className="bg-white p-3">
          <a
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            target="_blank"
            rel="noopener noreferrer"
            className="block rotate-[-0.6deg] transition hover:rotate-0"
          >
            <img
              src="/bulla.webp"
              alt="Bitcoin Puppets bulla preview"
              width={640}
              height={640}
              loading="eager"
              fetchPriority="high"
              sizes="(max-width: 768px) 100vw, 52vw"
              className="pixel-border h-auto w-full"
            />
          </a>
        </div>
        <p className="px-2 pt-2 text-center font-marker text-xs uppercase tracking-wide text-black/70">
          ↑ click for totally legit secret alpha ↑
        </p>
      </DraggableWindow>
    </section>
  );
}
