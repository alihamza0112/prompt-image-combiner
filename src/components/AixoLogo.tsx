type Props = { className?: string };

// Minimal "A" mark with an AI-inspired geometric node/orbit accent.
export default function AixoLogo({ className }: Props) {
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="aixo-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      {/* Letter A */}
      <path
        d="M6 25 L15 6 L17 6 L26 25 L22.4 25 L20.4 20.5 L11.6 20.5 L9.6 25 Z M13.1 17.2 L18.9 17.2 L16 10.6 Z"
        fill="url(#aixo-mark)"
      />
      {/* AI node accent */}
      <circle cx="24" cy="8" r="2.2" fill="#ffffff" />
      <circle cx="24" cy="8" r="3.6" fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="0.8" />
    </svg>
  );
}
