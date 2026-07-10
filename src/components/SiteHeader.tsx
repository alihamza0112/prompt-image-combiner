import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import AixoLogo from "@/components/AixoLogo";

export type NavItem = {
  label: string;
  to: "/" | "/prompt-generator" | "/image-combiner" | "/about" | "/contact";
  exact?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", to: "/", exact: true },
  { label: "Image Combiner", to: "/image-combiner" },
  { label: "AI Prompt Generator", to: "/prompt-generator" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];


export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-40 border-b border-white/5 bg-background/60 backdrop-blur-xl backdrop-saturate-150"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5 group" aria-label="AIXO home">
          <span className="relative block h-10 w-10 animate-logo-float transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-[3deg] rounded-full group-hover:shadow-glow">
            <AixoLogo className="h-10 w-10" />
          </span>
          <span className="animate-fade-in text-lg font-extrabold tracking-tight text-gradient-brand drop-shadow-[0_0_12px_rgba(139,92,246,0.35)] transition-all duration-300 group-hover:drop-shadow-[0_0_18px_rgba(139,92,246,0.6)]">
            AIXO
          </span>
        </Link>


        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              activeOptions={{ exact: !!item.exact }}
              className="relative rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
              activeProps={{ className: "active" }}
            >
              <span className="relative z-10">{item.label}</span>
            </Link>
          ))}
        </nav>


        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 transition-colors hover:bg-white/10 md:hidden"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-white/5 bg-background/90 backdrop-blur-xl md:hidden"
          >
            <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  activeOptions={{ exact: !!item.exact }}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground [&.active]:bg-white/10 [&.active]:text-foreground"
                  activeProps={{ className: "active" }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-white/5 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <AixoLogo className="h-8 w-8" orbit={false} />
          <span className="text-sm font-bold tracking-tight text-gradient-brand">AIXO</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <Link to="/image-combiner" className="hover:text-foreground">Image Combiner</Link>
          <Link to="/prompt-generator" className="hover:text-foreground">Prompt Generator</Link>
          <Link to="/about" className="hover:text-foreground">About</Link>
          <Link to="/contact" className="hover:text-foreground">Contact</Link>
        </div>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} AIXO</p>
      </div>
    </footer>
  );
}
