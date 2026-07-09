import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import AixoLogo from "@/components/AixoLogo";

export type NavItem = {
  label: string;
  to: "/" | "/image-combiner" | "/voice-to-text" | "/contact";
  hash?: string;
  exact?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", to: "/", exact: true },
  { label: "AI Prompt Generator", to: "/", hash: "generator" },
  { label: "Image Combiner", to: "/image-combiner" },
  { label: "AI Voice to Text", to: "/voice-to-text" },
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
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-brand animate-logo-float animate-logo-glow transition-transform duration-500 group-hover:rotate-6">
            <AixoLogo className="h-5 w-5" />
          </span>
          <span className="text-base font-semibold tracking-tight">AIXO</span>
        </Link>


        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              hash={item.hash}
              activeOptions={{ exact: !!item.exact }}
              className="relative rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
              activeProps={{ className: "active" }}
            >
              <span className="relative z-10">{item.label}</span>
            </Link>
          ))}
          <Link
            to="/"
            hash="contact"
            className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Contact
          </Link>
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
                  hash={item.hash}
                  activeOptions={{ exact: !!item.exact }}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground [&.active]:bg-white/10 [&.active]:text-foreground"
                  activeProps={{ className: "active" }}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/"
                hash="contact"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
              >
                Contact
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export function SiteFooter() {
  return (
    <footer id="contact" className="mt-16 border-t border-white/5 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-brand">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </span>
          <span className="text-sm font-semibold">AIXO</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <Link to="/image-combiner" className="hover:text-foreground">Image Combiner</Link>
          <Link to="/voice-to-text" className="hover:text-foreground">Voice to Text</Link>
          <a href="mailto:hello@aixo.app" className="hover:text-foreground">Contact</a>
        </div>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} AIXO</p>
      </div>
    </footer>
  );
}
