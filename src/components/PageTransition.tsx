import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Very small (150–250ms) crossfade between routes.
 * Uses CSS opacity/transform — no framer-motion overhead per navigation.
 * Respects prefers-reduced-motion automatically because CSS handles it.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [visible, setVisible] = useState(true);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setVisible(false);
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <div
      key={pathname}
      className="page-transition"
      data-visible={visible ? "true" : "false"}
    >
      {children}
    </div>
  );
}
