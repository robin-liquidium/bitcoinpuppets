import type { Sticker } from "./types";

interface DebugOverlayProps {
  stickers: Sticker[];
  isMobile: boolean;
  viewportWidth: number;
  containerLeft: number;
  onDisable: () => void;
}

export const DebugOverlay = ({
  stickers,
  isMobile,
  viewportWidth,
  containerLeft,
  onDisable,
}: DebugOverlayProps) => {
  const copyText = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(text);
      return;
    }
    if (typeof window !== "undefined") {
      window.prompt("Copy sticker coords:", text);
    }
  };

  const formatSticker = (sticker: Sticker) => {
    const x = Math.round(sticker.x);
    const y = Math.round(sticker.y);
    if (isMobile) {
      if (x < 150) {
        return `{ id: "${sticker.id}", mobileLeft: ${x}, mobileY: ${y} }`;
      }
      const mobileRight = Math.round(
        viewportWidth - containerLeft - sticker.height - sticker.x,
      );
      return `{ id: "${sticker.id}", mobileRight: ${mobileRight}, mobileY: ${y} }`;
    }
    return `{ id: "${sticker.id}", x: ${x}, y: ${y} }`;
  };

  const handleCopySticker = (sticker: Sticker) => {
    copyText(formatSticker(sticker));
  };

  const handleCopyAll = () => {
    const lines = stickers
      .map((sticker) => `\t${formatSticker(sticker)},`)
      .join("\n");
    copyText(lines);
  };

  return (
    <div className="pointer-events-auto fixed bottom-4 right-4 z-[999] max-w-[90vw] bg-[#f7f0d2] text-[11px] text-black pixel-border">
      <div className="flex items-center justify-between gap-2 border-b-2 border-black px-2 py-1">
        <span className="font-bold">
          Sticker coords ({isMobile ? "Mobile" : "Desktop"})
        </span>
        <button type="button" className="px-1 text-[10px]" onClick={onDisable}>
          Disable
        </button>
      </div>
      <div className="flex flex-col gap-1 px-2 py-2">
        <button
          type="button"
          className="px-2 py-1 text-[10px] font-bold text-black border-2 border-black bg-white hover:bg-gray-100"
          onClick={handleCopyAll}
        >
          Copy all {isMobile ? "mobile" : "desktop"} coords
        </button>
        <div className="max-h-64 overflow-auto pr-1">
          {stickers.map((sticker) => (
            <div
              key={sticker.id}
              className="flex items-center justify-between gap-2 py-0.5"
            >
              <span className="min-w-[72px]">{sticker.id}</span>
              <span className="tabular-nums">
                {Math.round(sticker.x)}, {Math.round(sticker.y)}
              </span>
              <button
                type="button"
                className="px-1 text-[10px] underline"
                onClick={() => handleCopySticker(sticker)}
              >
                Copy
              </button>
            </div>
          ))}
        </div>
        <div className="text-[9px] opacity-70">
          Tip: add ?stickersDebug=1 to keep this on.
        </div>
      </div>
    </div>
  );
};
