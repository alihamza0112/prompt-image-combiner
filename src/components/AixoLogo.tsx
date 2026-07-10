import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  className?: string;
  /** Show cycling text (A → AI → AIXO) inside the circle. Off for tiny sizes. */
  animatedText?: boolean;
  /** Show orbiting glowing dots around the ring. */
  orbit?: boolean;
};

const CYCLE = ["A", "AI", "AIXO"];

/**
 * AIXO circular mark — glassmorphism disc with a blue→purple gradient,
 * soft glow, animated cycling text inside, and orbiting particles.
 */
export default function AixoLogo({
  className,
  animatedText = true,
  orbit = true,
}: Props) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!animatedText) return;
    const id = setInterval(() => setI((v) => (v + 1) % CYCLE.length), 2200);
    return () => clearInterval(id);
  }, [animatedText]);

  return (
    <span
      className={`relative inline-grid place-items-center ${className ?? ""}`}
      aria-label="AIXO"
    >
      <svg
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="aixo-disc" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3b82f6" />
            <stop offset="1" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id="aixo-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#93c5fd" stopOpacity="0.9" />
            <stop offset="1" stopColor="#c4b5fd" stopOpacity="0.9" />
          </linearGradient>
          <radialGradient id="aixo-glass" cx="35%" cy="30%" r="70%">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="0.55" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <filter id="aixo-blur" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.4" />
          </filter>
        </defs>

        {/* Soft outer glow */}
        <circle cx="32" cy="32" r="28" fill="url(#aixo-disc)" opacity="0.35" filter="url(#aixo-blur)" />
        {/* Gradient disc */}
        <circle cx="32" cy="32" r="26" fill="url(#aixo-disc)" />
        {/* Glass highlight */}
        <circle cx="32" cy="32" r="26" fill="url(#aixo-glass)" />
        {/* Inner rim for depth */}
        <circle cx="32" cy="32" r="25.2" fill="none" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="0.6" />
        {/* Outer animated ring */}
        <circle
          cx="32"
          cy="32"
          r="30"
          fill="none"
          stroke="url(#aixo-ring)"
          strokeOpacity="0.55"
          strokeWidth="0.8"
          strokeDasharray="2 4"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 32 32"
            to="360 32 32"
            dur="18s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Orbiting particles */}
        {orbit && (
          <g>
            <g>
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 32 32"
                to="360 32 32"
                dur="9s"
                repeatCount="indefinite"
              />
              <circle cx="32" cy="2" r="1.4" fill="#e9d5ff" />
              <circle cx="32" cy="2" r="2.8" fill="#a855f7" opacity="0.35" />
            </g>
            <g>
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="120 32 32"
                to="480 32 32"
                dur="13s"
                repeatCount="indefinite"
              />
              <circle cx="32" cy="2" r="1.1" fill="#bfdbfe" />
              <circle cx="32" cy="2" r="2.4" fill="#3b82f6" opacity="0.3" />
            </g>
            <g>
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="240 32 32"
                to="600 32 32"
                dur="16s"
                repeatCount="indefinite"
              />
              <circle cx="32" cy="2" r="0.9" fill="#ffffff" opacity="0.85" />
            </g>
          </g>
        )}
      </svg>

      {/* Cycling text inside disc */}
      {animatedText && (
        <span className="relative z-10 flex items-center justify-center leading-none">
          <AnimatePresence mode="wait">
            <motion.span
              key={CYCLE[i]}
              initial={{ opacity: 0, y: 6, filter: "blur(3px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6, filter: "blur(3px)" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="font-bold tracking-tight text-white"
              style={{
                fontSize: "0.55em",
                textShadow: "0 1px 6px rgba(0,0,0,0.35)",
              }}
            >
              {CYCLE[i]}
            </motion.span>
          </AnimatePresence>
        </span>
      )}
    </span>
  );
}
