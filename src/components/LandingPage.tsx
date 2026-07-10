import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Toaster } from "sonner";
import {
  Sparkles,
  Zap,
  Shield,
  Gift,
  Layers,
  Wand2,
  ArrowRight,
  Palette,
  GraduationCap,
  Briefcase,
  Megaphone,
  Code2,
  PenLine,
} from "lucide-react";
import { AdPlaceholder, StickyMobileAd } from "@/components/AdPlaceholder";
import SiteHeader, { SiteFooter } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import {
  CardGrid,
  CtaSection,
  FaqSection,
  SectionHeading,
  StepsSection,
  type Card,
  type Step,
} from "@/components/PageSections";

const WHY_CARDS: Card[] = [
  { icon: Zap, title: "Lightning Fast", text: "Every tool loads in under a second. No queues, no throttling." },
  { icon: Shield, title: "Private by Design", text: "Files stay in your browser. Nothing uploaded, nothing tracked." },
  { icon: Gift, title: "Always Free", text: "No signup, no watermark, no credit card, ever." },
];

const TOOLS = [
  {
    icon: Layers,
    title: "AI Image Combiner",
    description: "Merge unlimited images into one clean grid — instantly.",
    to: "/image-combiner" as const,
  },
  {
    icon: Wand2,
    title: "AI Prompt Generator",
    description: "Turn rough ideas into expert prompts for ChatGPT, Claude & Midjourney.",
    to: "/prompt-generator" as const,
  },
];

const STEPS: Step[] = [
  { title: "Pick a Tool", text: "Choose Image Combiner or Prompt Generator from the toolkit." },
  { title: "Do Your Thing", text: "Upload, tweak, or type. Every option is one click away." },
  { title: "Export Instantly", text: "Download or copy your result — no signup, no wait." },
];

const PERFECT_FOR: Card[] = [
  { icon: Palette, title: "Designers", text: "Assemble reference boards and moodgrids in seconds." },
  { icon: GraduationCap, title: "Students", text: "Merge study sheets and craft AI research prompts." },
  { icon: Briefcase, title: "Freelancers", text: "Deliver polished before/after shots to clients fast." },
  { icon: Megaphone, title: "Marketers", text: "Build product grids and generate campaign copy prompts." },
  { icon: Code2, title: "Developers", text: "Prompt AI models for cleaner code, tests, and reviews." },
  { icon: PenLine, title: "Creators", text: "Ship content, thumbnails, and captions without the friction." },
];

const FAQS = [
  { q: "What is AIXO?", a: "A premium micro SaaS toolkit of fast, free, browser-based AI utilities — starting with Image Combiner and Prompt Generator." },
  { q: "Do I need an account?", a: "No. Open a tool and start using it. No signup, no email, no credit card." },
  { q: "Is my data safe?", a: "Yes. Processing happens client-side wherever possible — your files never leave your device." },
  { q: "How is AIXO different?", a: "Speed, privacy, and one cohesive experience. Every tool loads instantly and shares the same clean UI." },
  { q: "Are more tools coming?", a: "Yes. Background remover, PDF utility, and an AI writing assistant are on the roadmap." },
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

      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-10 sm:pt-24">
        <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-[440px] w-[440px] rounded-full bg-[oklch(0.7_0.2_265)] opacity-30 blur-3xl animate-float-slow" />
        <div className="pointer-events-none absolute right-[-10%] top-16 h-[480px] w-[480px] rounded-full bg-[oklch(0.72_0.2_305)] opacity-30 blur-3xl animate-float-slower" />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-[color:var(--brand)]" /> Free · Private · Browser-based
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            A premium AI toolkit — <span className="text-gradient-brand">AIXO</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            Fast, focused AI tools for creators, students, and professionals.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="h-12 px-6 bg-gradient-brand text-white shadow-glow transition-all hover:opacity-95 hover:scale-[1.02] active:scale-[0.97]">
              <Link to="/image-combiner">Explore the Tools <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 border-white/15 bg-white/[0.03] px-6 hover:bg-white/[0.06]">
              <Link to="/about">About AIXO</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <AdPlaceholder size="banner" slotId="home-below-hero" label="Adstera Ad Placement — Below Hero" />
      </div>

      {/* Tool cards */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Our AI Tools" title="A curated toolkit" subtitle="Pick a tool and start working — one click, zero friction." />
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {TOOLS.map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.01] p-7 shadow-card backdrop-blur-xl transition-shadow hover:shadow-glow"
            >
              <div className="pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full bg-gradient-brand opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-40" />
              <div className="relative">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand shadow-glow transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                  <t.icon className="h-5 w-5 text-white" />
                </span>
                <h3 className="mt-5 text-xl font-semibold tracking-tight">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.description}</p>
                <Button asChild size="sm" className="mt-6 h-10 px-4 bg-gradient-brand text-white shadow-glow transition-all hover:opacity-95 hover:scale-[1.02]">
                  <Link to={t.to}>Open Tool <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <AdPlaceholder size="banner" slotId="home-mid" label="Adstera Ad Placement — Mid Page" />
      </div>

      {/* Why choose */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Why choose AIXO" title="Fast. Private. Free." />
        <div className="mt-10"><CardGrid cards={WHY_CARDS} /></div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="How it works" title="Three steps. That's it." />
        <div className="mt-10"><StepsSection steps={STEPS} /></div>
      </section>

      {/* Perfect For */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Perfect for" title="Built for how you actually work" />
        <div className="mt-10"><CardGrid cards={PERFECT_FOR} /></div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <AdPlaceholder size="banner" slotId="home-pre-faq" label="Adstera Ad Placement — Above FAQ" />
      </div>

      <FaqSection faqs={FAQS} />

      <CtaSection
        title="Ready to try the AIXO toolkit?"
        subtitle="Open a tool and start creating — free, private, seconds."
        primary={{ label: "Open Image Combiner", to: "/image-combiner" }}
        secondary={{ label: "Try Prompt Generator", to: "/prompt-generator" }}
      />

      <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <AdPlaceholder size="leaderboard" slotId="home-above-footer" label="Adstera Ad Placement — Above Footer" />
      </div>

      <SiteFooter />
      <StickyMobileAd />
    </div>
  );
}
