import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Toaster } from "sonner";
import { Layers } from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { AdPlaceholder, StickyMobileAd } from "@/components/AdPlaceholder";
import SiteHeader, { SiteFooter } from "@/components/SiteHeader";
import ImageCombinerTool from "@/components/ImageCombinerTool";

export const Route = createFileRoute("/image-combiner")({
  component: ImageCombinerPage,
  head: () => ({
    meta: [
      { title: "AI Image Combiner — Merge Unlimited Images into One | AIXO" },
      {
        name: "description",
        content:
          "Free browser-based AI Image Combiner. Merge unlimited PNG, JPG, or WEBP images into one organized image for ChatGPT, research, and social media. 100% private.",
      },
      { property: "og:title", content: "AI Image Combiner — Merge Unlimited Images into One" },
      {
        property: "og:description",
        content: "Combine dozens of images into one smart image, right in your browser.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AI Image Combiner — AIXO" },
      {
        name: "twitter:description",
        content: "Merge unlimited images into one — private, fast, browser-only.",
      },
    ],
    links: [{ rel: "canonical", href: "/image-combiner" }],
  }),
});

const FAQS = [
  { q: "Is the AI Image Combiner really free?", a: "Yes. It's 100% free with no account, no watermark, and no upload limits." },
  { q: "Are my images uploaded to a server?", a: "Never. All merging happens locally in your browser using the Canvas API. Your files never leave your device." },
  { q: "How many images can I combine?", a: "There's no hard limit — you can combine dozens or even hundreds, depending on your device's memory." },
  { q: "Which formats are supported?", a: "You can upload PNG, JPG, JPEG, and WEBP images and export as PNG, JPG, or WEBP." },
  { q: "Can I control the grid layout?", a: "Yes. Choose Auto or fix 2, 3, 4, or 5 columns, adjust spacing, borders, and rounded corners." },
  { q: "Does it work on mobile?", a: "Absolutely. The tool is fully responsive and works on modern mobile browsers." },
  { q: "Can I add numbers to each image?", a: "Yes. Toggle number labels on to overlay a numbered badge on each image in the merged output." },
  { q: "What's the maximum output quality?", a: "Ultra quality preserves near-original resolution. Use High or Standard for smaller file sizes." },
];

function ImageCombinerPage() {
  return (
    <div className="min-h-screen bg-background pb-[60px] text-foreground md:pb-0">
      <Toaster richColors position="top-center" theme="dark" />
      <SiteHeader />

      {/* Compact hero */}
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

      {/* Tool */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10">
        <ImageCombinerTool />
      </section>

      {/* Ad — above FAQ */}
      <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <AdPlaceholder size="banner" slotId="ic-pre-faq" label="Adstera Ad Placement — Above FAQ" />
      </div>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Frequently asked questions</h2>
          <p className="mt-3 text-muted-foreground">Everything you need to know about the AI Image Combiner.</p>
        </div>
        <Accordion type="single" collapsible className="mt-8">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`f-${i}`} className="border-white/10">
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Above-footer ad */}
      <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <AdPlaceholder size="leaderboard" slotId="ic-above-footer" label="Adstera Ad Placement — Above Footer" />
      </div>

      <SiteFooter />
      <StickyMobileAd />
    </div>
  );
}
