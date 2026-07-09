import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Toaster } from "sonner";
import { Sparkles, ArrowRight, Images, Mic, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdPlaceholder, StickyMobileAd } from "@/components/AdPlaceholder";
import SiteHeader, { SiteFooter } from "@/components/SiteHeader";
import PromptGenerator from "@/components/PromptGenerator";

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

export default function LandingPage() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  return (
    <div className="relative min-h-screen bg-background pb-[60px] text-foreground antialiased md:pb-0">
      <Toaster position="top-center" richColors theme="dark" />

      <SiteHeader />

      {/* Top banner ad */}
      <div className="border-b border-white/5 bg-white/[0.02] py-3">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AdPlaceholder size="leaderboard" slotId="top-banner" label="Adstera Ad Placement — Top Banner" />
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-12 sm:pt-24">
        <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-[oklch(0.7_0.2_265)] opacity-25 blur-3xl animate-float-slow" />
        <div className="pointer-events-none absolute right-[-10%] top-24 h-[460px] w-[460px] rounded-full bg-[oklch(0.72_0.2_305)] opacity-25 blur-3xl animate-float-slower" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-[color:var(--brand)]" />
              A micro SaaS toolkit · Free · No account
            </div>
            <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              One toolkit. <span className="text-gradient-brand">Every quick AI task.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              AIXO bundles the small AI utilities you use every day — prompt writing, image merging, and voice-to-text — into one fast, private workspace.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tool cards */}
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {TOOLS.map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: "easeOut" }}
              whileHover={{ y: -4 }}
              className="group flex flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 shadow-card backdrop-blur transition-shadow hover:shadow-glow"
            >
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand shadow-glow transition-transform duration-300 group-hover:scale-105">
                <t.icon className="h-5 w-5 text-white transition-transform duration-300 group-hover:rotate-6" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight">{t.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{t.desc}</p>
              <div className="mt-6">
                <Button
                  asChild
                  size="sm"
                  className="bg-gradient-brand text-white shadow-glow transition-all hover:opacity-95 active:scale-[0.97]"
                >
                  <Link to={t.to} hash={t.hash}>
                    {t.cta} <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Ad — above generator */}
      <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <AdPlaceholder size="banner" slotId="pre-generator" label="Adstera Ad Placement — Above Generator" />
      </div>

      {/* Generator */}
      <section id="generator" className="scroll-mt-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">AI Prompt Generator</h2>
            <p className="mt-3 text-muted-foreground">Structured, high-quality prompts in 20+ languages.</p>
          </motion.div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PromptGenerator />
        </div>
      </section>

      {/* Ad — above footer */}
      <div className="mx-auto mt-14 max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdPlaceholder size="leaderboard" slotId="above-footer" label="Adstera Ad Placement — Above Footer" />
      </div>

      <SiteFooter />

      <StickyMobileAd />
    </div>
  );
}
