type Props = { className?: string };

// Premium "A" mark with blue→purple gradient, node accent, and orbit ring.
export default function AixoLogo({ className }: Props) {
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="aixo-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="1" stopColor="#e9ecff" stopOpacity="0.92" />
        </linearGradient>
        <linearGradient id="aixo-node" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#93c5fd" />
          <stop offset="1" stopColor="#c4b5fd" />
        </linearGradient>
        <filter id="aixo-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="0.8" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Letter A */}
      <g filter="url(#aixo-glow)">
        <path
          d="M6 25.5 L15 5.5 L17 5.5 L26 25.5 L22.4 25.5 L20.6 21 L11.4 21 L9.6 25.5 Z M12.9 17.8 L19.1 17.8 L16 10.4 Z"
          fill="url(#aixo-a)"
        />
      </g>

      {/* Orbit ring + node */}
      <circle cx="24.5" cy="7.5" r="4.2" fill="none" stroke="url(#aixo-node)" strokeOpacity="0.7" strokeWidth="0.9" />
      <circle cx="24.5" cy="7.5" r="2.1" fill="url(#aixo-node)" />
    </svg>
  );
}
