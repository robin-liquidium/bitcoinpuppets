export default function SiteFooter() {
  return (
    <footer className="mx-auto mt-16 flex w-full max-w-6xl flex-col gap-4 px-4 text-sm sm:px-6">
      <div className="pixel-border window-titlebar px-4 py-3 text-white">
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
      <div className="pixel-border bg-white/90 px-4 py-3 text-xs font-bold uppercase text-black">
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
          href="https://discord.gg/bitcoinpuppets"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Discord
        </a>
        <span className="mx-2">•</span>
        <a
          href="https://github.com/ropl-btc/bitcoinpuppets"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          GitHub
        </a>
      </div>
      <div className="pixel-border bg-white/90 px-4 py-3 text-xs font-bold uppercase text-black">
        <a
          href="https://github.com/ropl-btc/bitcoinpuppets/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Submit Feedback, Bugs, and Ideas
        </a>
      </div>
      <div className="text-xs text-black/70">
        This is a community-led hub. Not financial advice. Just vibes.
      </div>
    </footer>
  );
}
