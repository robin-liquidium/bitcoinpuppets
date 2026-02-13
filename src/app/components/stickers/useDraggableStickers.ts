import { useCallback, useEffect, useRef, useState } from "react";
import { initialStickers } from "./data";
import type { Sticker } from "./types";
import {
  buildResponsiveStickers,
  clampStickerX,
  getIsMobileViewport,
} from "./utils";

export const useDraggableStickers = () => {
  const [stickers, setStickers] = useState<Sticker[]>(initialStickers);
  const [debugEnabled, setDebugEnabled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [containerLeft, setContainerLeft] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const stickersRef = useRef<Sticker[]>(initialStickers);
  const bruhAudioRef = useRef<HTMLAudioElement | null>(null);
  const dragIndexRef = useRef<number | null>(null);
  const activeElementRef = useRef<HTMLAnchorElement | null>(null);
  const offsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const movedRef = useRef(false);
  const pendingPosRef = useRef<{ x: number; y: number } | null>(null);
  const latestPosRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number | null>(null);
  const viewportWidthRef = useRef<number>(0);
  const containerLeftRef = useRef<number>(0);
  const hasDraggedRef = useRef(false);

  // Sync stickersRef
  useEffect(() => {
    stickersRef.current = stickers;
  }, [stickers]);

  // Audio setup
  useEffect(() => {
    bruhAudioRef.current = new Audio("/sfx/bruh.mp3");
    return () => {
      bruhAudioRef.current = null;
    };
  }, []);

  // Debug params
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const debugParam = params.get("stickersDebug");
    if (debugParam === "1" || debugParam === "true") {
      window.localStorage.setItem("stickersDebug", "1");
      setDebugEnabled(true);
      return;
    }
    if (debugParam === "0" || debugParam === "false") {
      window.localStorage.removeItem("stickersDebug");
      setDebugEnabled(false);
      return;
    }
    if (window.localStorage.getItem("stickersDebug") === "1") {
      setDebugEnabled(true);
    }
  }, []);

  const applyPositionToElement = useCallback(
    (element: HTMLAnchorElement, x: number, y: number) => {
      element.style.setProperty("--x", `${x}px`);
      element.style.setProperty("--y", `${y}px`);
    },
    [],
  );

  const onPointerMove = useCallback(
    (event: PointerEvent) => {
      const index = dragIndexRef.current;
      const activeElement = activeElementRef.current;
      if (index === null || !activeElement) return;

      const viewportWidth =
        viewportWidthRef.current || document.documentElement.clientWidth;
      const containerLeft = containerLeftRef.current;
      const sticker = stickersRef.current[index] ?? null;
      if (!sticker) return;

      const nextX = clampStickerX(
        event.pageX - containerLeft - offsetRef.current.x,
        sticker.height,
        viewportWidth,
        containerLeft,
      );
      const nextY = event.pageY - offsetRef.current.y;

      if (
        Math.abs(event.pageX - startPosRef.current.x) > 4 ||
        Math.abs(event.pageY - startPosRef.current.y) > 4
      ) {
        movedRef.current = true;
      }

      pendingPosRef.current = { x: nextX, y: nextY };
      if (rafRef.current !== null) return;

      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        const pending = pendingPosRef.current;
        if (!pending) return;
        latestPosRef.current = pending;
        applyPositionToElement(activeElement, pending.x, pending.y);
      });
    },
    [applyPositionToElement],
  );

  const onPointerUp = useCallback(() => {
    const index = dragIndexRef.current;
    const latest = latestPosRef.current;

    if (index !== null && latest) {
      if (movedRef.current) {
        hasDraggedRef.current = true;
      }
      setStickers((prev) => {
        if (!prev[index]) return prev;
        const next = [...prev];
        next[index] = { ...next[index], x: latest.x, y: latest.y };
        return next;
      });
    }

    dragIndexRef.current = null;
    activeElementRef.current = null;
    pendingPosRef.current = null;
    latestPosRef.current = null;
  }, []);

  // Event listeners
  useEffect(() => {
    const updateViewport = () => {
      viewportWidthRef.current = document.documentElement.clientWidth;
      setViewportWidth(viewportWidthRef.current);
      const isMobileNow = getIsMobileViewport();
      setIsMobile(isMobileNow);

      const containerLeftNow =
        containerRef.current?.getBoundingClientRect().left ?? 0;
      containerLeftRef.current = containerLeftNow;
      setContainerLeft(containerLeftNow);

      setStickers((prev) =>
        (hasDraggedRef.current
          ? prev
          : buildResponsiveStickers(
              prev,
              isMobileNow,
              viewportWidthRef.current,
              containerLeftNow,
            )
        ).map((sticker) => ({
          ...sticker,
          x: clampStickerX(
            sticker.x,
            sticker.height,
            viewportWidthRef.current,
            containerLeftNow,
          ),
        })),
      );
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    return () => {
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [onPointerMove, onPointerUp]);

  const handlePointerDown = (
    event: React.PointerEvent<HTMLImageElement>,
    sticker: Sticker,
  ) => {
    event.preventDefault();
    const element = event.currentTarget.closest("a");
    if (!(element instanceof HTMLAnchorElement)) return;

    const index = stickersRef.current.findIndex(
      (item) => item.id === sticker.id,
    );

    dragIndexRef.current = index >= 0 ? index : null;
    activeElementRef.current = element;
    movedRef.current = false;
    startPosRef.current = { x: event.pageX, y: event.pageY };

    const currentSticker = stickersRef.current[index] ?? sticker;
    const containerLeft = containerLeftRef.current;

    offsetRef.current = {
      x: event.pageX - containerLeft - currentSticker.x,
      y: event.pageY - currentSticker.y,
    };

    latestPosRef.current = { x: currentSticker.x, y: currentSticker.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleClick = (event: React.MouseEvent, sticker: Sticker) => {
    if (movedRef.current) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (sticker.id !== "head-12") {
      const audio = bruhAudioRef.current;
      if (audio) {
        audio.currentTime = 0;
        void audio.play().catch(() => {});
      }
    }
  };

  const handleDisableDebug = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("stickersDebug");
    }
    setDebugEnabled(false);
  };

  return {
    stickers,
    debugEnabled,
    isMobile,
    viewportWidth,
    containerLeft,
    containerRef,
    handlePointerDown,
    handleClick,
    handleDisableDebug,
  };
};
