import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Toaster } from "sonner";
import {
  Layers,
  Infinity as InfinityIcon,
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

export const Route = createFileRoute("/image-combiner")({
  component: ImageCombinerPage,
  head: () => ({
    meta: [
      { title: "AI Image Combiner — Merge Unlimited Images into One | AIXO" },
      {
        name: "description",
        content:
          "Free online AI Image Combiner. Merge unlimited PNG, JPG, or WEBP images into one organized image grid — private, browser-based, no signup, no watermark.",
      },
      { property: "og:title", content: "AI Image Combiner — Merge Unlimited Images into One" },
      {
        property: "og:description",
        content: "Combine dozens of images into one clean grid — private, fast, browser-only.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://prompt-sparkle-ai-37.lovable.app/image-combiner" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AI Image Combiner — AIXO" },
      {
        name: "twitter:description",
        content: "Merge unlimited images into one — private, fast, browser-only.",
      },
    ],
    links: [{ rel: "canonical", href: "https://prompt-sparkle-ai-37.lovable.app/image-combiner" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "AIXO Image Combiner",
          applicationCategory: "MultimediaApplication",
          operatingSystem: "Web",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          description:
            "Free browser-based tool that merges unlimited images into one clean grid.",
        }),
      },
    ],
  }),
});

const FEATURES: Card[] = [
  {
    icon: InfinityIcon,
    title: "Unlimited Uploads",
    text: "Merge as many images as your device can hold — no per-session caps, no hidden limits.",
  },
  {
    icon: Download,
    title: "High Quality Export",
    text: "Choose PNG, JPG, or WEBP at standard, high, or ultra resolution for pixel-sharp output.",
  },
  {
    icon: MousePointerClick,
    title: "Drag & Drop",
    text: "Add files with a drop, reorder with a drag, and preview every change instantly.",
  },
  {
    icon: Lock,
    title: "Processed Locally",
    text: "Everything runs in your browser via the Canvas API — zero uploads, complete privacy.",
  },
];

const FAQS = [
  {
    q: "How do I combine multiple images into one online?",
    a: "Upload your images to the AIXO Image Combiner, drag them into the order you like, pick your layout and export format, then click Download. The merged image is generated instantly in your browser.",
  },
  {
    q: "Is the Image Combiner really free?",
    a: "Yes. AIXO is 100% free with no account, no watermark, and no daily limits.",
  },
  {
    q: "Are my images uploaded to a server?",
    a: "No. All merging happens locally in your browser using the Canvas API. Your files never leave your device.",
  },
  {
    q: "How many images can I merge?",
    a: "There's no hard limit. You can combine dozens or hundreds depending on your device's memory.",
  },
  {
    q: "Which formats can I upload and export?",
    a: "Upload PNG, JPG, JPEG, and WEBP. Export as PNG, JPG, or WEBP.",
  },
  {
    q: "Can I control the grid layout and spacing?",
    a: "Yes. Choose auto or fixed 2–5 column grids, tweak spacing, add borders, and set rounded corners.",
  },
  {
    q: "Does it work on mobile phones and tablets?",
    a: "Fully. The interface is responsive and supports touch drag-and-drop on modern mobile browsers.",
  },
  {
    q: "Can I add numbers or labels to each image?",
    a: "Yes. Toggle number labels to overlay a numbered badge on each image in the merged output.",
  },
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
            <Layers className="h-3.5 w-3.5" /> Merge unlimited images · 100% browser-based
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
            <span className="text-gradient-brand">AI Image Combiner</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground sm:text-lg">
            Combine dozens of images into one clean, organized image — fast, private, and free.
          </p>
        </motion.div>
      </section>

      {/* Ad — below hero */}
      <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <AdPlaceholder size="banner" slotId="ic-below-hero" label="Adstera Ad Placement — Below Hero" />
      </div>

      {/* Tool */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10">
        <ImageCombinerTool />
      </section>

      {/* Ad — between tool and features */}
      <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <AdPlaceholder size="banner" slotId="ic-post-tool" label="Adstera Ad Placement — Between Tool and Features" />
      </div>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Features"
          title="Built for speed, quality, and privacy"
          subtitle="Everything you need to merge images cleanly — and nothing you don't."
        />
        <div className="mt-10">
          <CardGrid cards={FEATURES} cols={4} />
        </div>
      </section>

      {/* How to use */}
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <LongForm
          eyebrow="How to use"
          title="How to combine images with AIXO"
          paragraphs={[
            "The <strong>AIXO Image Combiner</strong> is designed to be effortless. Start by dragging your images into the upload area or clicking to browse. Supported formats include <strong>PNG, JPG, JPEG, and WEBP</strong>, and you can add as many files as your device can handle — there's no cap and no queue.",
            "Once your images appear as thumbnails, arrange them in the order you want. Grab any tile and drop it into a new position; the preview updates live so you always see the final layout. If you'd like numbered labels — great for tutorials, product catalogs, or bug reports — toggle them on and each image gets a clean badge in the corner.",
            "Choose a <strong>grid layout</strong> that fits your content. Auto mode balances rows automatically, or you can lock the grid to 2, 3, 4, or 5 columns. Adjust the spacing between images, add rounded corners, and set a border color if you want a framed look. Every option is optional — the defaults produce a polished result in one click.",
            "When you're ready, pick your <strong>export format</strong> — PNG for lossless quality, JPG for smaller files, or WEBP for the best balance of size and clarity. Select a quality tier (Standard, High, or Ultra) depending on where the image will end up, then hit <strong>Download</strong>. The file saves directly to your device in seconds.",
            "The whole process runs <strong>entirely in your browser</strong>. Your images never touch a server, no account is required, and there are no watermarks on the output. AIXO is genuinely free — the perfect companion for creators, students, marketers, and anyone who works with lots of visuals.",
          ]}
        />
      </section>

      {/* Ad — above FAQ */}
      <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <AdPlaceholder size="banner" slotId="ic-pre-faq" label="Adstera Ad Placement — Above FAQ" />
      </div>

      <FaqSection faqs={FAQS} />

      <CtaSection
        title="Merge your first image grid now"
        subtitle="Free, private, and instant. No signup, no watermark, no waiting."
        primary={{ label: "Start Combining", to: "/image-combiner" }}
        secondary={{ label: "Try Prompt Generator", to: "/prompt-generator" }}
      />

      {/* Above-footer ad */}
      <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <AdPlaceholder size="leaderboard" slotId="ic-above-footer" label="Adstera Ad Placement — Above Footer" />
      </div>

      <SiteFooter />
      <StickyMobileAd />
    </div>
  );
}
