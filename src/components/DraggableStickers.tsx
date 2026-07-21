import { DebugOverlay } from "./stickers/DebugOverlay";
import { StickerItem } from "./stickers/StickerItem";
import { useDraggableStickers } from "./stickers/useDraggableStickers";

export default function DraggableStickers() {
  const {
    stickers,
    debugEnabled,
    isMobile,
    viewportWidth,
    containerLeft,
    containerRef,
    handlePointerDown,
    handleClick,
    handleDisableDebug,
  } = useDraggableStickers();

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none">
      {stickers.map((sticker) => (
        <StickerItem
          key={sticker.id}
          sticker={sticker}
          onPointerDown={handlePointerDown}
          onClick={handleClick}
        />
      ))}
      {debugEnabled && (
        <DebugOverlay
          stickers={stickers}
          isMobile={isMobile}
          viewportWidth={viewportWidth}
          containerLeft={containerLeft}
          onDisable={handleDisableDebug}
        />
      )}
    </div>
  );
}
