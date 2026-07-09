import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";
import {
  Sparkles, Moon, Sun, ArrowRight, Menu, X, Images, Mic, Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdPlaceholder, StickyMobileAd } from "@/components/AdPlaceholder";
import PromptGenerator from "@/components/PromptGenerator";

const NAV_ITEMS = [
  { label: "Home", to: "/" as const, hash: undefined },
  { label: "AI Prompt Generator", to: "/" as const, hash: "generator" },
  { label: "Image Combiner", to: "/image-combiner" as const, hash: undefined },
  { label: "AI Voice to Text", to: "/voice-to-text" as const, hash: undefined },
];

const TOOLS = [
  {
    icon: Wand2,
    title: "AI Prompt Generator",
    desc: "Craft structured, expert-level prompts for ChatGPT, Claude, Gemini, Midjourney and more — in 20+ languages.",
    to: "/" as const,
    hash: "generator",
    cta: "Open Generator",
  },
  {
    icon: Images,
    title: "Image Combiner",
    desc: "Merge unlimited PNG, JPG or WEBP images into one clean layout, right in your browser.",
    to: "/image-combiner" as const,
    hash: undefined,
    cta: "Open Combiner",
  },
  {
    icon: Mic,
    title: "AI Voice to Text",
    desc: "Real-time speech recognition with language selection, copy, and TXT download — all in your browser.",
    to: "/voice-to-text" as const,
    hash: undefined,
    cta: "Open Voice to Text",
  },
];

export default function LandingPage({ dark, setDark }: { dark: boolean; setDark: (v: boolean) => void }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  return (
    <div className="relative min-h-screen bg-background pb-[60px] text-foreground antialiased md:pb-0">
      <Toaster position="top-center" richColors theme={dark ? "dark" : "light"} />

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-brand shadow-glow">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-semibold tracking-tight">ToolNex</span>
          </Link>
          <nav className="hidden items-center gap-7 md:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                hash={item.hash}
                activeOptions={{ exact: true }}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground [&.active]:font-medium [&.active]:text-foreground"
                activeProps={{ className: "active" }}
              >
                {item.label}
              </Link>
            ))}
            <a href="#contact" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Contact</a>
          </nav>
          <div className="flex items-center gap-2">
            <button
              aria-label="Toggle dark mode"
              onClick={() => setDark(!dark)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-border transition-colors hover:bg-accent"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              aria-label="Toggle menu"
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-border transition-colors hover:bg-accent md:hidden"
            >
              {mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileNavOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-xl md:hidden"
            >
              <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    hash={item.hash}
                    onClick={() => setMobileNavOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
                <a
                  href="#contact"
                  onClick={() => setMobileNavOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  Contact
                </a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Top banner ad */}
      <div className="border-b border-border/40 bg-muted/20 py-3">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AdPlaceholder size="leaderboard" slotId="top-banner" label="Adstera Ad Placement — Top Banner" />
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden pt-12 pb-10 sm:pt-16">
        <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-[400px] w-[400px] rounded-full bg-[oklch(0.7_0.2_265)] opacity-40 blur-3xl" />
        <div className="pointer-events-none absolute right-[-10%] top-20 h-[440px] w-[440px] rounded-full bg-[oklch(0.72_0.2_305)] opacity-40 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-[color:var(--brand)]" />
              A micro SaaS toolkit · Free · No account
            </div>
            <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              One toolkit. <span className="text-gradient-brand">Every quick AI task.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              ToolNex bundles the small AI utilities you use every day — prompt writing, image merging, and voice-to-text — into one fast, private workspace.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tool cards */}
      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {TOOLS.map((t) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-card"
            >
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-gradient-brand shadow-glow">
                <t.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight">{t.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{t.desc}</p>
              <div className="mt-5">
                <Button asChild size="sm" className="bg-gradient-brand text-white shadow-glow hover:opacity-95">
                  <Link to={t.to} hash={t.hash}>
                    {t.cta} <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Ad — between tool cards and generator */}
      <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <AdPlaceholder size="banner" slotId="pre-generator" label="Adstera Ad Placement — Above Generator" />
      </div>

      {/* Generator */}
      <section id="generator" className="scroll-mt-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">AI Prompt Generator</h2>
          <p className="mt-3 text-muted-foreground">Structured, high-quality prompts in 20+ languages.</p>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PromptGenerator />
        </div>
      </section>

      {/* Ad — above footer */}
      <div className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdPlaceholder size="leaderboard" slotId="above-footer" label="Adstera Ad Placement — Above Footer" />
      </div>

      {/* Footer / Contact */}
      <footer id="contact" className="mt-10 border-t border-border py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-gradient-brand">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold">ToolNex</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="mailto:hello@toolnex.app" className="hover:text-foreground">Contact</a>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} ToolNex. All rights reserved.</p>
        </div>
      </footer>

      <StickyMobileAd />
    </div>
  );
}
