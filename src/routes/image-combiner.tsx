import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Toaster } from "sonner";
import {
  Layers,
  Infinity as InfinityIcon,
  Download,
  MousePointerClick,
  Lock,
  Upload,
  Sliders,
  Save,
  Presentation,
  BookOpen,
  ShoppingBag,
  Bug,
  Camera,
} from "lucide-react";
import { AdPlaceholder, StickyMobileAd } from "@/components/AdPlaceholder";
import SiteHeader, { SiteFooter } from "@/components/SiteHeader";
import ImageCombinerTool from "@/components/ImageCombinerTool";
import {
  CardGrid,
  ChecklistGrid,
  CtaSection,
  FaqSection,
  SectionHeading,
  StepsSection,
  type Card,
  type Step,
} from "@/components/PageSections";

export const Route = createFileRoute("/image-combiner")({
  component: ImageCombinerPage,
  head: () => ({
    meta: [
      { title: "AI Image Combiner — Merge Unlimited Images into One | AIXO" },
      { name: "description", content: "Free online AI Image Combiner. Merge unlimited PNG, JPG, or WEBP images into one clean grid — private, browser-based, no signup." },
      { property: "og:title", content: "AI Image Combiner — Merge Unlimited Images into One" },
      { property: "og:description", content: "Combine dozens of images into one clean grid — private, fast, browser-only." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://prompt-sparkle-ai-37.lovable.app/image-combiner" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AI Image Combiner — AIXO" },
      { name: "twitter:description", content: "Merge unlimited images into one — private, fast, browser-only." },
    ],
    links: [{ rel: "canonical", href: "https://prompt-sparkle-ai-37.lovable.app/image-combiner" }],
  }),
});

const FEATURES: Card[] = [
  { icon: InfinityIcon, title: "Unlimited Uploads", text: "No caps, no queues — merge as many images as your device can handle." },
  { icon: Download, title: "HD Export", text: "PNG, JPG, or WEBP at standard, high, or ultra resolution." },
  { icon: MousePointerClick, title: "Drag & Drop", text: "Add, reorder, and preview instantly with smooth interactions." },
  { icon: Lock, title: "100% Private", text: "Runs locally via the Canvas API. Zero uploads, zero tracking." },
];

const STEPS: Step[] = [
  { title: "Upload Images", text: "Drop PNG, JPG, or WEBP files — as many as you like." },
  { title: "Arrange & Style", text: "Reorder, tweak grid, spacing, borders, and labels." },
  { title: "Download", text: "Export in one click — the file saves straight to your device." },
];

const BENEFITS = [
  "No watermark",
  "No signup required",
  "Unlimited file count",
  "Works offline after load",
  "Custom grid layouts",
  "Numbered labels",
  "Rounded corners & borders",
  "Mobile-friendly UI",
  "Instant preview",
];

const USE_CASES: Card[] = [
  { icon: Presentation, title: "Presentations", text: "Combine slide screenshots into single reference sheets." },
  { icon: BookOpen, title: "Study Sheets", text: "Merge diagrams, notes, and charts for quick revision." },
  { icon: ShoppingBag, title: "Product Grids", text: "Ship polished product lineups for stores and catalogs." },
  { icon: Bug, title: "Bug Reports", text: "Package before/after screenshots for cleaner tickets." },
  { icon: Camera, title: "Moodboards", text: "Assemble references for design, fashion, or branding." },
  { icon: Upload, title: "Client Delivery", text: "Deliver one clean image instead of five loose files." },
];

const FAQS = [
  { q: "How do I combine images online?", a: "Upload, arrange, pick a layout, then click Download. The merged image is generated instantly in your browser." },
  { q: "Is it really free?", a: "Yes. No account, no watermark, no daily limits." },
  { q: "Are my images uploaded?", a: "No. Everything runs locally in your browser using the Canvas API." },
  { q: "How many images can I merge?", a: "There's no hard limit — dozens or hundreds depending on your device." },
  { q: "Which formats are supported?", a: "Upload PNG, JPG, JPEG, WEBP. Export as PNG, JPG, or WEBP." },
  { q: "Can I customize the grid?", a: "Yes — auto or fixed 2–5 columns, spacing, borders, rounded corners." },
  { q: "Does it work on mobile?", a: "Fully. Touch drag-and-drop is supported on modern mobile browsers." },
  { q: "Can I add numbered labels?", a: "Yes — toggle labels to overlay a numbered badge on each image." },
];

function ImageCombinerPage() {
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
            <Layers className="h-3.5 w-3.5" /> Unlimited · 100% browser-based
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
            <span className="text-gradient-brand">AI Image Combiner</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground sm:text-lg">
            Merge dozens of images into one clean, organized grid — fast and free.
          </p>
        </motion.div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <AdPlaceholder size="banner" slotId="ic-below-hero" label="Adstera Ad Placement — Below Hero" />
      </div>

      {/* Tool */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10">
        <ImageCombinerTool />
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <AdPlaceholder size="banner" slotId="ic-post-tool" label="Adstera Ad Placement — Between Tool and Features" />
      </div>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Features" title="Built for speed and privacy" />
        <div className="mt-10"><CardGrid cards={FEATURES} cols={4} /></div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="How it works" title="Three simple steps" />
        <div className="mt-10"><StepsSection steps={STEPS} /></div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Benefits" title="Everything included, nothing hidden" />
        <div className="mt-10"><ChecklistGrid items={BENEFITS} /></div>
      </section>

      {/* Use cases */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Use cases" title="Loved by creators and pros" />
        <div className="mt-10"><CardGrid cards={USE_CASES} /></div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <AdPlaceholder size="banner" slotId="ic-pre-faq" label="Adstera Ad Placement — Above FAQ" />
      </div>

      <FaqSection faqs={FAQS} />

      <CtaSection
        title="Merge your first image grid now"
        subtitle="Free, private, and instant."
        primary={{ label: "Start Combining", to: "/image-combiner" }}
        secondary={{ label: "Try Prompt Generator", to: "/prompt-generator" }}
      />

      <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <AdPlaceholder size="leaderboard" slotId="ic-above-footer" label="Adstera Ad Placement — Above Footer" />
      </div>

      <SiteFooter />
      <StickyMobileAd />
    </div>
  );
}
