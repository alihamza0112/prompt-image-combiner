import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";
import {
  Sparkles, Zap, Bot, ClipboardCheck,
  Lock, Moon, Sun, ArrowRight, Check, Menu, X, Images,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { AdPlaceholder, StickyMobileAd } from "@/components/AdPlaceholder";
import PromptGenerator from "@/components/PromptGenerator";


const FEATURES = [
  { icon: Zap, title: "Instant results", desc: "Prompts and merged images generated in under a second." },
  { icon: Bot, title: "Works with any AI", desc: "ChatGPT, Claude, Gemini, Midjourney, Sora, Veo, Flux and more." },
  { icon: Lock, title: "100% private", desc: "Runs entirely in your browser. No accounts, no tracking." },
  { icon: ClipboardCheck, title: "One-click copy", desc: "Copy prompts or download merged images with one tap." },
];

const FAQS = [
  { q: "Is PromptCraft AI free to use?", a: "Yes — every tool on this site is free. No sign-up, no credit card, no hidden limits." },
  { q: "Which AI tools do these prompts work with?", a: "ChatGPT, Claude, Gemini, Midjourney, Sora, Veo, Flux, Stable Diffusion, plus SEO, blogging, coding, resumes, email and social media." },
  { q: "Do you store the prompts or images I create?", a: "No. Everything runs in your browser. Nothing is uploaded, logged, or shared." },
  { q: "How is the Image Combiner different from other tools?", a: "It merges unlimited images locally using the Canvas API — no uploads, no size limits, no watermarks." },
  { q: "Can I use the outputs commercially?", a: "Yes. Prompts and merged images you create are yours to use for client work, marketing and commercial content." },
  { q: "Does it work on mobile?", a: "Yes — both tools are fully responsive and work great on phones, tablets and desktops." },
];

function GradientBlob({ className }: { className?: string }) {
  return <div className={`pointer-events-none absolute rounded-full blur-3xl opacity-60 ${className}`} />;
}

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
          <a href="#top" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-brand shadow-glow">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-semibold tracking-tight">PromptCraft AI</span>
          </a>
          <nav className="hidden items-center gap-7 md:flex">
            <a href="#top" aria-current="page" className="text-sm font-medium text-foreground">Home</a>
            <a href="#generator" className="text-sm text-muted-foreground transition-colors hover:text-foreground">AI Prompt Generator</a>
            <Link to="/image-combiner" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Image Combiner</Link>
            <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Features</a>
            <a href="#faq" className="text-sm text-muted-foreground transition-colors hover:text-foreground">FAQ</a>
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
            <Button asChild size="sm" className="hidden bg-gradient-brand text-white shadow-glow hover:opacity-95 sm:inline-flex">
              <a href="#generator">Try Free</a>
            </Button>
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
                {[
                  { label: "Home", href: "#top" },
                  { label: "AI Prompt Generator", href: "#generator" },
                  { label: "Features", href: "#features" },
                  { label: "FAQ", href: "#faq" },
                  { label: "Contact", href: "#contact" },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    {item.label}
                  </a>
                ))}
                <Link
                  to="/image-combiner"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <Images className="h-4 w-4" /> Image Combiner
                </Link>
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
      <section id="top" className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-20">
        <GradientBlob className="left-[-10%] top-[-10%] h-[420px] w-[420px] bg-[oklch(0.7_0.2_265)] animate-float-slow" />
        <GradientBlob className="right-[-10%] top-20 h-[500px] w-[500px] bg-[oklch(0.72_0.2_305)] animate-float-slower" />

        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-[color:var(--brand)]" />
              Free forever · No account · Two tools, zero friction
            </div>
            <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Better <span className="text-gradient-brand">AI Prompts</span> and merged images — in seconds
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Two free browser tools: an expert-level prompt generator for every major AI, and a lightning-fast image combiner. No uploads, no sign-up.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="bg-gradient-brand text-white shadow-glow hover:opacity-95">
                <a href="#generator">
                  Generate Prompt <ArrowRight className="ml-1.5 h-4 w-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/image-combiner">
                  <Images className="mr-1.5 h-4 w-4" /> Open Image Combiner
                </Link>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[color:var(--brand)]" /> 16 AI categories</div>
              <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[color:var(--brand)]" /> 100% in browser</div>
              <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[color:var(--brand)]" /> Zero tracking</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Below-hero banner ad */}
      <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <AdPlaceholder size="banner" slotId="below-hero" label="Adstera Ad Placement — Below Hero" />
      </div>

      {/* Main content with sidebar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_160px] lg:gap-10">
          {/* Primary column */}
          <div className="min-w-0 space-y-16">
            {/* Ad — between Hero and Generator */}
            <AdPlaceholder size="banner" slotId="pre-generator" label="Adstera Ad Placement — Above Generator" className="pt-2" />

            <section id="generator" className="scroll-mt-24">
              <div className="mx-auto max-w-3xl text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                  <Sparkles className="h-3 w-3 text-[color:var(--brand)]" /> Multilingual AI Prompt Generator
                </div>
                <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Craft expert prompts in any language</h2>
                <p className="mt-3 text-muted-foreground">Structured, high-quality prompts for ChatGPT, Gemini, Claude, Midjourney and more — in 20+ languages.</p>
              </div>
              <PromptGenerator />
            </section>


            {/* Ad — between Generator and Image Combiner */}
            <AdPlaceholder size="banner" slotId="between-tools" label="Adstera Ad Placement — Between Tools" />

            {/* Image Combiner promo */}
            <section id="image-combiner" className="scroll-mt-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-card"
              >
                <div className="grid grid-cols-1 md:grid-cols-[1.15fr_1fr]">
                  <div className="p-8 sm:p-10">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                      <Images className="h-3 w-3 text-[color:var(--brand)]" /> Image Combiner
                    </div>
                    <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                      Merge unlimited images into one
                    </h2>
                    <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                      Drag, drop and combine PNG, JPG or WEBP images right in your browser. No uploads, no watermark, no size limit.
                    </p>
                    <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[color:var(--brand)]" /> Auto or fixed grid layouts</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[color:var(--brand)]" /> Custom spacing, borders, corners</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[color:var(--brand)]" /> Download as PNG, JPG or WEBP</li>
                    </ul>
                    <div className="mt-7">
                      <Button asChild size="lg" className="bg-gradient-brand text-white shadow-glow hover:opacity-95">
                        <Link to="/image-combiner">
                          Open Image Combiner <ArrowRight className="ml-1.5 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <div className="relative hidden bg-gradient-soft p-8 md:block">
                    <div className="grid h-full grid-cols-3 gap-2">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div
                          key={i}
                          className="rounded-lg bg-gradient-brand opacity-90 shadow-glow"
                          style={{ opacity: 0.3 + ((i * 0.09) % 0.7) }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Short Features */}
            <section id="features" className="scroll-mt-24">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Everything you need. Nothing you don't.</h2>
                <p className="mt-3 text-sm text-muted-foreground">Focused tools, no bloat.</p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
                {FEATURES.map((f) => (
                  <div key={f.title} className="rounded-xl border border-border bg-card p-5 shadow-card">
                    <div className="mb-3 grid h-9 w-9 place-items-center rounded-lg bg-gradient-brand shadow-glow">
                      <f.icon className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold">{f.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{f.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="scroll-mt-24">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Frequently asked questions</h2>
              </div>
              <div className="mx-auto mt-8 max-w-3xl">
                <Accordion type="single" collapsible>
                  {FAQS.slice(0, 3).map((f, i) => (
                    <AccordionItem key={i} value={`item-${i}`} className="border-border">
                      <AccordionTrigger className="text-left text-base font-medium hover:no-underline">{f.q}</AccordionTrigger>
                      <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {/* Ad — between FAQ items */}
                <div className="my-6">
                  <AdPlaceholder size="rectangle" slotId="faq-inline" label="Adstera Ad Placement — In-FAQ" />
                </div>

                <Accordion type="single" collapsible>
                  {FAQS.slice(3).map((f, i) => (
                    <AccordionItem key={i + 3} value={`item-${i + 3}`} className="border-border">
                      <AccordionTrigger className="text-left text-base font-medium hover:no-underline">{f.q}</AccordionTrigger>
                      <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </section>

            {/* Ad — above footer */}
            <AdPlaceholder size="leaderboard" slotId="above-footer" label="Adstera Ad Placement — Above Footer" className="pt-2" />
          </div>

          {/* Sidebar ad — desktop only */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <AdPlaceholder size="skyscraper" slotId="sidebar" label="Adstera Ad — Sidebar" />
            </div>
          </aside>
        </div>
      </div>

      {/* Footer */}
      <footer id="contact" className="mt-16 border-t border-border py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-gradient-brand">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold">PromptCraft AI</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">Privacy Policy</a>
            <a href="#" className="hover:text-foreground">Terms &amp; Conditions</a>
            <a href="mailto:hello@promptcraft.ai" className="hover:text-foreground">Contact</a>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} PromptCraft AI. All rights reserved.</p>
        </div>
      </footer>

      {/* Sticky mobile bottom ad */}
      <StickyMobileAd />
    </div>
  );
}
