// Purely decorative inline SVG illustrations (all aria-hidden).

type IconProps = { className?: string };

export function Heart({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 21s-7.5-4.6-9.6-9.2C.9 8.5 2.9 4.5 6.6 4.5c2.2 0 3.6 1.2 5.4 3.2 1.8-2 3.2-3.2 5.4-3.2 3.7 0 5.7 4 4.2 7.3C19.5 16.4 12 21 12 21z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Sparkles({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M10 2l1.8 5.2L17 9l-5.2 1.8L10 16l-1.8-5.2L3 9l5.2-1.8z" fill="currentColor" />
      <path d="M18.5 13l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9z" fill="currentColor" />
      <path d="M18 2l.6 1.6 1.6.6-1.6.6L18 6.4l-.6-1.6-1.6-.6 1.6-.6z" fill="currentColor" />
    </svg>
  );
}

export function Paw({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <ellipse cx="12" cy="16" rx="5" ry="4.2" fill="currentColor" />
      <ellipse cx="5.5" cy="10.5" rx="2.2" ry="2.8" fill="currentColor" />
      <ellipse cx="9.5" cy="6.5" rx="2.2" ry="2.8" fill="currentColor" />
      <ellipse cx="14.5" cy="6.5" rx="2.2" ry="2.8" fill="currentColor" />
      <ellipse cx="18.5" cy="10.5" rx="2.2" ry="2.8" fill="currentColor" />
    </svg>
  );
}

export function Smiley({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none">
        <circle cx="50" cy="50" r="24" />
        <path d="M40 56 Q50 66 60 56" />
        <path d="M14 34 L20 38 M10 50 L18 50 M14 66 L20 62" />
        <path d="M86 34 L80 38 M90 50 L82 50 M86 66 L80 62" />
      </g>
      <circle cx="42" cy="45" r="3" fill="currentColor" />
      <circle cx="58" cy="45" r="3" fill="currentColor" />
    </svg>
  );
}

// Small playful "burst" strokes placed beside the title and the button.
export function Burst({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 32" aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <path d="M6 6 L12 10" />
        <path d="M4 16 L13 16" />
        <path d="M6 26 L12 22" />
      </g>
    </svg>
  );
}
