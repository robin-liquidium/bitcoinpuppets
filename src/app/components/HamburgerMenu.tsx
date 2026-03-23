"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { name: "X", href: "https://x.com/BitcoinPuppets" },
  { name: "Telegram", href: "https://t.me/worldpeacegospel" },
  {
    name: "Satflow",
    href: "https://www.satflow.com/ordinals/bitcoin-puppets",
  },
  { name: "Discord", href: "https://discord.gg/bitcoinpuppets" },
  { name: "GitHub", href: "https://github.com/ropl-btc/bitcoinpuppets" },
  {
    name: "Feedback",
    href: "https://github.com/ropl-btc/bitcoinpuppets/issues",
  },
  {
    name: "Liquidium.WTF",
    href: "https://app.liquidium.wtf/borrow/ordinals",
  },
];

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLoans, setActiveLoans] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen && activeLoans === null) {
      fetch("/api/liquidium")
        .then((res) => res.json())
        .then((data) => {
          const result = data as { activeCount?: number };
          if (typeof result.activeCount === "number") {
            setActiveLoans(result.activeCount);
          }
        })
        .catch((err) =>
          console.error("Failed to fetch Liquidium.WTF stats", err),
        );
    }
  }, [isOpen, activeLoans]);

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const handleDown = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".hamburger-container")) {
        setIsOpen(false);
      }
    };
    window.addEventListener("mousedown", handleDown);
    return () => window.removeEventListener("mousedown", handleDown);
  }, [isOpen]);

  // Close menu on escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  return (
    <div className="hamburger-container fixed top-6 right-4 z-[100]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="pixel-border bg-white p-1.5 hover:bg-gray-100 transition-colors shadow-none active:translate-y-0.5"
        aria-label="Menu"
      >
        <div className="w-6 h-5 flex flex-col justify-between p-0.5">
          <span
            className={`block w-full h-1 bg-black transition-all duration-200 ${isOpen ? "rotate-45 translate-y-1.5" : ""}`}
          ></span>
          <span
            className={`block w-full h-1 bg-black transition-all duration-200 ${isOpen ? "opacity-0" : ""}`}
          ></span>
          <span
            className={`block w-full h-1 bg-black transition-all duration-200 ${isOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
          ></span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 pixel-border bg-white overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="window-titlebar px-3 py-1.5 text-xs font-bold uppercase tracking-wider">
            Puppet Menu
          </div>
          <div className="flex flex-col bg-white">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between px-4 py-2.5 text-sm font-bold uppercase text-black hover:bg-black hover:text-white border-b-2 border-black/10 last:border-b-0 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex flex-col">
                  <span>{link.name}</span>
                  {link.name === "Liquidium.WTF" && activeLoans !== null && (
                    <span className="text-[10px] normal-case text-gray-500 group-hover:text-gray-300 font-normal mt-[-2px] leading-tight transition-colors">
                      {activeLoans} Active Puppets Loans
                    </span>
                  )}
                </div>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
