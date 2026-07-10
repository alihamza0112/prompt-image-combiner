import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Toaster } from "sonner";
import { Sparkles, Rocket, ShieldCheck, Compass } from "lucide-react";
import SiteHeader, { SiteFooter } from "@/components/SiteHeader";
import { AdPlaceholder, StickyMobileAd } from "@/components/AdPlaceholder";
import {
  CardGrid,
  CtaSection,
  FaqSection,
  LongForm,
  SectionHeading,
  type Card,
} from "@/components/PageSections";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About AIXO — The Story Behind Our Free AI Toolkit" },
      {
        name: "description",
        content:
          "Discover the mission, vision, and privacy commitment behind AIXO — a premium micro SaaS toolkit delivering fast, free, browser-based AI tools for creators worldwide.",
      },
      { property: "og:title", content: "About — AIXO" },
      {
        property: "og:description",
        content:
          "The story, mission, and roadmap behind AIXO — free, private, browser-based AI tools.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://prompt-sparkle-ai-37.lovable.app/about" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "About — AIXO" },
    ],
    links: [{ rel: "canonical", href: "https://prompt-sparkle-ai-37.lovable.app/about" }],
  }),
});

const PILLARS: Card[] = [
  {
    icon: Rocket,
    title: "Built for Speed",
    text: "Every AIXO tool loads in under a second and runs instantly in your browser — no queues, no waiting rooms, no throttled free tiers.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy by Default",
    text: "Your files, prompts, and inputs are processed locally whenever possible. Nothing is stored, tracked, or shared with third parties.",
  },
  {
    icon: Compass,
    title: "Guided by Users",
    text: "Every new tool on the AIXO roadmap comes from real user requests. We build what people actually need, not what looks good in a demo.",
  },
];

