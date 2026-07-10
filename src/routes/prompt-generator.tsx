import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Toaster } from "sonner";
import {
  Wand2,
  Youtube,
  Search,
  Megaphone,
  Code2,
  PenLine,
  Image as ImageIcon,
  Mail,
  Target,
  Layers,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { AdPlaceholder, StickyMobileAd } from "@/components/AdPlaceholder";
import SiteHeader, { SiteFooter } from "@/components/SiteHeader";
import PromptGenerator from "@/components/PromptGenerator";
import {
  CardGrid,
  CtaSection,
  FaqSection,
  SectionHeading,
  type Card,
} from "@/components/PageSections";

export const Route = createFileRoute("/prompt-generator")({
  component: PromptGeneratorPage,
  head: () => ({
    meta: [
      { title: "AI Prompt Generator — Free ChatGPT Prompt Builder | AIXO" },
      { name: "description", content: "Free AI Prompt Generator by AIXO. Build structured, expert-level prompts for ChatGPT, Claude, Gemini, and Midjourney in 20+ languages." },
      { property: "og:title", content: "AI Prompt Generator — AIXO" },
      { property: "og:description", content: "Structured, high-quality AI prompts in 20+ languages — free and instant." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://prompt-sparkle-ai-37.lovable.app/prompt-generator" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AI Prompt Generator — AIXO" },
      { name: "twitter:description", content: "Structured, high-quality AI prompts in 20+ languages." },
    ],
    links: [{ rel: "canonical", href: "https://prompt-sparkle-ai-37.lovable.app/prompt-generator" }],
  }),
});

const BEST_FOR: Card[] = [
  { icon: Youtube, title: "YouTube", text: "Titles, hooks, scripts, and thumbnail concepts that convert." },
  { icon: Search, title: "SEO", text: "Meta titles, outlines, and on-page content that ranks." },
  { icon: Megaphone, title: "Marketing", text: "Ads, emails, and social captions with a consistent voice." },
  { icon: Code2, title: "Coding", text: "Bug fixes, refactors, tests, and architecture reviews." },
];

const POPULAR_TYPES: Card[] = [
  { icon: PenLine, title: "Blog & Article", text: "Long-form outlines, intros, and full article drafts." },
  { icon: ImageIcon, title: "Image Prompts", text: "Midjourney, DALL·E, and Stable Diffusion prompts." },
  { icon: Mail, title: "Email Copy", text: "Cold outreach, newsletters, and product announcements." },
  { icon: MessageSquare, title: "Social Posts", text: "Threads, captions, and short-form hooks that stop scrolls." },
  { icon: Code2, title: "Code Prompts", text: "Contextual dev tasks with clear constraints and formats." },
  { icon: Sparkles, title: "Creative", text: "Story ideas, character briefs, and worldbuilding prompts." },
];

const PROMPT_TIPS: Card[] = [
  { icon: Target, title: "Be Specific", text: "Swap vague adjectives for concrete numbers, audiences, and formats." },
  { icon: Layers, title: "Add Structure", text: "Give a role, context, task, constraints, and output format." },
  { icon: Sparkles, title: "Iterate Fast", text: "Treat the first output as a draft — refine with follow-ups." },
];

const FEATURES: Card[] = [
  { icon: Wand2, title: "20+ Languages", text: "Generate prompts in English, Spanish, Urdu, Chinese, and more." },
  { icon: Layers, title: "Structured Output", text: "Role, context, task, constraints, and format — every time." },
  { icon: Sparkles, title: "Any AI Model", text: "Works with ChatGPT, Claude, Gemini, Grok, and image models." },
  { icon: Target, title: "One-Click Copy", text: "Copy the polished prompt and paste it anywhere." },
];

const FAQS = [
  { q: "What is an AI Prompt Generator?", a: "A tool that turns a rough idea into a structured prompt any modern AI model can execute reliably." },
  { q: "Is it free?", a: "Yes — 100% free, no signup, no daily limits, no watermark." },
  { q: "Which models does it support?", a: "Any modern LLM (ChatGPT, Claude, Gemini, Grok) plus image models like Midjourney, DALL·E, and Stable Diffusion." },
  { q: "Which languages are supported?", a: "20+ output languages including English, Spanish, French, German, Arabic, Hindi, Urdu, Chinese, and Japanese." },
  { q: "What makes a good prompt?", a: "A clear role, specific context, exact task, constraints, and a defined output format." },
  { q: "Are prompts stored on a server?", a: "No — generation happens in your browser session, nothing is stored." },
  { q: "Can I use prompts commercially?", a: "Yes. You own what you create with AIXO and can use it in any project." },
];

function PromptGeneratorPage() {
  return (
    <div className="min-h-screen bg-background pb-[60px] text-foreground md:pb-0">
      <Toaster richColors position="top-center" theme="dark" />
      <SiteHeader />

      {/* Hero */}
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
            <Wand2 className="h-3.5 w-3.5" /> Structured · 20+ languages
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
            <span className="text-gradient-brand">AI Prompt Generator</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground sm:text-lg">
            Turn rough ideas into expert-level prompts — instantly.
          </p>
        </motion.div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <AdPlaceholder size="banner" slotId="pg-below-hero" label="Adstera Ad Placement — Below Hero" />
      </div>

      {/* Tool */}
      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <PromptGenerator />
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <AdPlaceholder size="banner" slotId="pg-post-tool" label="Adstera Ad Placement — Between Tool and Features" />
      </div>

      {/* Best For */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Best for" title="Who uses AIXO prompts" />
        <div className="mt-10"><CardGrid cards={BEST_FOR} cols={4} /></div>
      </section>

      {/* Popular Prompt Types */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Popular types" title="Prompts for every workflow" />
        <div className="mt-10"><CardGrid cards={POPULAR_TYPES} /></div>
      </section>

      {/* Prompt Tips */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Prompt tips" title="Three rules for better output" />
        <div className="mt-10"><CardGrid cards={PROMPT_TIPS} /></div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Features" title="Everything you need built-in" />
        <div className="mt-10"><CardGrid cards={FEATURES} cols={4} /></div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <AdPlaceholder size="banner" slotId="pg-pre-faq" label="Adstera Ad Placement — Above FAQ" />
      </div>

      <FaqSection faqs={FAQS} />

      <CtaSection
        title="Generate your next prompt in seconds"
        subtitle="Free, instant, and works with every major AI model."
        primary={{ label: "Try the Prompt Generator", to: "/prompt-generator" }}
        secondary={{ label: "Explore Image Combiner", to: "/image-combiner" }}
      />

      <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <AdPlaceholder size="leaderboard" slotId="pg-above-footer" label="Adstera Ad Placement — Above Footer" />
      </div>

      <SiteFooter />
      <StickyMobileAd />
    </div>
  );
}
