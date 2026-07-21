import type { Sticker } from "./types";

interface StickerItemProps {
  sticker: Sticker;
  onPointerDown: (
    event: React.PointerEvent<HTMLImageElement>,
    sticker: Sticker,
  ) => void;
  onClick: (event: React.MouseEvent, sticker: Sticker) => void;
}

export const StickerItem = ({
  sticker,
  onPointerDown,
  onClick,
}: StickerItemProps) => {
  return (
    <a
      href={sticker.link}
      target={sticker.link ? "_blank" : undefined}
      rel={sticker.link ? "noopener noreferrer" : undefined}
      onClick={(event) => onClick(event, sticker)}
      className="sticker pointer-events-auto select-none"
      style={
        {
          "--x": `${sticker.x}px`,
          "--y": `${sticker.y}px`,
          "--r": `${sticker.rotate}deg`,
          "--size": `${sticker.height}px`,
        } as React.CSSProperties
      }
    >
      <img
        src={sticker.src}
        alt=""
        width={sticker.height}
        height={sticker.height}
        sizes={`${sticker.height}px`}
        onPointerDown={(event) => onPointerDown(event, sticker)}
        className="block h-full w-full object-contain"
        draggable={false}
      />
      {sticker.id === "head-11" && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 pointer-events-none z-10">
          <div className="relative bg-white text-black text-xs font-bold px-2 py-1 rounded border-2 border-black whitespace-nowrap shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            drag me
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-black"></div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-[0.5px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white"></div>
          </div>
        </div>
      )}
      {sticker.id === "head-9" && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 pointer-events-none z-10">
          <div className="relative bg-white text-black text-xs font-bold px-2 py-1 rounded border-2 border-black whitespace-nowrap shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            click me
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-black"></div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-[0.5px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white"></div>
          </div>
        </div>
      )}
    </a>
  );
};
