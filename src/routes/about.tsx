import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Toaster } from "sonner";
import {
  Sparkles,
  Target,
  Eye,
  Heart,
  ShieldCheck,
  Rocket,
  Zap,
  Users,
  Lock,
} from "lucide-react";
import SiteHeader, { SiteFooter } from "@/components/SiteHeader";
import { AdPlaceholder, StickyMobileAd } from "@/components/AdPlaceholder";
import {
  CardGrid,
  CtaSection,
  FaqSection,
  SectionHeading,
  TimelineSection,
  type Card,
  type TimelineItem,
} from "@/components/PageSections";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About AIXO — The Story Behind Our Free AI Toolkit" },
      { name: "description", content: "The mission, vision, and privacy commitment behind AIXO — a premium micro SaaS toolkit of fast, free, browser-based AI tools." },
      { property: "og:title", content: "About — AIXO" },
      { property: "og:description", content: "The story, mission, and roadmap behind AIXO." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://prompt-sparkle-ai-37.lovable.app/about" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "About — AIXO" },
    ],
    links: [{ rel: "canonical", href: "https://prompt-sparkle-ai-37.lovable.app/about" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
});

const MISSION_VISION: Card[] = [
  { icon: Target, title: "Mission", text: "Make powerful AI utilities feel as simple as opening a webpage — for everyone." },
  { icon: Eye, title: "Vision", text: "A curated collection of small, sharp tools that respect your attention and time." },
];

const VALUES: Card[] = [
  { icon: Zap, title: "Speed First", text: "Instant loads, instant results. No waiting rooms." },
  { icon: ShieldCheck, title: "Privacy by Default", text: "Client-side processing. Your data never leaves your device." },
  { icon: Heart, title: "Free Forever", text: "No paywalls around the tools you rely on daily." },
  { icon: Users, title: "User-Guided", text: "The roadmap is shaped by real requests, not demos." },
];

const PRIVACY: Card[] = [
  { icon: Lock, title: "Local Processing", text: "Images and prompts are handled in your browser via Canvas API." },
  { icon: ShieldCheck, title: "No Accounts", text: "Nothing to sign up for means nothing to leak." },
  { icon: Eye, title: "No Tracking", text: "No pixels inside tools. No third-party input scraping." },
];

const FUTURE: Card[] = [
  { icon: Sparkles, title: "Background Remover", text: "One-click cutouts for photos and product shots." },
  { icon: Rocket, title: "PDF Toolkit", text: "Merge, split, and compress PDFs — all in your browser." },
  { icon: Target, title: "AI Writer", text: "Lightweight writing assistant tuned for creators." },
];

const TIMELINE: TimelineItem[] = [
  { year: "2025", title: "AIXO is Born", text: "Launched with the AI Image Combiner as the flagship tool." },
  { year: "2025", title: "Prompt Generator", text: "Added structured prompt building in 20+ languages." },
  { year: "2026", title: "Design Refresh", text: "Rebuilt with a premium micro SaaS look and glass UI." },
  { year: "Next", title: "New Tools", text: "Background remover, PDF utility, and AI writer coming soon." },
];

const FAQS = [
  { q: "Who is behind AIXO?", a: "AIXO is designed and maintained by Ali Hamza, an independent developer focused on privacy-first AI utilities." },
  { q: "Is AIXO a company?", a: "It's currently an independently operated micro SaaS project — lean, fast, and reinvesting into new tools." },
  { q: "Will there be paid plans?", a: "The current tools stay free forever. Premium add-ons like cloud sync may arrive later, but never as a paywall." },
  { q: "How does AIXO make money?", a: "Lightweight, non-intrusive display ads via Adstera. That's what keeps the tools genuinely free." },
  { q: "Can I suggest a tool?", a: "Yes — user requests directly shape the roadmap. Use the contact page to send an idea." },
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
            A premium micro SaaS toolkit built to make AI feel effortless.
          </motion.p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <AdPlaceholder size="banner" slotId="about-below-hero" label="Adstera Ad Placement — Below Hero" />
      </div>

      {/* Mission + Vision */}
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Mission & Vision" title="Why AIXO exists" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {MISSION_VISION.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.01] p-7 shadow-card backdrop-blur-xl transition-shadow hover:shadow-glow"
            >
              <div className="pointer-events-none absolute -top-20 -right-16 h-48 w-48 rounded-full bg-gradient-brand opacity-15 blur-3xl transition-opacity duration-500 group-hover:opacity-30" />
              <div className="relative">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand shadow-glow transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                  <c.icon className="h-5 w-5 text-white" />
                </span>
                <h3 className="mt-5 text-xl font-semibold tracking-tight">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Our Values */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Our values" title="Four principles guide every build" />
        <div className="mt-10"><CardGrid cards={VALUES} cols={4} /></div>
      </section>

      {/* Privacy */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Privacy" title="Privacy is the foundation" />
        <div className="mt-10"><CardGrid cards={PRIVACY} /></div>
      </section>

      {/* Future */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Future" title="What's coming next" />
        <div className="mt-10"><CardGrid cards={FUTURE} /></div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Timeline" title="The AIXO journey" />
        <div className="mt-10"><TimelineSection items={TIMELINE} /></div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <AdPlaceholder size="banner" slotId="about-pre-faq" label="Adstera Ad Placement — Above FAQ" />
      </div>

      <FaqSection faqs={FAQS} />

      <CtaSection
        title="Start using AIXO today"
        subtitle="Every tool is free, private, and ready in your browser."
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
