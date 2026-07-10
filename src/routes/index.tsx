import { createFileRoute } from "@tanstack/react-router";
import LandingPage from "@/components/LandingPage";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "AIXO — Free AI Tools & Micro SaaS Toolkit (Image Combiner + Prompt Generator)" },
      {
        name: "description",
        content:
          "Free AI tools by AIXO: merge images online with the AI Image Combiner and craft expert ChatGPT prompts with the AI Prompt Generator. Private, fast, no signup.",
      },
      { property: "og:title", content: "AIXO — Free AI Tools & Micro SaaS Toolkit" },
      {
        property: "og:description",
        content:
          "Merge images and generate structured AI prompts — a private, browser-based toolkit for creators.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://prompt-sparkle-ai-37.lovable.app/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AIXO — Free AI Tools & Micro SaaS Toolkit" },
      {
        name: "twitter:description",
        content:
          "Free micro SaaS AI toolkit: image combiner and prompt generator.",
      },
    ],
    links: [{ rel: "canonical", href: "https://prompt-sparkle-ai-37.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "AIXO",
          applicationCategory: "ProductivityApplication",
          operatingSystem: "Web",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          description:
            "Micro SaaS toolkit with AI Image Combiner and AI Prompt Generator.",
        }),
      },
    ],
  }),
});

function Index() {
  return <LandingPage />;
}