const FAQS = [
  {
    q: "Who is behind AIXO?",
    a: "AIXO is designed and maintained by Ali Hamza, an independent developer focused on shipping fast, useful, privacy-first AI utilities for the open web.",
  },
  {
    q: "Is AIXO a company or a solo project?",
    a: "AIXO is currently an independently operated micro SaaS project. It runs lean, moves fast, and reinvests ad revenue into new tools and infrastructure.",
  },
  {
    q: "Will AIXO ever add paid plans?",
    a: "The current toolkit will always stay free. If premium features arrive later — like cloud sync or team spaces — they'll be optional add-ons, never a paywall around today's tools.",
  },
  {
    q: "How does AIXO make money?",
    a: "AIXO is supported by lightweight, non-intrusive display ads through Adstera. That model keeps every tool genuinely free and lets us skip accounts entirely.",
  },
  {
    q: "Can I suggest a new tool?",
    a: "Absolutely — user requests directly shape the roadmap. Use the contact page to share your idea and it will be reviewed for the next release cycle.",
  },
  {
    q: "Where can I follow updates?",
    a: "New tools and improvements ship regularly. Check back on the homepage or reach out via contact to be notified when something new goes live.",
  },
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-background pb-[60px] text-foreground md:pb-0">
      <Toaster richColors position="top-center" theme="dark" />
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-8 sm:pt-24">
        <div className="pointer-events-none absolute left-[-15%] top-[-10%] h-[460px] w-[460px] rounded-full bg-[oklch(0.7_0.2_265)] opacity-30 blur-3xl animate-float-slow" />
        <div className="pointer-events-none absolute right-[-15%] top-10 h-[500px] w-[500px] rounded-full bg-[oklch(0.72_0.2_305)] opacity-30 blur-3xl animate-float-slower" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-[color:var(--brand)]" /> Our story
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mt-5 text-5xl font-bold tracking-tight sm:text-6xl"
          >
            About <span className="text-gradient-brand">AIXO</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg"
          >
            A premium micro SaaS toolkit built to make powerful AI utilities feel effortless — for everyone, everywhere.
          </motion.p>
        </div>
      </section>

      {/* Ad — below hero */}
      <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <AdPlaceholder size="banner" slotId="about-below-hero" label="Adstera Ad Placement — Below Hero" />
      </div>

      {/* Pillars */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="What we stand for"
          title="Three pillars behind every tool"
          subtitle="Speed, privacy, and user-guided design shape every decision we make."
        />
        <div className="mt-10">
          <CardGrid cards={PILLARS} />
        </div>
      </section>

      {/* Long form — Mission / What / Why / Vision / Privacy / Roadmap */}
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <LongForm
          eyebrow="The full story"
          title="Our mission, our vision, our promise"
          paragraphs={[
            "<strong>Our Mission.</strong> AIXO exists to make powerful AI utilities feel as simple as opening a webpage. Too many creators, students, and small business owners lose hours every week juggling bloated apps, waiting on server queues, or bumping into paywalls that block basic workflows. Our mission is to remove that friction — to deliver tools that load instantly, work everywhere, and never ask for a credit card just to try them.",
            "<strong>What AIXO Is.</strong> AIXO is a growing collection of premium, browser-based AI tools packaged as a single, cohesive micro SaaS toolkit. Today the suite includes the <strong>AI Image Combiner</strong> — a fast way to merge unlimited photos into a single organized grid — and the <strong>AI Prompt Generator</strong> — a structured builder that turns rough ideas into expert-level prompts for ChatGPT, Claude, Gemini, and Midjourney. Every tool shares the same modern dark UI, smooth animations, and privacy-first architecture, so once you learn one you already know the rest.",
            "<strong>Why We Built It.</strong> The AI ecosystem is exploding, but most of the day-to-day utilities creators actually need are locked inside expensive subscriptions or scattered across a dozen half-broken websites. We wanted a single, trustworthy home where a freelancer could combine client screenshots, a teacher could prepare a lesson prompt, and a marketer could draft a campaign brief — all in the same afternoon, without accounts or downloads. AIXO started as a personal toolkit and grew into a public one because the need was universal.",
            "<strong>Our Vision.</strong> We believe the next decade of the web will be shaped by lightweight, focused tools that respect the user's attention. Instead of one giant AI dashboard trying to do everything, AIXO will remain a curated collection of small, sharp utilities — each one solving a real problem beautifully. Long term we want AIXO to be the first place people open when they think, \"there has to be a faster way to do this.\"",
            "<strong>Privacy Commitment.</strong> Privacy is not a feature we bolt on — it's the foundation. Wherever technically possible, AIXO processes your data directly in the browser using the Canvas API and other client-side technologies. Your images, prompts, and files never touch our servers unless you explicitly send them. There are no tracking pixels inside the tools, no third-party analytics scraping your inputs, and no accounts to breach because we never ask you to create one. What happens in your browser stays in your browser.",
            "<strong>Future Roadmap.</strong> The roadmap ahead is ambitious and community-driven. Planned releases include a background remover, a smart PDF splitter and merger, a text-to-image mockup generator, a lightweight AI writing assistant, and offline-capable versions of the current tools for use on planes, trains, and unreliable connections. We're also expanding multilingual support so every tool works fluently in 20+ languages. Every item on the roadmap comes from real user feedback — if you have a request, the contact page is the fastest way to get your idea in front of us.",
          ]}
        />
      </section>

      {/* Ad — above FAQ */}
      <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <AdPlaceholder size="banner" slotId="about-pre-faq" label="Adstera Ad Placement — Above FAQ" />
      </div>

      <FaqSection faqs={FAQS} />

      <CtaSection
        title="Start using AIXO today"
        subtitle="Jump into the toolkit — every tool is free, private, and ready in your browser."
        primary={{ label: "Open Image Combiner", to: "/image-combiner" }}
        secondary={{ label: "Try Prompt Generator", to: "/prompt-generator" }}
      />

      <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <AdPlaceholder size="leaderboard" slotId="about-above-footer" label="Adstera Ad Placement — Above Footer" />
      </div>

      <SiteFooter />
      <StickyMobileAd />
    </div>
  );
}
