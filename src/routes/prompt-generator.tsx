import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Toaster } from "sonner";
import { Wand2 } from "lucide-react";
import { AdPlaceholder, StickyMobileAd } from "@/components/AdPlaceholder";
import SiteHeader, { SiteFooter } from "@/components/SiteHeader";
import PromptGenerator from "@/components/PromptGenerator";

export const Route = createFileRoute("/prompt-generator")({
  component: PromptGeneratorPage,
  head: () => ({
    meta: [
      { title: "AI Prompt Generator — Structured Prompts in 20+ Languages | AIXO" },
      {
        name: "description",
        content:
          "Free AI Prompt Generator by AIXO. Create structured, expert-level prompts for ChatGPT, Claude, Gemini, and Midjourney in 20+ languages.",
      },
      { property: "og:title", content: "AI Prompt Generator — AIXO" },
      {
        property: "og:description",
        content: "Structured, high-quality AI prompts in 20+ languages — free and instant.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AI Prompt Generator — AIXO" },
      {
        name: "twitter:description",
        content: "Structured, high-quality AI prompts in 20+ languages.",
      },
    ],
    links: [{ rel: "canonical", href: "/prompt-generator" }],
  }),
});

function PromptGeneratorPage() {
  return (
    <div className="min-h-screen bg-background pb-[60px] text-foreground md:pb-0">
      <Toaster richColors position="top-center" theme="dark" />
      <SiteHeader />

      <section className="relative overflow-hidden pt-12 pb-6 sm:pt-16">
        <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-[380px] w-[380px] rounded-full bg-[oklch(0.7_0.2_265)] opacity-25 blur-3xl animate-float-slow" />
        <div className="pointer-events-none absolute right-[-10%] top-20 h-[420px] w-[420px] rounded-full bg-[oklch(0.72_0.2_305)] opacity-25 blur-3xl animate-float-slower" />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Wand2 className="h-3.5 w-3.5" /> Structured prompts · 20+ languages
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
            <span className="text-gradient-brand">AI Prompt Generator</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground sm:text-lg">
            Craft expert-level prompts for ChatGPT, Claude, Gemini, and Midjourney — instantly.
          </p>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <PromptGenerator />
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <AdPlaceholder size="leaderboard" slotId="pg-above-footer" label="Adstera Ad Placement — Above Footer" />
      </div>

      <SiteFooter />
      <StickyMobileAd />
    </div>
  );
}
