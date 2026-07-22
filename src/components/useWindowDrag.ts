import { type RefObject, useEffect, useRef } from "react";

export const useWindowDrag = <T extends HTMLElement>(): {
  cardRef: RefObject<T | null>;
  handleRef: RefObject<T | null>;
} => {
  const cardRef = useRef<T | null>(null);
  const handleRef = useRef<T | null>(null);

  useEffect(() => {
    const card = cardRef.current;
    const handle = handleRef.current;
    if (!card || !handle) return;

    let dragging = false;
    let activePointerId: number | null = null;
    let startX = 0;
    let startY = 0;
    let baseLeft = 0;
    let baseTop = 0;
    let curX = 0;
    let curY = 0;
    let nextX = 0;
    let nextY = 0;

    const onMove = (event: PointerEvent) => {
      if (!dragging || event.pointerId !== activePointerId) return;
      const vw = document.documentElement.clientWidth;
      const docH = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
      );
      const rect = card.getBoundingClientRect();

      nextX = Math.min(
        Math.max(curX + event.pageX - startX, -baseLeft - rect.width + 80),
        vw - baseLeft - 80,
      );
      nextY = Math.min(
        Math.max(curY + event.pageY - startY, -baseTop),
        docH - baseTop - 40,
      );

      card.style.translate = `${nextX}px ${nextY}px`;
    };

    const onUp = (event: PointerEvent) => {
      if (!dragging || event.pointerId !== activePointerId) return;
      dragging = false;
      activePointerId = null;
      curX = nextX;
      curY = nextY;
      card.style.zIndex = "";
      document.body.style.userSelect = "";
    };

    const onDown = (event: PointerEvent) => {
      if (dragging || !event.isPrimary || event.button !== 0) return;
      dragging = true;
      activePointerId = event.pointerId;
      startX = event.pageX;
      startY = event.pageY;
      nextX = curX;
      nextY = curY;
      const rect = card.getBoundingClientRect();
      baseLeft = rect.left + window.scrollX - curX;
      baseTop = rect.top + window.scrollY - curY;
      card.style.zIndex = "80";
      document.body.style.userSelect = "none";
      event.preventDefault();
    };

    const onDblClick = () => {
      curX = 0;
      curY = 0;
      card.style.translate = "";
      card.style.zIndex = "";
    };

    handle.addEventListener("pointerdown", onDown);
    handle.addEventListener("dblclick", onDblClick);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    return () => {
      handle.removeEventListener("pointerdown", onDown);
      handle.removeEventListener("dblclick", onDblClick);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      activePointerId = null;
      document.body.style.userSelect = "";
    };
  }, []);

  return { cardRef, handleRef };
};
