import {
  STICKER_MARGIN,
  STICKER_MAX_SCALE,
  STICKER_MOBILE_BREAKPOINT,
} from "./constants";
import type { Sticker } from "./types";

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const clampStickerX = (
  x: number,
  height: number,
  viewportWidth: number,
  containerLeft: number,
) => {
  const effectiveSize = height * STICKER_MAX_SCALE;
  const minX = STICKER_MARGIN - containerLeft;
  const maxX = Math.max(
    minX,
    viewportWidth - effectiveSize - STICKER_MARGIN - containerLeft,
  );
  return clamp(x, minX, maxX);
};

export const getIsMobileViewport = () => {
  if (typeof window === "undefined") return false;
  const viewportWidth = Math.min(
    window.innerWidth || 0, // Fallback to 0 if undefined
    document.documentElement.clientWidth || 0,
  );
  return viewportWidth <= STICKER_MOBILE_BREAKPOINT;
};

export const buildResponsiveStickers = (
  stickers: Sticker[],
  mobile: boolean,
  viewportWidth: number,
  containerLeft: number,
) =>
  stickers.map((sticker) => {
    if (!mobile) {
      return sticker;
    }
    const x =
      sticker.mobileLeft != null
        ? sticker.mobileLeft
        : sticker.mobileRight != null
          ? viewportWidth - containerLeft - sticker.height - sticker.mobileRight
          : sticker.x;
    const y = sticker.mobileY != null ? sticker.mobileY : sticker.y;
    return {
      ...sticker,
      x,
      y,
    };
  });
