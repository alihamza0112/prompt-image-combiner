import { useEffect } from "react";
import { motion } from "framer-motion";
import { Toaster } from "sonner";
import {
  Layers,
  Shield,
  Zap,
  Sparkles,
  Grid3x3,
  Download,
  MousePointerClick,
  Lock,
} from "lucide-react";
import { AdPlaceholder, StickyMobileAd } from "@/components/AdPlaceholder";
import SiteHeader, { SiteFooter } from "@/components/SiteHeader";
import ImageCombinerTool from "@/components/ImageCombinerTool";
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
    icon: Shield,
    title: "100% Private",
    text: "Every image is processed locally in your browser. Nothing is uploaded, stored, or tracked — your files never leave your device.",
  },
  {
    icon: Zap,
    title: "Fast & Free",
    text: "Instant merging with zero waiting. No accounts, no watermarks, no paywalls — AIXO stays free for creators, students, and pros.",
  },
  {
    icon: Sparkles,
    title: "Premium Quality",
    text: "Sharp exports up to ultra resolution, adjustable spacing, borders, rounded corners, and clean grid layouts that look professionally made.",
  },
];

const FEATURES: Card[] = [
  {
    icon: Grid3x3,
    title: "Smart Grid Layouts",
    text: "Auto or fixed 2–5 column grids that balance any number of images beautifully.",
  },
  {
    icon: Download,
    title: "High Quality Export",
    text: "Download as PNG, JPG, or WEBP at standard, high, or ultra resolution.",
  },
  {
    icon: MousePointerClick,
    title: "Drag & Drop",
    text: "Reorder images with a single drag, add labels, and preview changes live.",
  },
  {
    icon: Lock,
    title: "Processed Locally",
    text: "Powered by the Canvas API — private by design, no server, no upload.",
  },
];

const FAQS = [
  {
    q: "What is an AI Image Combiner?",
    a: "An AI Image Combiner merges multiple images into one clean, structured composite — perfect for ChatGPT inputs, research, mood boards, and social media collages. AIXO does it entirely in your browser.",
  },
  {
    q: "Is AIXO really free to use?",
    a: "Yes. AIXO is 100% free with no signup, no watermarks, and no limits on how many images you can merge.",
  },
  {
    q: "Are my images uploaded anywhere?",
    a: "Never. All processing happens locally using the browser's Canvas API. Your images stay on your device the entire time.",
  },
  {
    q: "Which image formats are supported?",
    a: "You can upload PNG, JPG, JPEG, and WEBP files and export to PNG, JPG, or WEBP.",
  },
  {
    q: "Can I combine images on mobile?",
    a: "Absolutely. AIXO is fully responsive and works on modern mobile browsers with touch drag-and-drop.",
  },
  {
    q: "How many images can I merge at once?",
    a: "There's no hard limit — you can combine dozens or hundreds, limited only by your device's memory.",
  },
  {
    q: "Does AIXO work offline?",
    a: "Once the page has loaded, the merging itself works offline because it runs entirely in your browser.",
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
      <section className="relative overflow-hidden pt-12 pb-6 sm:pt-16">
        <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-[380px] w-[380px] rounded-full bg-[oklch(0.7_0.2_265)] opacity-25 blur-3xl animate-float-slow" />
        <div className="pointer-events-none absolute right-[-10%] top-16 h-[420px] w-[420px] rounded-full bg-[oklch(0.72_0.2_305)] opacity-25 blur-3xl animate-float-slower" />
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Layers className="h-3.5 w-3.5 text-[color:var(--brand)]" /> Free · 100% browser-based
          </span>
          <h1 className="mt-5 text-3xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
            Merge images in seconds with <span className="text-gradient-brand">AIXO</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            Drop your images, arrange them, and export one clean merged image — private, fast, no account.
          </p>
        </motion.div>
      </section>

      {/* Ad — below hero */}
      <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <AdPlaceholder size="banner" slotId="home-below-hero" label="Adstera Ad Placement — Below Hero" />
      </div>

      {/* Primary tool */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <ImageCombinerTool />
      </section>

      {/* Ad — between tool and benefits */}
      <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <AdPlaceholder size="banner" slotId="home-post-tool" label="Adstera Ad Placement — Between Tool and Features" />
      </div>

      {/* Why AIXO */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why AIXO"
          title="Why choose AIXO"
          subtitle="A premium micro SaaS toolkit built for creators who value speed, privacy, and quality."
        />
        <div className="mt-10">
          <CardGrid cards={WHY_CARDS} />
        </div>
      </section>

      {/* How it works long form */}
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <LongForm
          eyebrow="Guide"
          title="How image combining works"
          paragraphs={[
            "<strong>Image combining</strong> is the process of merging several separate images into a single organized composite. Instead of sending five screenshots to ChatGPT, uploading ten reference photos to a mood board, or attaching twenty product shots to an email, you can bundle them into one clean image — smaller, easier to share, and far easier to read.",
            "AIXO's <strong>free online Image Combiner</strong> is built for people who work with lots of visuals every day. Students combine lecture screenshots into one study sheet. Designers build reference grids for inspiration. Marketers assemble campaign previews. Freelancers deliver polished before-and-after collages. Researchers stitch charts together for reports. Anyone tired of juggling loose images benefits from a single, structured layout.",
            "The <strong>benefits</strong> go beyond convenience. Combined images upload faster, look more professional, and stay organized when shared over WhatsApp, email, Notion, or social media. They compress better than a folder of separate files and give viewers full context at a glance. For AI workflows in particular, one merged image often produces sharper, more consistent responses from vision models than a scattered batch of uploads.",
            "<strong>Privacy is fundamental.</strong> AIXO processes every image directly in your browser using the built-in Canvas API. Nothing is uploaded to a server, nothing is stored, and nothing is tracked. Whether you're working with personal photos, client assets, or confidential screenshots, your files never leave your device — making AIXO safe to use for freelancers, agencies, and enterprise teams alike.",
            "Common <strong>examples</strong>: turn six product photos into a single catalog tile, merge four dashboard screenshots into one bug report, combine nine outfit shots into a lookbook, or fuse ten travel pictures into a shareable story image. Whatever the use case, AIXO gets you from folder to finished composite in seconds.",
          ]}
        />
      </section>

      {/* Ad — above FAQ */}
      <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <AdPlaceholder size="banner" slotId="home-pre-faq" label="Adstera Ad Placement — Above FAQ" />
      </div>

      {/* FAQ */}
      <FaqSection faqs={FAQS} />

      {/* CTA */}
      <CtaSection
        title="Ready to merge your images?"
        subtitle="Jump into the Image Combiner or explore the AI Prompt Generator — 100% free, no signup."
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

// Also export the FEATURES for reuse if needed
export { FEATURES };
