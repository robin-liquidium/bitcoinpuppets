import { ClientOnly } from "@tanstack/react-router";

function HitCounter() {
  const count = 4200 + (Math.floor(Date.now() / 86_400_000) % 2800);
  const digits = String(count).padStart(7, "0").split("");

  return (
    <div className="pixel-border rotate-[1deg] bg-ink px-3 py-2 text-center">
      <div className="font-marker text-[10px] uppercase tracking-widest text-hl-yellow">
        Visitor #
      </div>
      <div className="mt-1 flex justify-center gap-0.5">
        {digits.map((digit, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: static digit display
            key={i}
            className="bg-black px-1 font-mono text-sm font-bold text-lime-400"
          >
            {digit}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function SiteFooter() {
  return (
    <footer className="mx-auto mt-16 flex w-full max-w-6xl flex-col gap-4 px-4 text-sm sm:px-6">
      <div className="pixel-border rotate-[-0.6deg] window-titlebar px-4 py-3">
        Website created with 🌍☮️ by Robin, CEO of Liquidium (
        <a
          href="https://x.com/robin_liquidium"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          @robin_liquidium
        </a>
        )
      </div>
      <div className="pixel-border-dash rotate-[0.5deg] bg-note-yellow/90 px-4 py-3 text-xs font-bold uppercase text-black">
        <span className="mr-2">Links:</span>
        <a
          href="https://x.com/BitcoinPuppets"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          X
        </a>
        <span className="mx-2">•</span>
        <a
          href="https://t.me/worldpeacegospel"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Telegram
        </a>
        <span className="mx-2">•</span>
        <a
          href="https://www.satflow.com/ordinals/bitcoin-puppets"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Satflow
        </a>
        <span className="mx-2">•</span>
        <a
          href="https://ord.net/collection/bitcoin-puppets"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          ord.net
        </a>
        <span className="mx-2">•</span>
        <a
          href="https://discord.gg/bitcoinpuppets"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Discord
        </a>
        <span className="mx-2">•</span>
        <a
          href="https://github.com/robin-liquidium/bitcoinpuppets"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          GitHub
        </a>
      </div>
      <div className="pixel-border-alt rotate-[-0.4deg] bg-note-pink/90 px-4 py-3 text-xs font-bold uppercase text-black">
        <a
          href="https://github.com/robin-liquidium/bitcoinpuppets/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Submit Feedback, Bugs, and Ideas
        </a>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
        <ClientOnly>
          <HitCounter />
        </ClientOnly>

        <div className="pixel-border animate-wiggle rotate-[-2deg] bg-hl-orange px-3 py-2 font-marker text-[11px] uppercase text-black">
          🚧 under construction (forever) 🚧
        </div>

        <div className="pixel-border-dash rotate-[0.8deg] bg-note-green/90 px-3 py-2 text-[11px] font-bold uppercase text-black">
          <span className="mr-1 font-marker">Puppet webring:</span>
          <a
            href="https://ordpuppetinuundoxxedmillionaires.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            ← prev chaos
          </a>
          <span className="mx-1">•</span>
          <a
            href="https://memedepot.com/d/btcpuppets"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            random
          </a>
          <span className="mx-1">•</span>
          <a
            href="https://www.satflow.com/ordinals/bitcoin-puppets"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            next chaos →
          </a>
        </div>
      </div>

      <div className="text-center text-xs text-black/70">
        This is a community-led hub. Not financial advice. Just vibes. Best
        viewed in Netscape Navigator 4.0 at 800×600. Made with notepad.exe and
        zero adult supervision.
      </div>
    </footer>
  );
}
