import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { Sparkles, Zap, Shield, Gift, Layers, Wand2, ArrowRight } from "lucide-react";
import { AdPlaceholder, StickyMobileAd } from "@/components/AdPlaceholder";
import SiteHeader, { SiteFooter } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import {
  CardGrid,
  CtaSection,
  FaqSection,
  LongForm,
  SectionHeading,
  type Card,
} from "@/components/PageSections";

const WHY_CARDS: Card[] = [
  {
    icon: Zap,
    title: "Fast",
    text: "Every tool loads in under a second and runs instantly in your browser — no queues, no waiting rooms, no throttled tiers.",
  },
  {
    icon: Shield,
    title: "Private",
    text: "Files and prompts are processed locally where possible. Nothing is uploaded, stored, or tracked in the background.",
  },
  {
    icon: Gift,
    title: "Free",
    text: "Every AIXO tool is 100% free forever. No signup, no watermark, no credit card, no daily limits.",
  },
];

type ToolCard = {
  icon: typeof Layers;
  title: string;
  description: string;
  to: "/image-combiner" | "/prompt-generator";
  cta: string;
};

const TOOLS: ToolCard[] = [
  {
    icon: Layers,
    title: "AI Image Combiner",
    description:
      "Drop unlimited photos, arrange them into a clean grid, and export one polished merged image — all in your browser.",
    to: "/image-combiner",
    cta: "Open Tool",
  },
  {
    icon: Wand2,
    title: "AI Prompt Generator",
    description:
      "Turn rough ideas into structured, expert-level prompts for ChatGPT, Claude, Gemini, and Midjourney in 20+ languages.",
    to: "/prompt-generator",
    cta: "Open Tool",
  },
];

const FAQS = [
  {
    q: "What is AIXO?",
    a: "AIXO is a premium micro SaaS toolkit that packages fast, free, browser-based AI utilities into one clean home — starting with an Image Combiner and an AI Prompt Generator.",
  },
  {
    q: "Do I need to create an account?",
    a: "No. AIXO is 100% account-free. Open a tool page and start using it immediately — no signup, no email verification, no credit card.",
  },
  {
    q: "Which tools are available today?",
    a: "AIXO currently ships with the AI Image Combiner and the AI Prompt Generator. More utilities are on the roadmap and will appear on the home page as they launch.",
  },
  {
    q: "How is AIXO different from other AI websites?",
    a: "AIXO focuses on speed, privacy, and a single cohesive experience. Every tool loads instantly, works offline after first load, and processes your data locally in the browser whenever possible.",
  },
  {
    q: "Is AIXO safe for confidential work?",
    a: "Yes. Because processing happens client-side, your files and prompts never leave your device, making AIXO safe for freelance client work, internal team assets, and personal media.",
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
            Fast, focused AI tools for creators, students, and professionals. No signup, no watermarks, no data harvesting.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="h-12 px-6 bg-gradient-brand text-white shadow-glow transition-all hover:opacity-95 hover:scale-[1.02] active:scale-[0.97]"
            >
              <Link to="/image-combiner">
                Explore the Tools <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-white/15 bg-white/[0.03] px-6 hover:bg-white/[0.06]"
            >
              <Link to="/about">About AIXO</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Ad — below hero */}
      <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <AdPlaceholder size="banner" slotId="home-below-hero" label="Adstera Ad Placement — Below Hero" />
      </div>

      {/* Our AI Tools */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our AI Tools"
          title="A curated toolkit, not a bloated dashboard"
          subtitle="Pick a tool and start working — every utility opens in one click."
        />
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
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t.description}
                </p>
                <Button
                  asChild
                  size="sm"
                  className="mt-6 h-10 px-4 bg-gradient-brand text-white shadow-glow transition-all hover:opacity-95 hover:scale-[1.02]"
                >
                  <Link to={t.to}>
                    {t.cta} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Ad — between sections */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <AdPlaceholder size="banner" slotId="home-mid" label="Adstera Ad Placement — Mid Page" />
      </div>

      {/* Why choose AIXO */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why choose AIXO"
          title="Fast. Private. Free."
          subtitle="Three promises that stay true across every tool in the toolkit."
        />
        <div className="mt-10">
          <CardGrid cards={WHY_CARDS} />
        </div>
      </section>

      {/* How AIXO Helps — long form SEO */}
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <LongForm
          eyebrow="How AIXO helps"
          title="A modern toolkit for modern work"
          paragraphs={[
            "The modern creator's workflow is scattered across a dozen websites. One tab merges screenshots, another cleans up a photo, a third helps rewrite a caption, and a fourth drafts a prompt for ChatGPT. Every tool has its own login, its own quota, and its own quirks — and by the time you switch between them, you've lost the thread of what you were actually trying to make. <strong>AIXO</strong> was built to collapse that mess into one calm, focused home.",
            "The <strong>AI Image Combiner</strong> is perfect for anyone who works with lots of visuals — designers assembling reference boards, students preparing study sheets, marketers building product grids, or freelancers packaging before-and-after shots for clients. Instead of emailing five loose files, you deliver one clean, structured image that's smaller, easier to read, and instantly more professional.",
            "The <strong>AI Prompt Generator</strong> is a shortcut to better AI results. Whether you're briefing ChatGPT for a blog outline, Claude for a code refactor, Midjourney for a hero image, or Gemini for research, a well-structured prompt is the difference between generic output and expert work. AIXO turns a rough idea into a role, context, task, constraints, and output format in seconds — no prompt engineering course required.",
            "What ties everything together is a shared philosophy: <strong>respect the user</strong>. That means no forced signups, no dark patterns, no upsell popups, and no invisible data pipelines mining your inputs. It also means design that feels premium — a modern dark UI, smooth Framer Motion animations, thoughtful spacing, and typography that stays readable on every device from a phone in bright sunlight to a 4K monitor at midnight.",
            "AIXO is growing fast. A background remover, a smart PDF utility, an AI writing assistant, and offline-first versions of today's tools are all on the roadmap. Every new addition will follow the same rules — free, private, browser-based, and instantly usable. Bookmark the home page and check back often; the toolkit you rely on tomorrow is being built here today.",
          ]}
        />
      </section>

      {/* Ad — above CTA */}
      <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <AdPlaceholder size="banner" slotId="home-pre-faq" label="Adstera Ad Placement — Above FAQ" />
      </div>

      <FaqSection faqs={FAQS} />

      <CtaSection
        title="Ready to try the AIXO toolkit?"
        subtitle="Open a tool and start creating — it's free, private, and takes seconds."
        primary={{ label: "Open Image Combiner", to: "/image-combiner" }}
        secondary={{ label: "Try Prompt Generator", to: "/prompt-generator" }}
      />

      {/* Above-footer ad */}
      <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <AdPlaceholder size="leaderboard" slotId="home-above-footer" label="Adstera Ad Placement — Above Footer" />
      </div>

      <SiteFooter />
      <StickyMobileAd />
    </div>
  );
}
