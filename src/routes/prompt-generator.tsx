import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Toaster } from "sonner";
import { Wand2, Youtube, Search, Megaphone, Code2 } from "lucide-react";
import { AdPlaceholder, StickyMobileAd } from "@/components/AdPlaceholder";
import SiteHeader, { SiteFooter } from "@/components/SiteHeader";
import PromptGenerator from "@/components/PromptGenerator";
import {
  CardGrid,
  CtaSection,
  FaqSection,
  LongForm,
  SectionHeading,
  type Card,
} from "@/components/PageSections";

export const Route = createFileRoute("/prompt-generator")({
  component: PromptGeneratorPage,
  head: () => ({
    meta: [
      { title: "AI Prompt Generator — Free ChatGPT & Midjourney Prompt Builder | AIXO" },
      {
        name: "description",
        content:
          "Free AI Prompt Generator by AIXO. Build structured, expert-level prompts for ChatGPT, Claude, Gemini, and Midjourney in 20+ languages — no signup.",
      },
      { property: "og:title", content: "AI Prompt Generator — AIXO" },
      {
        property: "og:description",
        content: "Structured, high-quality AI prompts in 20+ languages — free and instant.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://prompt-sparkle-ai-37.lovable.app/prompt-generator" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AI Prompt Generator — AIXO" },
      {
        name: "twitter:description",
        content: "Structured, high-quality AI prompts in 20+ languages.",
      },
    ],
    links: [{ rel: "canonical", href: "https://prompt-sparkle-ai-37.lovable.app/prompt-generator" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "AIXO Prompt Generator",
          applicationCategory: "ProductivityApplication",
          operatingSystem: "Web",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          description:
            "Free structured AI prompt builder for ChatGPT, Claude, Gemini, and Midjourney.",
        }),
      },
    ],
  }),
});

const USE_CASES: Card[] = [
  {
    icon: Youtube,
    title: "YouTube",
    text: "Generate video titles, hooks, scripts, descriptions, and thumbnail concepts that boost click-through and watch time.",
  },
  {
    icon: Search,
    title: "SEO",
    text: "Craft prompts for keyword research, meta titles, blog outlines, and on-page content that ranks and converts.",
  },
  {
    icon: Megaphone,
    title: "Marketing",
    text: "Build prompts for ad copy, landing pages, email sequences, and social captions with a consistent brand voice.",
  },
  {
    icon: Code2,
    title: "Coding",
    text: "Produce clear, contextual coding prompts for bug fixes, refactors, tests, and architecture reviews.",
  },
];

const FAQS = [
  {
    q: "What is an AI Prompt Generator?",
    a: "An AI Prompt Generator turns a rough idea into a structured, high-quality prompt that language models like ChatGPT, Claude, Gemini, or image models like Midjourney can execute reliably.",
  },
  {
    q: "Is the AIXO Prompt Generator free?",
    a: "Yes. It's 100% free with no signup, no daily limits, and no watermarks on the output.",
  },
  {
    q: "Which AI models does it support?",
    a: "The generator produces prompts that work with any modern LLM — ChatGPT, Claude, Gemini, Grok, and open-source models — plus image models like Midjourney, DALL·E, and Stable Diffusion.",
  },
  {
    q: "Can I generate prompts in different languages?",
    a: "Yes. AIXO supports 20+ output languages, so you can produce prompts in English, Spanish, French, German, Arabic, Hindi, Urdu, Chinese, Japanese, and more.",
  },
  {
    q: "How is a good prompt different from a bad one?",
    a: "Good prompts give the model a clear role, specific context, an exact task, constraints, and a desired output format. Weak prompts skip most of these and rely on guessing.",
  },
  {
    q: "Do you store my prompts on a server?",
    a: "No. Prompt generation happens in your browser session and nothing is stored on our side.",
  },
  {
    q: "Can I use these prompts commercially?",
    a: "Yes. You own everything you create with AIXO and can use it in client work, courses, and products.",
  },
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

      {/* Ad — below hero */}
      <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <AdPlaceholder size="banner" slotId="pg-below-hero" label="Adstera Ad Placement — Below Hero" />
      </div>

      {/* Tool */}
      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <PromptGenerator />
      </section>

      {/* Ad — between tool and features */}
      <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <AdPlaceholder size="banner" slotId="pg-post-tool" label="Adstera Ad Placement — Between Tool and Features" />
      </div>

      {/* Popular use cases */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Use cases"
          title="Popular use cases"
          subtitle="From content creation to code — one generator, endless workflows."
        />
        <div className="mt-10">
          <CardGrid cards={USE_CASES} cols={4} />
        </div>
      </section>

      {/* Long form guide */}
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <LongForm
          eyebrow="Prompt Engineering"
          title="How to write better AI prompts"
          paragraphs={[
            "<strong>Prompt engineering</strong> is the practice of shaping instructions so an AI model produces exactly what you want. The same model can feel brilliant or useless depending on how you brief it — a strong prompt is the difference between generic output and expert-level results.",
            "Every effective prompt has five moving parts: a <strong>role</strong> that tells the model who it is (\"You are a senior copywriter\"), <strong>context</strong> that grounds the task (audience, brand voice, product), a <strong>clear task</strong> (\"Write three subject lines\"), <strong>constraints</strong> (length, tone, format, forbidden words), and a defined <strong>output structure</strong> (markdown, JSON, bullet list). Leave any one out and the model has to guess.",
            "The best practices are simple. Be <strong>specific</strong> — replace \"write a blog post\" with \"write a 700-word blog post for beginner React developers about useEffect pitfalls, with three code examples.\" Give <strong>examples</strong> when possible — a single sample output teaches the model your standard faster than any adjective. <strong>Iterate</strong> — treat the first response as a draft, then refine with follow-up instructions like \"tighter, less formal, add a hook.\"",
            "Common <strong>mistakes</strong>: asking multiple unrelated questions at once, using vague adjectives (\"make it good\"), forgetting to specify the audience, mixing English with other languages inconsistently, and skipping the output format so the model returns prose when you needed a table. Another frequent trap is over-restricting the model with contradictory constraints (\"formal but funny, short but thorough\") — pick one direction and commit.",
            "The <strong>AIXO Prompt Generator</strong> handles all of this for you. Describe your goal, pick a category, a tone, and an output language, and it assembles a professionally structured prompt in seconds — ready to paste into ChatGPT, Claude, Gemini, Midjourney, or any other AI tool. Whether you're a marketer, developer, student, or founder, better prompts mean better results, less rework, and dramatically faster workflows.",
          ]}
        />
      </section>

      {/* Ad — above FAQ */}
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
