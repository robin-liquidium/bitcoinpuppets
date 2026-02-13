"use client";

import { useState } from "react";
import { cursedInscriptions } from "../data";

export default function CursedInscriptionsSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const initialCount = 10;
  const displayItems = isExpanded
    ? cursedInscriptions
    : cursedInscriptions.slice(0, initialCount);

  return (
    <div className="pixel-border bg-white/90 p-6 text-black">
      <div className="window-titlebar mb-4 px-3 py-2 text-sm font-bold uppercase">
        Cursed Inscriptions.txt
      </div>

      {/* Mobile view: Accordion */}
      <div className="lg:hidden">
        <details className="pixel-border bg-white px-4 py-3">
          <summary className="cursor-pointer text-sm font-bold uppercase outline-none">
            Here be da list of cursed ordinal puppets
          </summary>
          <div className="mt-4 flex flex-wrap gap-2">
            {cursedInscriptions.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="pixel-border bg-white px-3 py-2 text-xs font-bold uppercase text-black hover:-translate-y-0.5 hover:shadow-press transition"
              >
                {item.label}
              </a>
            ))}
          </div>
        </details>
      </div>

      {/* Desktop view: Expandable list */}
      <div className="hidden lg:block">
        <p className="text-sm font-bold uppercase mb-4">
          Here be da list of cursed ordinal puppets:
        </p>
        <div className="flex flex-wrap gap-2">
          {displayItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="pixel-border bg-white px-3 py-2 text-xs font-bold uppercase text-black hover:-translate-y-0.5 hover:shadow-press transition"
            >
              {item.label}
            </a>
          ))}
          {!isExpanded && cursedInscriptions.length > initialCount && (
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="pixel-border bg-white px-3 py-2 text-xs font-bold uppercase text-black hover:-translate-y-0.5 hover:shadow-press transition cursor-pointer"
            >
              More...
            </button>
          )}
          {isExpanded && (
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="pixel-border bg-white px-3 py-2 text-xs font-bold uppercase text-black hover:-translate-y-0.5 hover:shadow-press transition cursor-pointer"
            >
              Less...
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
