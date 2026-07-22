export const ARROW_CURVE =
  "M8 60 C 20 20, 60 6, 92 16 M 92 16 L 76 10 M 92 16 L 80 28";

export const SCRIBBLE_CIRCLE =
  "M40 6 C 66 2, 82 14, 78 32 C 74 50, 44 60, 22 50 C 2 41, 4 16, 28 9 C 40 5, 52 7, 56 11";

export function Doodle({
  caption,
  path,
  viewBox,
  className,
  captionClassName,
  svgClassName,
}: {
  caption: string;
  path: string;
  viewBox: string;
  className: string;
  captionClassName?: string;
  svgClassName?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute hidden xl:block ${className}`}
      aria-hidden
    >
      <div
        className={`font-marker text-lg text-ink/80 ${captionClassName ?? ""}`}
      >
        {caption}
      </div>
      <svg
        viewBox={viewBox}
        className={`h-20 w-24 text-ink/80 ${svgClassName ?? ""}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        role="presentation"
      >
        <path d={path} />
      </svg>
    </div>
  );
}
